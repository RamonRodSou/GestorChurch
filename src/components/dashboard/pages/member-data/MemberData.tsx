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
import { whatzapp } from "@domain/utils";
import { Role } from "@domain/enums";
import Layout from "@components/layout/Layout";

export default function MemberData() {
    const [data, setData] = useState<Member[]>([]);
    const [filtered, setFiltered] = useState<Member[]>([]);
    const [filter, setFilter] = useState<Role | string>('all');
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [openData, setOpenData] = useState(false);
    const [groupData, setGroupData] = useState<GroupSummary | null>(null);

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

    const filteredMembers = filtered.filter(item => {
        if (filter === 'all') return true;
        return item.role === Role[filter.toUpperCase() as keyof typeof Role];
    });

    useEffect(() => {
        findAllMembers()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Layout total={data.filter((it => it.isActive)).length} title="Membros" path="new-member" message="Membro criado com sucesso!">
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

            {filteredMembers
                .sort
                ?.length > 0 ? (
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell className='title-secondary'>Nome</TableCell>
                                <TableCell className='title-secondary'>Telefone</TableCell>
                                <TableCell className='title-secondary'>Status</TableCell>
                                <TableCell className='title-secondary'>Info</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredMembers
                                .filter((it) => it.isActive)
                                .map((it) => (
                                    <TableRow key={it.id}>
                                        <TableCell className='data-text'>{it.name.split(" ").at(0)}</TableCell>
                                        <TableCell
                                            className='data-text onClick'
                                            onClick={() => whatzapp(it.name, it.phone)}
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
