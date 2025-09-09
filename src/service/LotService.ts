import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { Lot } from "@domain/lot";
import firebase from "firebase/compat/app"


export async function lotAdd(it: Lot) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");
        await addDoc(collection(db, 'lots'), {
            userId: user.uid,
            name: it.name,
            price: it.price,
            quantity: it.quantity,
            isActive: it.isActive,
            createdAt: it.createdAt,
        });
    } catch (error) {
        throw error;
    }
}

export async function findAllLots(): Promise<Lot[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'lots'));
        return snapshot.docs.map((it) => ({ id: it.id, ...it.data() } as Lot))
    } catch (error) {
        alert('Erro ao listar: ' + error);
        throw error;
    }
}

export async function findByLotId(id: string): Promise<Lot | null> {
    try {
        const ref = doc(db, 'lots', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as Lot;
    } catch (error) {
        alert('Erro ao buscar: ' + error);
        throw error;
    }
}

export async function uploadInitialLots() {
    const lots: Lot[] = [
        new Lot(undefined, "Lot 1", 20, 80),
        new Lot(undefined, "Lot 2", 30, 70),
        new Lot(undefined, "Lot 3", 50, 50),
    ];

    try {
        for (const lot of lots) {
            await lotAdd(lot);
        }
        console.log("Todos os lotes foram adicionados com sucesso!");
    } catch (error) {
        console.error("Erro ao adicionar os lotes:", error);
    }
}

export async function lotDelete(id: string) {
    try {
        await firebase.firestore().collection('visitors').doc(id).delete()
    } catch (error) {
        alert('Erro ao deletar visitante: ' + error)
    }
}

export async function lotUpdate(id: string, data: Partial<any>): Promise<void> {
    try {
        const ref = doc(db, 'lots', id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar lot: ' + error);
        throw error;
    }
}