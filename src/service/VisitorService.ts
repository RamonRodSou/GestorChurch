import firebase from "firebase/compat/app"
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Visitor } from "@domain/user/visitor/Visitor";
import { DateUtil } from "@domain/utils";

export async function visitorAdd(vistor: Visitor) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'visitors'), {
            userId: user.uid,
            name: vistor.name,
            phone: vistor.phone,
            visitHistory: vistor.visitHistory,
            isActive: vistor.isActive,
            createdAt: DateUtil.dateFormatedPtBr(vistor.createdAt),
        });
    } catch (error) {
        alert('Erro ao registrar um novo visitante: ' + error);
        throw error;
    }
}

export async function findAllVisitors (): Promise<Visitor[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
    
        const snapshot = await getDocs(collection(db, 'visitors'));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as Visitor))
    } catch (error) {
        alert('Erro ao listar visitantes: ' + error);
        throw error;
    }
}

export async function findByVisitorId(id: string): Promise<Visitor | null> {
    try {
        const ref = doc(db, 'visitors', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as Visitor;
    } catch (error) {
        alert('Erro ao buscar visitante: ' + error);
        throw error;
    }
}

export async function updateVisitor(id: string, data: Partial<Visitor>): Promise<void> {
    try {
        const ref = doc(db, 'visitors', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar visitante: ' + error);
        throw error;
    }
}

export async function visitorDelete(id: string) {
    try {
        await firebase.firestore().collection('visitors').doc(id).delete()
    } catch (error) {
        alert('Erro ao deletar visitante: ' + error)
    }
} 