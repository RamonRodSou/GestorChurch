import {
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
import { useEffect, useState } from 'react';
import Search from '@components/search/Search';
import { EMPTY, filterAndPaginate, activeFilter, rowsPerPage, sendWhatsappMessage, whatAppMessageMember } from '@domain/utils';
import Layout from '@components/layout/Layout';
import { VisitorGroup } from "@domain/user/visitor/VisitorGroup";
import { findAllVisitorsGroup } from "@service/VisitorGroupService";
import { findAllGroupsSummary } from "@service/GroupService";
import { GroupSummary } from "@domain/group";

export default function VisitorGroupData() {
    const [data, setData] = useState<VisitorGroup[]>([]);
    const [filtered, setFiltered] = useState<VisitorGroup[]>([]);
    const [_, setGroups] = useState<GroupSummary[]>([]);
    const [visitorGroupMap, setVisitorGroupMap] = useState<Map<string, GroupSummary>>(new Map());
    const [page, setPage] = useState<number>(0);

    const activeEntities = activeFilter(filtered)
    const entities = filterAndPaginate({ entity: activeEntities, page })

    function organizedGcName(a: VisitorGroup, b: VisitorGroup) {
        const nameA = visitorGroupMap.get(a.groupId || EMPTY)?.name ?? 'Sem Grupo';
        const nameB = visitorGroupMap.get(b.groupId || EMPTY)?.name ?? 'Sem Grupo';
        return nameA.localeCompare(nameB, 'pt-BR', { sensitivity: 'base' });
    }

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const allGroups = await findAllGroupsSummary();
                setGroups(allGroups);

                const groupMap = new Map<string, GroupSummary>();
                allGroups.forEach(group => {
                    groupMap.set(group.id, group);
                });
                setVisitorGroupMap(groupMap);
            } catch (error) {
                console.error('Erro ao carregar os grupos:', error);
            }
        };

        loadGroups();
        findAllVisitorsGroup()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout total={data.filter((it => it.isActive)).length} title="Visitantes dos GCs" path="new-visitor-group" message="Visitante criado com sucesso!">
            <Search<VisitorGroup>
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
                                    <TableCell className='title-secondary table'>GC</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entities
                                    .sort((a, b) => organizedGcName(a, b))
                                    .map((it) => (
                                        <TableRow key={it.id} className='data-table'>
                                            <TableCell className='data-text'>{it.name}</TableCell>
                                            <TableCell
                                                className='data-text onClick'
                                                onClick={() => sendWhatsappMessage(it.name, it.phone, whatAppMessageMember)}
                                            >
                                                {it.phone}
                                            </TableCell>
                                            <TableCell className='data-text'>{it.groupId ? visitorGroupMap.get(it.groupId)?.name : 'Sem Grupo'}</TableCell>
                                        </TableRow>
                                    ))
                                }
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
        </Layout>
    );
}
