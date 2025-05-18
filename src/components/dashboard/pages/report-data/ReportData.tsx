import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './report-data.scss'
import { Box, Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import SnackBarMessage from '@components/snackBarMessage/SnackBarMessage';
import { Info } from '@mui/icons-material';
import { findAllReports } from '@service/ReportChurchService';
import { ReportChurch } from '@domain/report';
import ReportChurchDataModal from './report-church-data-modal/ReportChurchDataModa';

export default function ReportData() {
    const [_, setData]= useState<ReportChurch[]>([]);
    const [filtered, setFiltered] = useState<ReportChurch[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [openData, setOpenData] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportChurch | null>(null);
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    function navToNewReportChurch() {
        return navigate(`/dashboard/${userId}/new-report-church`);
    }

    function handleOpenDetails(r: ReportChurch) {
        setSelectedReport(r);
        setOpenData(true);
    }
    
    useEffect(() => {
        if (location.state?.showSnackbar) {
            setOpenSnackbar(true);
        }
        findAllReports()
            .then((it) => {
                setData(it);
                setFiltered(it);
        })
    }, [location.state]);
    
    
    return (
        <Container>
            <Typography variant="h4" component="h1" className='title'>
                Relatórios
            </Typography>
            <Box mt={3}>
                <Button variant="contained" color="primary" onClick={() => navToNewReportChurch()}>
                    Criar Relatório de Culto
                </Button>
                {/* <Button type="submit" variant="contained" color="primary">
                    Salvar Relatório
                </Button> */}
            </Box>
           {/* <Search<Report> 
                data={data} 
                onFilter={setFiltered} 
                label={'Buscar Membro'}
                searchBy={(it, term) =>
                    it.name.toLowerCase().includes(term.toLowerCase()) ||
                }
            /> */}
            
            {filtered?.length > 0 ? (
                    <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                        <TableRow>
                            <TableCell className='title-secondary'>Culto</TableCell>
                            <TableCell className='title-secondary'>Horário</TableCell>
                            <TableCell className='title-secondary'>Info</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {filtered.map((it) => (
                                <TableRow key={it.id}>
                                    <TableCell className='data-text'>{it.worship}</TableCell>
                                    {it.timePeriod != null  
                                        ? <TableCell className='data-text'>{it.timePeriod}</TableCell>
                                        : <TableCell className='data-text'>NOITE</TableCell>
                                    }
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
            <ReportChurchDataModal
                open={openData}
                onClose={() => setOpenData(false)}
                report={selectedReport}
            />
            <SnackBarMessage 
                message={"Relatório criado com sucesso!"} 
                openSnackbar={openSnackbar} 
                setOpenSnackbar={setOpenSnackbar}
            />
        </Container>
    )
}