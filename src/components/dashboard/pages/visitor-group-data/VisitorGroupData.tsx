import {
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { useEffect, useState } from 'react';
import Search from '@components/search/Search';
import { EMPTY, whatzapp } from '@domain/utils';
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
            {filtered?.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className='title-secondary'>Nome</TableCell>
                                <TableCell className='title-secondary'>Telefone</TableCell>
                                <TableCell className='title-secondary'>GC</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filtered
                                .filter((it) => it.isActive)
                                .sort((a, b) => organizedGcName(a, b))
                                .map((it) => (
                                    <TableRow key={it.id}>
                                        <TableCell className='data-text'>{it.name}</TableCell>
                                        <TableCell
                                            className='data-text onClick'
                                            onClick={() => whatzapp(it.name, it.phone)}
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
            ) : (
                <Typography variant="body1" sx={{ color: 'var(--primary-title)' }}>
                    Nenhum visitante encontrado.
                </Typography>
            )}
        </Layout>
    );
}
