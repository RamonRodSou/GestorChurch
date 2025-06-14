import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { ServiceSchedule } from "@domain/ServiceSchedule/ServiceSchedule";

export async function scheduleAdd(report: ServiceSchedule) {
    try {
        const user = getAuthenticatedUser();
        await saveReportToDatabase(report, user.uid);

    } catch (error) {
        alert('Erro ao adicionar escala: ' + error);
        throw error;
    }
}

export async function findAllSchedule(): Promise<ServiceSchedule[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'schedules'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ServiceSchedule));
    } catch (error) {
        alert('Erro ao listar os escala da Igreja: ' + error);
        throw error;
    }
}

export async function findServiceScheduleToById(groupId: string): Promise<ServiceSchedule | null> {
    try {
        const ref = doc(db, 'schedules', groupId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as ServiceSchedule;
    } catch (error) {
        alert('Erro ao atualizar o GC: ' + error);
        throw error;
    }
}

export async function schedulesUpdate(id: string, data: Partial<ServiceSchedule>): Promise<void> {
    try {
        const ref = doc(db, 'schedules', id);
        const currentDoc = await getDoc(ref);

        if (!currentDoc.exists()) {
            throw new Error(`Documento com id ${id} não encontrado`);
        }

        const currentData = currentDoc.data();

        const plainData: any = {
            ...currentData,
            ...data,
            children: data.childrens ?? (await getDoc(ref)).data()?.child ?? [],
            members: data.members ?? (await getDoc(ref)).data()?.child ?? []
        };

        await updateDoc(ref, plainData);
    } catch (error) {
        alert('Erro ao atualizar membro: ' + error);
        throw error;
    }
}

async function saveReportToDatabase(it: ServiceSchedule, userId: string) {
    const data = {
        userId,
        departament: it.departament,
        date: it.date ? it.date.toJSON() : null,
        weekDay: it.weekDay,
        timePeriod: it.timePeriod,
        leader: {
            id: it.leader?.id,
            name: it.leader?.name,
        },
        members: it.members.map((member) => ({
            id: member.id,
            name: member.name,
        })),
        childrens: it.childrens.map((child) => ({
            id: child.id,
            name: child.name, 
        })),
        observation: it.observation,
        isActive: it.isActive,
        createdAt: it.createdAt,
    };

    return await addDoc(collection(db, 'schedules'), data);
}

function getAuthenticatedUser() {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");
    return user;
}