import { addDoc, collection, getDocs } from "firebase/firestore";
import { Financial, FinancialSummary } from "@domain/financial";
import { auth, db } from "./firebase";

export async function financialAdd(financial: Financial) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'financials'), {
            userId: user.uid,
            member: financial.member,
            income: financial.income,
            expense: financial.expense,
            createdAt: financial.createdAt,
        });
    } catch (error) {
        alert('Erro ao registrar financeiro: ' + error);
        throw error;
    }
}

export async function financialSummaryAdd(financial: FinancialSummary) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'financials'), {
            userId: user.uid,
            income: financial.income,
            expense: financial.expense,
            createdAt: financial.createdAt,
        });
    } catch (error) {
        alert('Erro ao registrar financeiro: ' + error);
        throw error;
    }
}

export async function findAllFinancials(): Promise<Financial[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'financials'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Financial));
    } catch (error) {
        alert('Erro ao listar registros financeiros: ' + error);
        throw error;
    }
}