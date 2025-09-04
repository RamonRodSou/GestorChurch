import { Document, Page, Text, View, Image } from "@react-pdf/renderer";
import { Guest } from "@domain/guest";
import { ticketPdfStyles as styles } from "./stylesPDF";
import { EVENT_DAY } from "@domain/utils";
import { useEffect, useState } from "react";
import { findByLottId } from "@service/LotService";

export interface GuestWithQR extends Guest {
    qrCodeUrl?: string;
    lotName?: string;
}

interface TicketPDFProps {
    tickets: GuestWithQR[];
}

export function TicketPDF({ tickets }: TicketPDFProps) {
    const [ticketsWithLot, setTicketsWithLot] = useState<GuestWithQR[]>([]);

    useEffect(() => {
        async function loadLotNames() {
            const updatedTickets: GuestWithQR[] = [];

            for (const ticket of tickets) {
                if (ticket.lotId) {
                    const lot = await findByLottId(ticket.lotId);
                    updatedTickets.push({
                        ...ticket, lotName: lot?.name,
                        toJSON: function (): object {
                            throw new Error("Function not implemented.");
                        }
                    });
                } else {
                    updatedTickets.push(ticket);
                }
            }
            setTicketsWithLot(updatedTickets);
        }

        loadLotNames();

        console.log(ticketsWithLot)
    }, [tickets]);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {ticketsWithLot.map((ticket, index) => (
                    <View key={index} style={styles.ticket} wrap={false}>
                        <View style={styles.ticketInfo}>
                            <Text style={styles.lotText}>{`Convite ${index + 1}`}</Text>
                        </View>

                        <View style={styles.lotInfo}>
                            <Text>Lote: {ticket.lotName || "N/A"}</Text>
                        </View>

                        <View style={styles.dataContainer}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.title}>{ticket.name}</Text>
                                <Text style={styles.text}>Telefone: {ticket.phone}</Text>
                                <Text style={styles.text}>Data do Evento: {EVENT_DAY}</Text>
                            </View>

                            {ticket.qrCodeUrl && (
                                <Image style={styles.qrCode} src={ticket.qrCodeUrl} />
                            )}
                        </View>
                    </View>
                ))}
            </Page>
        </Document>
    );
}
