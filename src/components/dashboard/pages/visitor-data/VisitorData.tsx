import './visitor-data.scss';
import { Add, Info } from "@mui/icons-material";
import {
    Container,
    IconButton,
    Tooltip,
    Typography,
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    Box
} from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { ManagerContext } from '@context/ManagerContext';
import { useNavigate, useParams } from 'react-router-dom';
import Search from '@components/search/Search';
import SnackBarMessage from '@components/snackBarMessage/SnackBarMessage';
import { Visitor } from '@domain/user/visitor/Visitor';
import { findAllVisitors } from '@service/VisitorService';
import VisitorDataModal from './visitor-data-modal/visitorDataModa';

export default function VisitorData() {
    const [data, setData] = useState<Visitor[]>([]);
    const [filtered, setFiltered] = useState<Visitor[]>([]);
    const [openData, setOpenData] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
    const { userId } = useParams();
    const { openSnackbar, setOpenSnackbar } = useContext(ManagerContext);
    const navigate = useNavigate();
    
    function handleOpenDetails(visitor: Visitor) {
        setSelectedVisitor(visitor);
        setOpenData(true);
    }

    function newVisitor() {
        return navigate(`/dashboard/${userId}/new-visitor`);
    }

    useEffect(() => { 
        findAllVisitors()
            .then((it) => {
                setData(it);
                setFiltered(it);
            })
            .catch(console.error);
    }, []);

    return (
        <Container className="data-container">
            <Box mb={3}>
                <Typography variant="h4" component="h1" className='title'>
                    Visitantes
                </Typography>
            </Box>
            <Search<Visitor> 
                data={data} 
                onFilter={setFiltered} 
                label={'Buscar Visitor'}
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
                        <TableCell className='title-secondary'>Visitas</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {filtered.map((it) => (
                        <TableRow key={it.id}>
                        <TableCell className='data-text'>{it.name}</TableCell>
                        <TableCell className='data-text'>{it.phone}</TableCell>
                        <TableCell className='data-text'>{it.visitHistory.at(0)}</TableCell>
                        <IconButton onClick={() => handleOpenDetails(it)}>
                            <Info/>
                        </IconButton>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1" sx={{ color: 'var(--primary-title)' }}>
                Nenhum visitante encontrado.
                </Typography>
            )}

            <Tooltip className="data-button" title="Click to new visitor">
                <IconButton onClick={newVisitor}>
                    <Add/>
                </IconButton>
            </Tooltip>
            <VisitorDataModal
                open={openData}
                onClose={() => setOpenData(false)}
                visitor={selectedVisitor}
            />
            <SnackBarMessage 
                message={"Visitante criado com sucesso!"} 
                openSnackbar={openSnackbar} 
                setOpenSnackbar={setOpenSnackbar}
            />
        </Container>

    );
}
