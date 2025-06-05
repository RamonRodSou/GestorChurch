import { AdminSummary } from "@domain/user";
import { auth, db } from "@service/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

export async function adminAdd(admin: AdminSummary, passwordHash: string) {
    try {  
        const userCredential = await createUserWithEmailAndPassword(auth, admin.email, passwordHash);
        const createdUser = userCredential.user;

        if (!createdUser) throw new Error("Usuário não autenticado.");

        await setDoc(doc(db, 'admins', createdUser.uid), {
            name: admin.name,
            email: admin.email,
            permission: admin.permission,
            createdAt: new Date()
        });

    } catch (error) {
        alert('Erro ao registrar um novo adminstrador: ' + error);
        throw error;
    }
}

export async function invited(user: AdminSummary, url: string) {
    const token = uuidv4();

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await setDoc(doc(db, 'invites', token), {
            email: user.email,
            permission: user.permission,
            createdAt: new Date(),
            expiresAt: expiresAt
    });

    return `${url}/new-user?token=${token}`;
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