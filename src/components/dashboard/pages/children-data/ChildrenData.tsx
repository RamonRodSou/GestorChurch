import { Info } from "@mui/icons-material";
import {
    Box,
    Button,
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
import { Child } from '@domain/user';
import { findGroupSummaryToById } from "@service/GroupService";
import { GroupSummary } from "@domain/group";
import { filterAndPaginate, NOT_REGISTER, activeFilter, rowsPerPage, sendWhatsappMessage, whatAppMessageChild } from "@domain/utils";
import Layout from "@components/layout/Layout";
import { findAllChildrens } from "@service/ChildrenService";
import ChildrenDataModal from "./children-data-modal/ChildrenDataModa";
import { AgeGroup } from "@domain/enums/AgeGroup";

export default function ChildrenData() {
    const [data, setData] = useState<Child[]>([]);
    const [filtered, setFiltered] = useState<Child[]>([]);
    const [filter, setFilter] = useState<AgeGroup | string>('all');
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [openData, setOpenData] = useState(false);
    const [groupData, setGroupData] = useState<GroupSummary | null>(null);
    const [page, setPage] = useState<number>(0);

    const filteredChild = filtered.filter(item => {
        if (filter === 'all') return true;
        return item.ageGroup === AgeGroup[filter.toUpperCase() as keyof typeof AgeGroup];
    });

    const activeEntities = activeFilter(filteredChild)
    const entities = filterAndPaginate({ entity: activeEntities, page })

    const roleEntries = Object.entries(AgeGroup)

    function handleOpenDetails(children: Child) {
        if (children.groupId) {
            findGroupSummaryToById(children.groupId)
                .then((group) => {
                    setGroupData(group);
                })
                .catch(console.error);
        } else {
            setGroupData(null)
        }
        setSelectedChild(children);
        setOpenData(true);
    }

    useEffect(() => {
        findAllChildrens()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout total={data.filter((it => it.isActive)).length} title="Menores de idade" path="new-children" message="Crainça criado com sucesso!">
            <Search<Child>
                data={data}
                onFilter={setFiltered}
                label={'Buscar Criança'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase()) ||
                    item.phone.includes(term)
                }
            />

            <Box className="boxFilter">
                <Button
                    variant={filter === 'all' ? 'contained' : 'outlined'}
                    onClick={() => setFilter('all')}

                >
                    Todos
                </Button>

                {roleEntries.map(([key, value]) => (
                    <Button
                        key={key}
                        variant={filter === key.toLowerCase() ? 'contained' : 'outlined'}
                        onClick={() => setFilter(key.toLowerCase())}
                    >
                        {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                    </Button>
                ))}
            </Box>

            {activeEntities
                .sort
                ?.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='title-secondary table'>Nome</TableCell>
                                    <TableCell className='title-secondary table'>Telefone</TableCell>
                                    <TableCell className='title-secondary table'>Faixa Etária</TableCell>
                                    <TableCell className='title-secondary table'>Info</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entities
                                    .map((it) => (
                                        <TableRow key={it.id} className='data-table'>
                                            <TableCell className='data-text'>{it.name.split(" ").at(0)}</TableCell>
                                            <TableCell
                                                className='data-text onClick'
                                                onClick={() => sendWhatsappMessage(it.name, it.phone, whatAppMessageChild)}
                                            >
                                                {it.phone ? it.phone : NOT_REGISTER}
                                            </TableCell>
                                            <TableCell className='data-text'>{it.ageGroup}</TableCell>
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
                    Nenhuma criança encontrada.
                </Typography>
            )}
            <ChildrenDataModal
                groupData={groupData}
                open={openData}
                onClose={() => setOpenData(false)}
                children={selectedChild}
            />
        </Layout>
    );
}
