import { Admin } from "@domain/user";
import { db } from "@service/firebase";
import { doc, getDoc } from "firebase/firestore";

export class AdminService {
    static async getAdminById(id: string): Promise<Admin> {
        const docRef = doc(db, "admins", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            throw new Error("Admin não encontrado");
        }

        return Admin.fromJson({ id: docSnap.id, ...docSnap.data() });
    }
}