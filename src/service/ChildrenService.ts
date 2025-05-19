import { Children, ChildrenSummary } from "@domain/user";
import { auth, db } from "./firebase";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { Batism } from "@domain/batism";
import { DateUtil } from "@domain/utils";
import { findGroupToById, groupUpdate } from "./GroupService";
import { findAllMembers, memberUpdate } from "./MemberService";

export async function childrenAdd(children: Children) {
    try {
        const user = getAuthenticatedUser();
        const passwordHash = await children.getPasswordHash();

        const childrenRef = await saveChildrenToDatabase(children, user.uid, passwordHash);

        if(children.groupId != null) await addChildrenToGroup(children, childrenRef);

        await updateParentReferences(children, childrenRef.id);

    } catch (error) {
        alert('Erro ao adicionar membro: ' + error);
        throw error;
    }
}

export async function findAllChildrens(): Promise<Children[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'childrens'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Children));
    } catch (error) {
        alert('Erro ao listar as criançãs: ' + error);
        throw error;
    }
}

export async function findAllChildrensSummary(): Promise<ChildrenSummary[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'childrens'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ChildrenSummary));
    } catch (error) {
        alert('Erro ao listar as crianças: ' + error);
        throw error;
    }
}

export async function findChildrenToById(id: string): Promise<Children | null> {
    try {
        const ref = doc(db, 'childrens', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as Children;
    } catch (error) {
        alert('Erro ao buscar as crianças: ' + error);
        throw error;
    }
}

export async function childrenUpdate(id: string, data: Partial<Children>): Promise<void> {
    try {
        const ref = doc(db, 'childrens', id);

        const batism = data.batism ? Batism.fromJson(data.batism).toJSON() : null;

        const plainData: any = {
            ...data,
            batism,
            children: data.parent ?? (await getDoc(ref)).data()?.children ?? []
        };

        await updateDoc(ref, plainData);
    } catch (error) {
        alert('Erro ao atualizar a criança: ' + error);
        throw error;
    }
}


function getAuthenticatedUser() {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");
    return user;
}

async function saveChildrenToDatabase(children: Children, userId: string, passwordHash: string) {
    const data = {
        userId,
        name: children.name,
        birthdate: children.birthdate ? children.birthdate.toJSON() : null,
        email: children.email,
        phone: children.phone,
        groupId: children.groupId,
        batism: children.batism ? Batism.fromJson(children.batism).toJSON() : null,
        parent: children.parent.map((it) =>
            typeof it === "string" ? it : it?.toJSON?.() ?? null
        ),
        role: children.role,
        isActive: children.isActive,
        createdAt: DateUtil.dateFormatedPtBr(children.createdAt),
        passwordHash,
    };

    return await addDoc(collection(db, 'childrens'), data);
}

async function addChildrenToGroup(children: Children, childrenRef: any) {
    const summary = new ChildrenSummary(
        childrenRef.id,
        children.name,
        children.phone
    );

    const group = await findGroupToById(children.groupId!);
    if (!group) {
        throw new Error('Grupo não encontrado');
    }
    
    const updatedChildrens = [...(group.members ?? []), summary.toJSON()];
    await groupUpdate(group.id, { members: updatedChildrens });
}

async function updateParentReferences(children: Children, childrenId: string) {
    const members = await findAllMembers();
    const childrenSummary: ChildrenSummary = new ChildrenSummary (
        childrenId,
        children.name,
        children.phone,
    );

    for (const parentName of children.parent) {
        if (!parentName || typeof parentName !== "string") continue;

        const parentFirstName = getFirstName(parentName);

        const parent = members.find(m =>
            getFirstName(m.name) === parentFirstName
        );

        if (!parent) continue;

        const parentChildren = parent.children ?? [];

        const index = parentChildren.findIndex(c =>
            getFirstName(c.name) === getFirstName(children.name)
        );

        if (index !== -1) {
            parentChildren[index] = childrenSummary; 
        } else {
            parentChildren.push(childrenSummary); 

        await memberUpdate(parent.id, {
            children: parentChildren,
        });
    }
    }
}

function getFirstName(fullName: string) {
    return fullName.trim().split(" ")[0].toLowerCase();
}