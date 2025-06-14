import { Member, MemberSummary } from "@domain/user";
import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Batism } from "@domain/batism";
import { EMPTY } from "@domain/utils/string-utils";
import { ensureMemberSummary } from "@domain/utils";
import { findGroupToById, groupUpdate } from "./GroupService";
import { Crud } from "@domain/GenericCrud";

const collectionName = 'members';

export async function memberAdd(member: Member) {
    try {
        const user = Crud.getAuthenticatedUser();
        const passwordHash = await member.getPasswordHash();

        const saveData = await saveMemberToDatabase(member, user.uid, passwordHash)
        const entity = Crud.add(collectionName, saveData)
        if (member.groupId != null) await addMemberToGroup(member, entity);

        if (member?.spouse?.id != null) await updateSpouseReferences(member, member.spouse.id);
        console.log('Id do espooso', member?.spouse?.id)

    } catch (error) {
        alert('Erro ao adicionar membro: ' + error);
        throw error;
    }
}

export async function memberUpdate(id: string, data: Partial<Member>): Promise<void> {
    try {
        const batism = data.batism ? Batism.fromJson(data.batism).toJSON() : null;
        const spouse = data.spouse ? getSpouseSummary(data.spouse) : null;
        const children = data.children ?? (await getDoc(doc(db, collectionName, id))).data()?.children ?? [];
        const entity: any = {
            ...data,
            batism,
            spouse,
            children
        };

        await Crud.update<Member>(collectionName, id, entity);
    } catch (error) {
        alert('Erro ao atualizar membro: ' + error);
        throw error;
    }
}

export function findAllMembers(): Promise<Member[]> {
    return Crud.findAllSummary<Member>(collectionName)
}

export function findAllMembersSummary(): Promise<MemberSummary[]> {
    return Crud.findAllSummary<MemberSummary>(collectionName)
}

export function findMemberToById(id: string): Promise<(Member & { id: string }) | null> {
    return Crud.findById<Member>(id, collectionName);
};

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
        children: member.children.map((child) =>
            typeof child === "string" ? child : child?.toJSON?.() ?? null
        ),
        role: member.role,
        isActive: member.isActive,
        isImageAuthorized: member.isImageAuthorized,
        createdAt: member.createdAt,
        passwordHash,
    };

    return await memberData;
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

    if (!member.spouse?.id) return;

    const spouseId = member.spouse.id;
    const spouseDocRef = doc(db, collectionName, spouseId);
    const spouseSnapshot = await getDoc(spouseDocRef);

    if (!spouseSnapshot.exists()) {
        console.warn('Spouse not found with ID:', spouseId);
        return;
    }

    const spouseData = spouseSnapshot.data();

    const thisMemberSummary = {
        id: memberId,
        name: member.name,
        email: member.email,
    };

    const spouseSummary = {
        id: spouseId,
        name: spouseData.name,
        email: spouseData.email,
    };

    await Promise.all([
        updateDoc(doc(db, collectionName, memberId), { spouse: spouseSummary }),
        updateDoc(doc(db, collectionName, spouseId), { spouse: thisMemberSummary }),
    ]);

}
