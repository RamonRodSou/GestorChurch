import { ReportChurch } from "@domain/report";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { DateUtil } from "@domain/utils";

export async function reportChurchAdd(report: ReportChurch) {
    try {
        const user = getAuthenticatedUser();
        await saveReportToDatabase(report, user.uid);

    } catch (error) {
        alert('Erro ao adicionar relatório: ' + error);
        throw error;
    }
}

export async function findAllReports(): Promise<ReportChurch[]> {
    try {
        getAuthenticatedUser();

        const snapshot = await getDocs(collection(db, 'reports'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as ReportChurch));
    } catch (error) {
        alert('Erro ao listar os Reletórios da Igreja: ' + error);
        throw error;
    }
}

export async function findReportChurchToById(groupId: string): Promise<ReportChurch | null> {
    try {
        const ref = doc(db, 'reports', groupId);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as ReportChurch;
    } catch (error) {
        alert('Erro ao atualizar o GC: ' + error);
        throw error;
    }
}

export async function reportUpdate(id: string, data: Partial<any>): Promise<void> {
    try {
        const ref = doc(db, 'reports', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar relatório: ' + error);
        throw error;
    }
}

async function saveReportToDatabase(report: ReportChurch, userId: string) {
    const reportData = {
        userId,
        worship: report.worship,
        totalPeople: report.totalPeople,
        timePeriod: report.timePeriod,
        totalChildren: report.totalChildren,
        totalVolunteers: report.totalVolunteers,
        decisionsForJesus: report.decisionsForJesus,
        baptismCandidates: report.baptismCandidates,
        firstTimeVisitors: report.firstTimeVisitors,
        newMembers: report.newMembers,
        peopleBaptizedThisMonth: report.peopleBaptizedThisMonth,
        observation: report.observation,
        isActive: report.isActive,
        createdAt: DateUtil.dateFormatedPtBr(report.createdAt),
    };

    return await addDoc(collection(db, 'reports'), reportData);
}

function getAuthenticatedUser() {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");
    return user;
}