import { ReportChurch } from "@domain/report";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function reportChurchAdd(report: ReportChurch) {
    try {
        const user = getAuthenticatedUser();
        await savereportToDatabase(report, user.uid);

    } catch (error) {
        alert('Erro ao adicionar membro: ' + error);
        throw error;
    }
}

async function savereportToDatabase(report: ReportChurch, userId: string) {
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
        createdAt: report.createdAt,
    };

    return await addDoc(collection(db, 'reports'), reportData);
}

function getAuthenticatedUser() {
    const user = auth.currentUser;
    if (!user) throw new Error("Usuário não autenticado.");
    return user;
}