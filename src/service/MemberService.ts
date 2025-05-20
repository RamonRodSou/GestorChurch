import { Member, MemberSummary } from "@domain/user";
import { auth, db } from "./firebase";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Batism } from "@domain/batism";
import { EMPTY } from "@domain/utils/string-utils";
import { DateUtil, ensureMemberSummary } from "@domain/utils";
import { findGroupToById, groupUpdate } from "./GroupService";

export async function memberAdd(member: Member) {
    try {
        const user = getAuthenticatedUser();
        const passwordHash = await member.getPasswordHash();

        const memberRef = await saveMemberToDatabase(member, user.uid, passwordHash);

        if(member.groupId != null) await addMemberToGroup(member, memberRef);

        await updateSpouseReferences(member, memberRef.id);

    } catch (error) {
        alert('Erro ao adicionar membro: ' + error);
        throw error;
    }
}

export async function findAllMembers(): Promise<Member[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'members'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member));
    } catch (error) {
        alert('Erro ao listar membros: ' + error);
        throw error;
    }
}

export async function findAllMembersSummary(): Promise<MemberSummary[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'members'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as MemberSummary));
    } catch (error) {
        alert('Erro ao listar membro: ' + error);
        throw error;
    }
}

export async function findMemberToById(id: string): Promise<Member | null> {
    try {
        const ref = doc(db, 'members', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as Member;
    } catch (error) {
        alert('Erro ao buscar membro: ' + error);
        throw error;
    }
}

export async function memberUpdate(id: string, data: Partial<Member>): Promise<void> {
    try {
        const ref = doc(db, 'members', id);

        const batism = data.batism ? Batism.fromJson(data.batism).toJSON() : null;

        const plainData: any = {
            ...data,
            batism,
            spouse: data.spouse ? getSpouseSummary(data.spouse) : null,
            children: data.child ?? (await getDoc(ref)).data()?.child ?? []
        };

        await updateDoc(ref, plainData);
    } catch (error) {
        alert('Erro ao atualizar membro: ' + error);
        throw error;
    }
}

function getAuthenticatedUser() {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");
    return user;
}

function getSpouseSummary(spouse: any) {
    return spouse !== null &&
        spouse !== undefined &&
        (typeof spouse !== 'string' || spouse !== EMPTY)
        ? ensureMemberSummary(spouse).toJSON()
        : null;
}

async function saveMemberToDatabase(member: Member, userId: string, passwordHash: string) {
    const memberData = {
        userId,
        name: member.name,
        birthdate: member.birthdate ? member.birthdate.toJSON() : null,
        cpf: member.cpf,
        email: member.email,
        phone: member.phone,
        groupId: member.groupId,
        street: member.street,
        houseNumber: member.houseNumber,
        city: member.city,
        state: member.state,
        zipCode: member.zipCode,
        neighborhood: member.neighborhood,
        batism: member.batism ? Batism.fromJson(member.batism).toJSON() : null,
        civilStatus: member.civilStatus,
        spouse: getSpouseSummary(member.spouse),
        children: member.child.map((child) =>
            typeof child === "string" ? child : child?.toJSON?.() ?? null
        ),
        role: member.role,
        isActive: member.isActive,
        isImageAuthorized: member.isImageAuthorized,
        createdAt: DateUtil.dateFormatedPtBr(member.createdAt),
        passwordHash,
    };

    return await addDoc(collection(db, 'members'), memberData);
}

async function addMemberToGroup(member: Member, memberRef: any) {
    const memberSummary = new MemberSummary(
        memberRef.id,
        member.name,
        member.email,
        member.phone
    );

    const group = await findGroupToById(member.groupId!);
    if (!group) {
        throw new Error('Grupo não encontrado');
    }
    const updatedMembers = [...(group.members ?? []), memberSummary.toJSON()];
    await groupUpdate(group.id, { members: updatedMembers });
}

async function updateSpouseReferences(member: Member, memberId: string) {
    
    const membersQuery = query(
        collection(db, 'members'),
        where('spouse.id', '==', member.id)
    );
    
    const spouseSnapshot = await getDocs(membersQuery);

    const thisMemberSummary = {
        id: memberId,
        name: member.name,
        email: member.email,
    };

    for (const spouseDoc of spouseSnapshot.docs) {
        const spouseId = spouseDoc.id;
        const spouseData = spouseDoc.data();

        const spouseSummary = {
            id: spouseId,
            name: spouseData.name,
            email: spouseData.email,
        };

        await Promise.all([
            updateDoc(doc(db, 'members', spouseId), { spouse: thisMemberSummary }),
            updateDoc(doc(db, 'members', memberId), { spouse: spouseSummary }),
        ]);
    }
}
