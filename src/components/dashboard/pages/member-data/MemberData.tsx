import { Add } from "@mui/icons-material";
import {
    Box,
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
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Search from '@components/search/Search';
import { Member } from '@domain/user';
import { findAllMembers } from "@service/MemberService";

export default function MemberData() {
    const [data, setData] = useState<Member[]>([]);
    const [filtered, setFiltered] = useState<Member[]>([]);
    const { userId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        findAllMembers()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    function newMember() {
        return navigate(`/dashboard/${userId}/new-member`);
    }

    return (
        <Container className='data-container'>
            <Box mb={3}>
                <Typography variant="h4" component="h1" className='title'>
                    Colaboradores
                </Typography>
            </Box>
            <Search<Member> 
                data={data} 
                onFilter={setFiltered} 
                label={'Buscar Colaborador'}
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
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {filtered.map((it) => (
                            <TableRow key={it.id}>
                            <TableCell className='data-text'>{it.name}</TableCell>
                            <TableCell className='data-text'>{it.phone}</TableCell>
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
                <IconButton onClick={() => newMember()}>
                    <Add/>
                </IconButton>
            </Tooltip>
        </Container>
    );
}
