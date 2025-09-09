import { collection, doc, getDocs, runTransaction, setDoc, writeBatch } from "firebase/firestore";
import { db } from "./firebase";

export async function decrementTicketCounter() {
    const counterRef = doc(db, "counters", "ticketsCounter");

    try {
        await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);

            if (!counterDoc.exists()) {
                throw new Error("Contador de tickets não encontrado");
            }

            const current = counterDoc.data()?.current ?? 0;
            const next = current > 0 ? current - 1 : 0;
            transaction.update(counterRef, { current: next });
        });

        console.log("Contador de tickets decrementado com sucesso!");
    } catch (error) {
        console.error("Erro ao decrementar contador de tickets:", error);
        throw error;
    }
}

export async function assignTicketNumbersToExisting() {
    const ticketsRef = collection(db, "tickets");
    const ticketsSnapshot = await getDocs(ticketsRef);

    if (ticketsSnapshot.empty) {
        console.log("Nenhum ticket encontrado para atualizar.");
        return;
    }

    const batch = writeBatch(db);
    let ticketNumber = 1;
    ticketsSnapshot.forEach((ticketDoc) => {
        batch.update(ticketDoc.ref, { ticketNumber });
        ticketNumber++;
    });

    await batch.commit();
    console.log(`Todos os tickets foram atualizados com ticketNumber até ${ticketNumber - 1}`);

    const counterRef = doc(db, "counters", "ticketsCounter");
    await setDoc(counterRef, { current: ticketNumber - 1 });
    console.log("Contador atualizado para novos tickets.");
}

export async function initializeTicketCounter() {
    const counterRef = doc(db, "counters", "ticketsCounter");
    await setDoc(counterRef, { current: 0 });
    console.log("Contador de tickets criado e inicializado com 0");
}