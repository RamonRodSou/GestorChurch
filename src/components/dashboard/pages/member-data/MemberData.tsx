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
import { Member } from '@domain/user';
import { findAllMembers } from "@service/MemberService";
import MemberDataModal from "./member-data-modal/MemberDataModa";
import { findGroupSummaryToById } from "@service/GroupService";
import { GroupSummary } from "@domain/group";
import { rowsPerPage, sendWhatsappMessage, whatAppMessageMember } from "@domain/utils";
import { Role } from "@domain/enums";
import Layout from "@components/layout/Layout";
import { filterAndPaginate, activeFilter } from "@domain/utils/filterEntities";

export default function MemberData() {
    const [data, setData] = useState<Member[]>([]);
    const [filtered, setFiltered] = useState<Member[]>([]);
    const [filter, setFilter] = useState<Role | string>('all');
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [openData, setOpenData] = useState(false);
    const [groupData, setGroupData] = useState<GroupSummary | null>(null);
    const [page, setPage] = useState<number>(0);

    const filteredMembers = filtered.filter(item => {
        if (filter === 'all') return true;
        return item.role === Role[filter.toUpperCase() as keyof typeof Role];
    });

    const activeEntities = activeFilter(filteredMembers)
    const entities = filterAndPaginate({ entity: activeEntities, page })

    const roleEntries = Object.entries(Role)

    function handleOpenDetails(member: Member) {
        if (member.groupId) {
            findGroupSummaryToById(member.groupId)
                .then((group) => {
                    setGroupData(group);
                })
                .catch(console.error);
        } else {
            setGroupData(null)
        }
        setSelectedMember(member);
        setOpenData(true);
    }

    useEffect(() => {
        findAllMembers()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        setPage(0);
    }, [filtered, filter])

    return (
        <Layout total={activeEntities.length} title="Membros" path="new-member" message="Membro criado com sucesso!">
            <Search<Member>
                data={data}
                onFilter={setFiltered}
                label={'Buscar Membro'}
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
                    <TableContainer component={Paper} className='tableContainer'>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell className='title-secondary table'>Nome</TableCell>
                                    <TableCell className='title-secondary table'>Telefone</TableCell>
                                    <TableCell className='title-secondary table'>Status</TableCell>
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
                                                onClick={() => sendWhatsappMessage(it.name, it.phone, whatAppMessageMember)}
                                            >
                                                {it.phone}
                                            </TableCell>
                                            <TableCell className='data-text'>{it.role}</TableCell>
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
                    Nenhum membro encontrado.
                </Typography>
            )}
            <MemberDataModal
                groupData={groupData}
                open={openData}
                onClose={() => setOpenData(false)}
                member={selectedMember}
            />
        </Layout>
    );
}
