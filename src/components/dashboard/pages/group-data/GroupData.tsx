import { Add, Info } from "@mui/icons-material";
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
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Search from '@components/search/Search';
import { Group } from "@domain/group/Group";
import { findAllGroups } from "@service/GroupService";
import SnackBarMessage from "@components/snackBarMessage/SnackBarMessage";
import { ManagerContext } from "@context/ManagerContext";
import GroupDataModal from "./group-data-modal/groupDataModa";

export default function GroupData() {
    const [data, setData] = useState<Group[]>([]);
    const [filtered, setFiltered] = useState<Group[]>([]);
    const [openData, setOpenData] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const { openSnackbar, setOpenSnackbar } = useContext(ManagerContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    function handleOpenDetails(g: Group) {
        setSelectedGroup(g);
        setOpenData(true);
    }

    function newGroup() {
        return navigate(`/dashboard/${userId}/new-group`);
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
        <Container className='data-container'>
            <Box mb={3}>
                <Typography variant="h4" component="h1" className='title'>
                    GC
                </Typography>
            </Box>
            <Search<Group> 
                data={data} 
                onFilter={setFiltered} 
                label={'Buscar GC'}
                searchBy={(item, term) =>
                    item.name.toLowerCase().includes(term.toLowerCase())
                }
            />

            {filtered?.length > 0 ? (
                    <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                        <TableRow>
                            <TableCell className='title-secondary'>Nome</TableCell>
                            <TableCell className='title-secondary'>Lideres</TableCell>
                            <TableCell className='title-secondary'>Info</TableCell>

                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {filtered.map((it) => (
                            <TableRow key={it.id}>
                            <TableCell className='data-text'>{it.name}</TableCell>
                            <TableCell className='data-text'>
                                {it.leaders.map(it => it.name.split(" ")[0]).join(" / ")}
                            </TableCell>
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
                    Nenhum gc encontrado.
                </Typography>
            )}

            <Tooltip className='data-button' title="Click to new member">
                <IconButton onClick={() => newGroup()}>
                    <Add/>
                </IconButton>
            </Tooltip>
            <GroupDataModal
                open={openData}
                onClose={() => setOpenData(false)}
                group={selectedGroup}
            />
            <SnackBarMessage 
                message={"GC criado com sucesso!"} 
                openSnackbar={openSnackbar} 
                setOpenSnackbar={setOpenSnackbar}
            />
        </Container>
    );
}
