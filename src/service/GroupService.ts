import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Group, GroupSummary } from "@domain/group";

export async function groupAdd(group: Group) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const groupRef = await addDoc(collection(db, 'groups'), {
            userId: user.uid,
            name: group.name,
            weekDay: group.weekDay,
            street: group.street,
            houseNumber: group.houseNumber,
            city: group.city,
            state: group.state,
            zipCode: group.zipCode,
            neighborhood: group.neighborhood,
            leaders: group.leaders.map((it) => 
                typeof it === "string"
                ? it
                : it?.toJSON?.() ?? null
            ),
            members: group.leaders.map((it) => 
                typeof it === "string"
                ? it
                : it?.toJSON?.() ?? null
            ),
            isActive: group.isActive,
            createdAt: group.createdAt,
        });

        const groupId = groupRef.id;

        await Promise.all(
            group.leaders.map(async (leader) => {
                const leaderId = typeof leader === "string" ? leader : leader.id;
                const memberRef = doc(db, 'members', leaderId);
                await updateDoc(memberRef, {
                    groupId: groupId
                });
            })
        );

    } catch (error) {
        alert('Erro ao adicionar membro do Gcs: ' + error);
        throw error;
    }
}

export async function findAllGroups(): Promise<Group[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'groups'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Group));
    } catch (error) {
        alert('Erro ao listar membros do Gcs: ' + error);
        throw error;
    }
}

export async function findAllGroupsSummary(): Promise<GroupSummary[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'groups'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GroupSummary));
    } catch (error) {
        alert('Erro ao listar Gcs: ' + error);
        throw error;
    }
}

export async function findGroupToById(groupId: string): Promise<Group | null> {
    try {
        const ref = doc(db, 'groups', groupId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as Group;

    } catch (error) {
        alert('Erro ao atualizar o GC: ' + error);
        throw error;
    }
}

export async function findGroupSummaryToById(groupId: string): Promise<GroupSummary | null> {
    try {
        const ref = doc(db, 'groups', groupId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as GroupSummary;
    } catch (error) {
        alert('Erro ao atualizar o GC: ' + error);
        throw error;
    }
}

export async function groupUpdate(id: string, data: Partial<any>): Promise<void> {
    try {
        const ref = doc(db, 'groups', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar groups: ' + error);
        throw error;
    }
}