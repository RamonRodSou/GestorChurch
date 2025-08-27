import { Info } from "@mui/icons-material";
import {
    IconButton,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
} from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { ManagerContext } from '@context/ManagerContext';
import Search from '@components/search/Search';
import { Visitor } from '@domain/user/visitor/Visitor';
import { findAllVisitors } from '@service/VisitorService';
import VisitorDataModal from './visitor-data-modal/VisitorDataModal';
import Layout from '@components/layout/Layout';
import dayjs from "dayjs";
import { rowsPerPage, sendWhatsappMessage, whatAppMessageVisitor } from "@domain/utils";
import { filterAndPaginate, activeFilter } from "@domain/utils/filterEntities";

export default function VisitorData() {
    const [data, setData] = useState<Visitor[]>([]);
    const [filtered, setFiltered] = useState<Visitor[]>([]);
    const [openData, setOpenData] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
    const [page, setPage] = useState<number>(0);

    const activeEntities = activeFilter(filtered);
    const sortedEntities = [...activeEntities].sort((a, b) => organizedToLastDate(a, b));
    const entities = filterAndPaginate({ entity: sortedEntities, page })

    const { isMobile } = useContext(ManagerContext);

    function handleOpenDetails(visitor: Visitor) {
        setSelectedVisitor(visitor);
        setOpenData(true);
    }

    function organizedToLastDate(a: Visitor, b: Visitor): number {
        const lastVisitA = a.visitHistory?.[a.visitHistory.length - 1]?.split(', ')[1];
        const lastVisitB = b.visitHistory?.[b.visitHistory.length - 1]?.split(', ')[1];
        const dateA = lastVisitA ? dayjs(lastVisitA, 'DD/MM/YYYY').valueOf() : 0;
        const dateB = lastVisitB ? dayjs(lastVisitB, 'DD/MM/YYYY').valueOf() : 0;

        return dateB - dateA;
    }

    useEffect(() => {
        findAllVisitors()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout total={activeEntities.length} title="Visitantes" path="new-visitor" message="Visitante criado com sucesso!">
            <Search<Visitor>
                data={data}
                onFilter={setFiltered}
                label={'Buscar Visitante'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase()) ||
                    item.phone.includes(term)
                }
            />
            {activeEntities?.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='title-secondary table'>Nome</TableCell>
                                    <TableCell className='title-secondary table'>Telefone</TableCell>

                                    {!isMobile && (
                                        <>
                                            <TableCell className='title-secondary table'>Visitas</TableCell>
                                        </>
                                    )}

                                    <TableCell className='title-secondary table'>Info</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entities
                                    .sort((a, b) => organizedToLastDate(a, b))
                                    .map((it) => (
                                        <TableRow key={it.id} className='data-table'>
                                            <TableCell className='data-text'>{it.name}</TableCell>
                                            <TableCell
                                                className='data-text onClick'
                                                onClick={() => sendWhatsappMessage(it.name, it.phone, whatAppMessageVisitor)}
                                            >
                                                {it.phone}
                                            </TableCell>
                                            {!isMobile && (
                                                <TableCell className='data-text'>
                                                    {it.visitHistory?.[it.visitHistory.length - 1] || '-'}
                                                </TableCell>
                                            )}
                                            <TableCell className='data-text'>
                                                <IconButton onClick={() => handleOpenDetails(it)}>
                                                    <Info />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {activeEntities.length > rowsPerPage &&
                        (
                            <TablePagination
                                component='div'
                                count={activeEntities.length}
                                page={page}
                                onPageChange={(_, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[rowsPerPage]}
                                sx={{ display: 'flex', justifyContent: 'flex-start' }}

                            />
                        )
                    }
                </>
            ) : (
                <Typography variant="body1" sx={{ color: 'var(--primary-title)' }}>
                    Nenhum visitante encontrado.
                </Typography>
            )}
            <VisitorDataModal
                open={openData}
                onClose={() => setOpenData(false)}
                visitor={selectedVisitor}
            />
        </Layout>
    );
}
