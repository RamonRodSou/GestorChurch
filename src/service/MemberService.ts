import { Member, MemberSummary } from "@domain/user";
import { auth, db } from "./firebase";
import { addDoc, arrayUnion, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { Batism } from "@domain/batism";
import { EMPTY } from "@domain/utils/string-utils";
import { ensureMemberSummary } from "@domain/utils";

export async function findAllMembers(): Promise<Member[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'members'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Member));
    } catch (error) {
        alert('Erro ao listar membros: ' + error);
        throw error;
    }
}

export async function findAllMembersSummary(): Promise<MemberSummary[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

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
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar membro: ' + error);
        throw error;
    }
}

export async function memberAdd(member: Member) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
        const passwordHash = await member.getPasswordHash();

        const memberRef = await addDoc(collection(db, 'members'), {
            userId: user.uid,
            name: member.name,
            birthdate: member.birthdate ? member.birthdate.toJSON() : null,
            cpf: member.cpf,
            email: member.email,
            phone: member.phone,
            passwordHash: passwordHash,
            groupId: member.groupId,
            street: member.street,
            houseNumber: member.houseNumber,
            city: member.city,
            state: member.state,
            zipCode: member.zipCode,
            neighborhood: member.neighborhood,
            batism: member.batism ? Batism.fromJson(member.batism).toJSON() : null,
            civilStatus: member.civilStatus,
            spouse:
                member.spouse !== null &&
                member.spouse !== undefined &&
                (typeof member.spouse !== 'string' || member.spouse !== EMPTY)
                    ? ensureMemberSummary(member.spouse).toJSON()
                    : null,

            children: member.children.map((child) => 
                typeof child === "string"
                ? child
                : child?.toJSON?.() ?? null
            ),
            role: member.role,
            isActive: member.isActive,
            createdAt: member.createdAt,
        });

        if (member.groupId) {
            const groupRef = doc(db, 'groups', member.groupId);
            await updateDoc(groupRef, {
                memberIds: arrayUnion(memberRef.id)
            });
        }

        const membersQuery = query(
            collection(db, 'members'),
            where('spouse', '==', member.name)
        );
        const spouseSnapshot = await getDocs(membersQuery);

        for (const spouseDoc of spouseSnapshot.docs) {
            const spouseId = spouseDoc.id;
            const spouseData = spouseDoc.data();

            const thisMemberSummary = {
                id: memberRef.id,
                name: member.name,
                email: member.email,
            };

            await updateDoc(doc(db, 'members', spouseId), {
                spouse: thisMemberSummary,
            });

            const spouseSummary = {
                id: spouseId,
                name: spouseData.name,
                email: spouseData.email,
            };

            await updateDoc(doc(db, 'members', memberRef.id), {
                spouse: spouseSummary,
            });
        }

    } catch (error) {
        alert('Erro ao adicionar membro: ' + error);
        throw error;
    }
}