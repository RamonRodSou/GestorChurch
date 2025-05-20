import { ReportGroup } from "@domain/report";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { DateUtil } from "@domain/utils";

export async function reportGroupAdd(report: ReportGroup) {
    try {
        const user = getAuthenticatedUser();
        await saveReportGroupToDatabase(report, user.uid);

    } catch (error) {
        alert('Erro ao adicionar relatório: ' + error);
        throw error;
    }
}

export async function findAllReportsGroup(): Promise<ReportGroup[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'report_groups'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ReportGroup));
    } catch (error) {
        alert('Erro ao listar os Reletórios dos Gcs: ' + error);
        throw error;
    }
}

export async function findReportGroupToById(groupId: string): Promise<ReportGroup | null> {
    try {
        const ref = doc(db, 'report_groups', groupId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as ReportGroup;
    } catch (error) {
        alert('Erro ao atualizar o GC: ' + error);
        throw error;
    }
}

export async function reportGroupUpdate(id: string, data: Partial<any>): Promise<void> {
    try {
        const ref = doc(db, 'report_groups', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar relatório: ' + error);
        throw error;
    }
}

async function saveReportGroupToDatabase(report: ReportGroup, userId: string) {
    const reportData = {
        userId,
        groupId: report.groupId,
        weekDay: report.weekDay,
        time: report.time,
        members: report.members.map((member) => ({
            id: member.id,
            name: member.name,
        })),
        childrens: report.childrens.map((child) => ({
            id: child.id,
            name: child.name, 
        })),
        visitors: report.visitors.map((visitor) => ({
            id: visitor.id,
            name: visitor.name,
        })),
        value: report.value,
        observation: report.observation,
        isActive: report.isActive,
        createdAt: DateUtil.dateFormatedPtBr(report.createdAt)
    };

    return await addDoc(collection(db, 'report_groups'), reportData);
}

function getAuthenticatedUser() {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");
    return user;
}