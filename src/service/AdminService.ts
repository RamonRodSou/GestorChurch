import { AdminSummary } from "@domain/user";
import { auth, db } from "@service/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export async function findAdminToById(id: string): Promise<AdminSummary | null> {
    try {
        const ref = doc(db, 'admins', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as AdminSummary;
    } catch (error) {
        alert('Erro ao buscar admin: ' + error);
        throw error;
    }
}
 

export async function findAllAdmins(): Promise<AdminSummary[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'admins'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as AdminSummary));
    } catch (error) {
        alert('Erro ao listar membros do Gcs: ' + error);
        throw error;
    }
}