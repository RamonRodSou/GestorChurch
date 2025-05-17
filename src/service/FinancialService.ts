import { addDoc, collection, getDocs } from "firebase/firestore";
import { Financial } from "@domain/financial";
import { auth, db } from "./firebase";
import { DateUtil } from "@domain/utils";


export async function financialAdd(financial: Financial) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'financials'), {
            userId: user.uid,
            type: financial.type,
            value: financial.value,
            description: financial.description,
            createdAt: DateUtil.dateFormatedPtBr(financial.createdAt),
        });
    } catch (error) {
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
        throw error;
    }
}