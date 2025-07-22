import { Info } from "@mui/icons-material";
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Typography,
} from "@mui/material";
import { useEffect, useState } from 'react';
import Search from '@components/search/Search';
import { Group } from "@domain/group/Group";
import { findAllGroups } from "@service/GroupService";
import GroupDataModal from "./group-data-modal/groupDataModa";
import Layout from "@components/layout/Layout";
import { filterAndPaginate, activeFilter, rowsPerPage } from "@domain/utils";

export default function GroupData() {
    const [data, setData] = useState<Group[]>([]);
    const [filtered, setFiltered] = useState<Group[]>([]);
    const [openData, setOpenData] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [page, setPage] = useState<number>(0);

    const activeEntities = activeFilter(filtered)
    const entities = filterAndPaginate({ entity: activeEntities, page })

    function handleOpenDetails(g: Group) {
        setSelectedGroup(g);
        setOpenData(true);
    }

    useEffect(() => {
        findAllGroups()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout total={data?.length} title="GC" path="new-group" message="GC criado com sucesso!">
            <Search<Group>
                data={data}
                onFilter={setFiltered}
                label={'Buscar GC'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase())
                }
            />

            {activeEntities?.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='title-secondary table'>Nome</TableCell>
                                    <TableCell className='title-secondary table'>Lideres</TableCell>
                                    <TableCell className='title-secondary table'>Info</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entities.map((it) => (
                                    <TableRow key={it.id} className='data-table'>
                                        <TableCell className='data-text'>{it.name}</TableCell>
                                        <TableCell className='data-text'>
                                            {it?.leaders?.map(it => it?.name.split(" ")[0]).join(" / ")}
                                        </TableCell>
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
                    Nenhum gc encontrado.
                </Typography>
            )}
            <GroupDataModal
                open={openData}
                onClose={() => setOpenData(false)}
                group={selectedGroup}
            />
        </Layout>
    );
}