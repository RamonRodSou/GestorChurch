import firebase from "firebase/compat/app"
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { DateUtil } from "@domain/utils";
import { VisitorGroup } from "@domain/user/visitor/VisitorGroup";

export async function visitorGroupAdd(vistor: VisitorGroup) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'visitor_groups'), {
            userId: user.uid,
            name: vistor.name,
            phone: vistor.phone,
            groupId: vistor.groupId,
            isActive: vistor.isActive,
            createdAt: DateUtil.dateFormatedPtBr(vistor.createdAt),
        });
    } catch (error) {
        alert('Erro ao registrar um novo visitante: ' + error);
        throw error;
    }
}

export async function findAllVisitorsGroup (): Promise<VisitorGroup[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
    
        const snapshot = await getDocs(collection(db, 'visitor_groups'));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as VisitorGroup))
    } catch (error) {
        alert('Erro ao listar visitantes: ' + error);
        throw error;
    }
}

export async function findByVisitorGroupId(id: string): Promise<VisitorGroup | null> {
    try {
        const ref = doc(db, 'visitor_groups', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as VisitorGroup;
    } catch (error) {
        alert('Erro ao buscar visitante: ' + error);
        throw error;
    }
}

export async function updateVisitorGroup(id: string, data: Partial<VisitorGroup>): Promise<void> {
    try {
        const ref = doc(db, 'visitor_groups', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar visitante: ' + error);
        throw error;
    }
}

export async function visitorGroupDelete(id: string) {
    try {
        await firebase.firestore().collection('visitor_groups').doc(id).delete()
    } catch (error) {
        alert('Erro ao deletar visitante: ' + error)
    }
} 