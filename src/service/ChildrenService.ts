import { auth, db } from "./firebase";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { Batism } from "@domain/batism";
import { findGroupToById, groupUpdate } from "./GroupService";
import { Child, ChildSummary } from "@domain/user";

export async function childAdd(child: Child) {
    try {
        const user = getAuthenticatedUser();
        const passwordHash = await child.getPasswordHash();

        const childRef = await saveChildToDatabase(child, user.uid, passwordHash);

        if(child.groupId != null) await addChildToGroup(child, childRef);

        await updateParentReferences(child, childRef.id);

    } catch (error) {
        alert('Erro ao adicionar membro: ' + error);
        throw error;
    }
}

export async function findAllChildrens(): Promise<Child[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'childrens'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Child));
    } catch (error) {
        alert('Erro ao listar as criançãs: ' + error);
        throw error;
    }
}

export async function findAllChildrensSummary(): Promise<ChildSummary[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'childrens'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ChildSummary));
    } catch (error) {
        alert('Erro ao listar as crianças: ' + error);
        throw error;
    }
}

export async function findChildToById(id: string): Promise<Child | null> {
    try {
        const ref = doc(db, 'childrens', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as Child;
    } catch (error) {
        alert('Erro ao buscar as crianças: ' + error);
        throw error;
    }
}

export async function childUpdate(id: string, data: Partial<Child>): Promise<void> {
    try {
        const ref = doc(db, 'childrens', id);

        const batism = data.batism ? Batism.fromJson(data.batism).toJSON() : null;

        const plainData: any = {
            ...data,
            batism,
            children: data.parents ?? (await getDoc(ref)).data()?.children ?? []
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

async function saveChildToDatabase(child: Child, userId: string, passwordHash: string) {
    const data = {
        userId,
        name: child.name,
        birthdate: child.birthdate ? child.birthdate.toJSON() : null,
        email: child.email,
        phone: child.phone,
        groupId: child.groupId,
        batism: child.batism ? Batism.fromJson(child.batism).toJSON() : null,
        parents: child.parents.map((it) =>
            typeof it === "string" ? it : it?.toJSON?.() ?? null
        ),
        role: child.role,
        ageGroup: child.ageGroup,
        medication: child.medication,
        specialNeed : child.specialNeed,
        allergy: child.allergy,
        isImageAuthorized: child.isImageAuthorized,
        isActive: child.isActive,
        createdAt: child.createdAt,
        passwordHash,
    };

    return await addDoc(collection(db, 'childrens'), data);
}

async function addChildToGroup(child: Child, childRef: any) {
    const summary = new ChildSummary(
        childRef.id,
        child.name,
        child.phone
    );

    const group = await findGroupToById(child.groupId!);
    if (!group) {
        throw new Error('Grupo não encontrado');
    }
    
    const updatedChildrens = [...(group.members ?? []), summary.toJSON()];
    await groupUpdate(group.id, { members: updatedChildrens });
}

async function updateParentReferences(child: Child, childId: string) {
    const childrenSummary = new ChildSummary(
        childId,
        child.name,
        child.phone
    ).toJSON();

    for (const parent of child.parents) {
        if (!parent || typeof parent === "string" || !parent.id) continue;

        const parentDocRef = doc(db, 'members', parent.id);
        const parentSnapshot = await getDoc(parentDocRef);

        if (!parentSnapshot.exists()) continue;

        const parentData = parentSnapshot.data();
        const parentChildren = Array.isArray(parentData.children) ? parentData.children : [];

        const index = parentChildren.findIndex((child: any) =>
            getFirstName(child.name) === getFirstName(child.name)
        );

        if (index !== -1) {
            parentChildren[index] = childrenSummary;
        } else {
            parentChildren.push(childrenSummary);
        }

        await updateDoc(parentDocRef, {
            children: parentChildren,
        });
    }
}

function getFirstName(fullName: string) {
    return fullName.trim().split(" ")[0].toLowerCase();
}