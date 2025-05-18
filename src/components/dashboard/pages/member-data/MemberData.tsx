import { Add, Info } from "@mui/icons-material";
import {
    Box,
  Button,
  Container,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Search from '@components/search/Search';
import { Member } from '@domain/user';
import { findAllMembers } from "@service/MemberService";
import MemberDataModal from "./member-data-modal/MemberDataModa";
import SnackBarMessage from "@components/snackBarMessage/SnackBarMessage";
import { ManagerContext } from "@context/ManagerContext";
import { findGroupSummaryToById } from "@service/GroupService";
import { GroupSummary } from "@domain/group";
import { whatzapp } from "@domain/utils";
import { Role } from "@domain/enums";

export default function MemberData() {
    const [data, setData] = useState<Member[]>([]);
    const [filtered, setFiltered] = useState<Member[]>([]);
    const [filter, setFilter] = useState<Role | string>('all');
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [openData, setOpenData] = useState(false);
    const [groupData, setGroupData] = useState<GroupSummary | null>(null); 
    const { openSnackbar, setOpenSnackbar } = useContext(ManagerContext);
    const { userId } = useParams();
    const navigate = useNavigate();

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

    function navToNewMember() {
        return navigate(`/dashboard/${userId}/new-member`);
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
        <Container className='data-container'>
            <Box mb={3}>
                <Typography variant="h4" component="h1" className='title'>
                    Membros
                </Typography>
            </Box>
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

            {filteredMembers?.length > 0 ? (
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
                                            <Info/>
                                        </IconButton> 
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
            ) : (
                <Typography variant="body1" sx={{ color: 'var(--primary-title)' }}>
                    Nenhum colaborador encontrado.
                </Typography>
            )}

            <Tooltip className='data-button' title="Click to new member">
                <IconButton onClick={() => navToNewMember()}>
                    <Add/>
                </IconButton>
            </Tooltip>
            <MemberDataModal
                groupData={groupData}
                open={openData}
                onClose={() => setOpenData(false)}
                member={selectedMember}
            />
            <SnackBarMessage 
                message={"Membro criado com sucesso!"} 
                openSnackbar={openSnackbar} 
                setOpenSnackbar={setOpenSnackbar}
            />
        </Container>
    );
}
