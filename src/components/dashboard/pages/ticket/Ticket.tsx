import './styles.scss'
import { Box, Card, Typography, Button } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import 'dayjs/locale/pt-br';
import { Guest } from '@domain/guest';
import { findAllTickets } from '@service/GuestService';
import { activeFilter, EVENT_DAY } from '@domain/utils';
import QRCode from "react-qr-code";
import Layout from '@components/layout/Layout';
import Search from '@components/search/Search';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { TicketPDF, GuestWithQR } from './TicketPDF';
import html2canvas from 'html2canvas';

export default function Ticket() {
    const [data, setData] = useState<Guest[]>([]);
    const [filtered, setFiltered] = useState<Guest[]>([]);
    const [pdfData, setPdfData] = useState<GuestWithQR[] | null>(null);
    const [isPreparingPdf, setIsPreparingPdf] = useState(false);

    const qrCodeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const activeEntities = activeFilter(filtered);

    useEffect(() => {
        findAllTickets()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    const handlePreparePdf = async () => {
        if (filtered.length === 0) return;

        setIsPreparingPdf(true);
        setPdfData(null);

        const ticketsWithQr: GuestWithQR[] = [];

        for (const ticket of filtered) {
            const element = qrCodeRefs.current[ticket.id];
            if (element) {
                const canvas = await html2canvas(element);
                const qrCodeUrl = canvas.toDataURL('image/png');
                ticketsWithQr.push({
                    ...ticket, qrCodeUrl,
                    toJSON: function (): object {
                        throw new Error('Function not implemented.');
                    }
                });
            }
        }

        setPdfData(ticketsWithQr);
        setIsPreparingPdf(false);
    };

    return (
        <Layout total={activeEntities.length} title="Ingressos" path="new-ticket" message="Ingresso criado com sucesso!">
            <Search<Guest>
                data={data}
                onFilter={(newFilteredData) => {
                    setFiltered(newFilteredData);
                    setPdfData(null);
                }}
                label={'Buscar por nome ou telefone'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase()) ||
                    item.phone.includes(term)
                }
            />

            <Box my={2}>
                <Button
                    variant="contained"
                    onClick={handlePreparePdf}
                    disabled={isPreparingPdf || filtered.length === 0}
                >
                    {isPreparingPdf ? 'Preparando PDF...' : 'Gerar PDF dos Ingressos Filtrados'}
                </Button>

                {pdfData && (
                    <Box mt={2}>
                        <PDFDownloadLink
                            document={<TicketPDF tickets={pdfData} />}
                            fileName={`${filtered[0]?.name.replace(/\s+/g, '-')}-ingressos.pdf`}
                        >
                            {({ loading }) => (
                                <Button variant="contained" color="success" disabled={loading}>
                                    {loading ? 'Carregando...' : 'Baixar PDF Agora'}
                                </Button>
                            )}
                        </PDFDownloadLink>
                    </Box>
                )}
            </Box>

            <Box className="card">
                {activeEntities.map((it) => (
                    <Card key={it.id} className="ticket-card">
                        <Box>
                            <Typography variant="h2">{it.name}</Typography>
                            <Typography>{it.phone}</Typography>
                            <Typography>{EVENT_DAY}</Typography>
                        </Box>

                        <div
                            ref={(el) => {
                                if (el) qrCodeRefs.current[it.id] = el;
                            }}
                        >
                            <QRCode value={String(it.id)} size={220} />
                        </div>
                    </Card>
                ))}
            </Box>
        </Layout>
    )
}