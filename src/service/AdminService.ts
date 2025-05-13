import { Admin, AdminSummary } from "@domain/user";
import { db } from "@service/firebase";
import { doc, getDoc } from "firebase/firestore";

export class AdminService {
    static async getAdminById(id: string): Promise<AdminSummary> {
        const docRef = doc(db, "admins", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("Admin não encontrado");
        }

        return Admin.fromJson({ id: docSnap.id, ...docSnap.data() });
    }
}

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
