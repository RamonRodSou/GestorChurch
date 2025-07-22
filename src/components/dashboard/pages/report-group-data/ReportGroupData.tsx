import { useLocation } from 'react-router-dom';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { Info } from '@mui/icons-material';
import { ReportGroup } from '@domain/report';
import Layout from '@components/layout/Layout';
import { ManagerContext } from '@context/ManagerContext';
import { findAllReportsGroup } from '@service/ReportGroupService';
import { GroupSummary } from '@domain/group';
import { findAllGroupsSummary, findGroupSummaryToById } from '@service/GroupService';
import ReportGroupDataModal from './report-group-data-modal/ReportGroupDataModa';
import { DateUtil, filterAndPaginate, activeFilter } from '@domain/utils';

export default function ReportGroupData() {
    const [_, setData] = useState<ReportGroup[]>([]);
    const [filtered, setFiltered] = useState<ReportGroup[]>([]);
    const [openData, setOpenData] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportGroup | null>(null);
    const [__, setGroups] = useState<GroupSummary[]>([]);
    const [visitorGroupMap, setVisitorGroupMap] = useState<Map<string, GroupSummary>>(new Map());
    const [groupData, setGroupData] = useState<GroupSummary | null>(null);
    const [page, setPage] = useState<number>(0);

    const rowsPerPage = 30;

    const { setOpenSnackbar } = useContext(ManagerContext);
    const location = useLocation();

    function handleOpenDetails(r: ReportGroup) {
        if (r.groupId) {
            findGroupSummaryToById(r.groupId)
                .then((group) => {
                    setGroupData(group);
                })
                .catch(console.error);
        } else {
            setGroupData(null)
        }
        setSelectedReport(r);
        setOpenData(true);
    }

    async function loadGroups() {
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
    }

    const activeEntities = activeFilter(filtered)
    const entities = filterAndPaginate({ entity: activeEntities, page })

    useEffect(() => {
        if (location.state?.showSnackbar) {
            setOpenSnackbar(true);
        }

        findAllReportsGroup()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
        loadGroups();
    }, [location.state]);

    return (
        <Layout total={activeEntities.length} title="Relatórios dos GCs" path="new-report-group" message="Relatório criado com sucesso!">
            {activeEntities?.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='title-secondary table'>GC</TableCell>
                                    <TableCell className='title-secondary table'>DIA</TableCell>
                                    <TableCell className='title-secondary table'>ENVIO</TableCell>
                                    <TableCell className='title-secondary table'>Info</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entities
                                    .sort((a, b) => DateUtil.organizedToLastDate(a, b))
                                    .map((it) => (
                                        <TableRow key={it.id} className='data-table'>
                                            <TableCell className='data-text'>{it.groupId ? visitorGroupMap.get(it.groupId)?.name : 'Sem Grupo'}</TableCell>
                                            <TableCell className='data-text'>
                                                {DateUtil.dateFormated(it.date).slice(0, 5) + ' - ' + it.weekDay}
                                            </TableCell>
                                            <TableCell className='data-text'>{DateUtil.dateFormated(it.createdAt)}</TableCell>
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
                    Nenhum colaborador encontrado.
                </Typography>
            )}

            <ReportGroupDataModal
                groupData={groupData}
                open={openData}
                onClose={() => setOpenData(false)}
                report={selectedReport}
            />
        </Layout>
    )
}