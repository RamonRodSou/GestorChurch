import { auth, db } from "@service/firebase";
import { addDoc, collection, doc, DocumentData, getDoc, getDocs, updateDoc, WithFieldValue } from "firebase/firestore";


export class Crud {
    static async findById<T>(id: string, collectionName: string): Promise<(T & { id: string }) | null> {
        try {
            const ref = doc(db, collectionName, id);
            const snapshot = await getDoc(ref);

            if (!snapshot.exists()) return null;

            return { id: snapshot.id, ...snapshot.data() } as T & { id: string };
        } catch (error) {
            alert(`Erro ao buscar ${collectionName}: ` + error);
            throw error;
        }
    }

    static async findAll<T>(collectionName: string): Promise<T[]> {
        try {
            this.getAuthenticatedUser()
            const snapshot = await getDocs(collection(db, collectionName));
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));

        } catch (error) {
            alert(`Erro ao listar ${collectionName}: ` + error);
            throw error;
        }
    }

    static async findAllSummary<T>(collectionName: string): Promise<T[]> {
        try {
            this.getAuthenticatedUser()
            const snapshot = await getDocs(collection(db, collectionName));
            return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));

        } catch (error) {
            alert(`Erro ao listar ${collectionName}: ` + error);
            throw error;
        }
    }

    static async add<T extends WithFieldValue<DocumentData>>(collectionName: string, data: T): Promise<string> {
        this.getAuthenticatedUser();
        const docRef = await addDoc(collection(db, collectionName), data);
        return docRef.id;
    }

    static async update<T>(collectionName: string, id: string, data: Partial<T>): Promise<void> {
        this.getAuthenticatedUser();
        const docRef = doc(db, collectionName, id);
        await updateDoc(docRef, data);
    }

    static getAuthenticatedUser() {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
        return user;
    }

}


