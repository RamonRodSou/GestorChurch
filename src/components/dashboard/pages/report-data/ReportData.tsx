import { useLocation } from 'react-router-dom';
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { useContext, useEffect, useState } from 'react';
import { Info } from '@mui/icons-material';
import { findAllReports } from '@service/ReportChurchService';
import { ReportChurch } from '@domain/report';
import ReportChurchDataModal from './report-church-data-modal/ReportChurchDataModa';
import Layout from '@components/layout/Layout';
import { ManagerContext } from '@context/ManagerContext';
import { DateUtil } from '@domain/utils';

export default function ReportData() {
    const [data, setData]= useState<ReportChurch[]>([]);
    const [filtered, setFiltered] = useState<ReportChurch[]>([]);
    const [openData, setOpenData] = useState(false);
    const [selectedReport, setSelectedReport] = useState<ReportChurch | null>(null);
    const { setOpenSnackbar } = useContext(ManagerContext);
    const location = useLocation();

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
        <Layout total={data?.length} title="Relatórios" path="new-report-church" message="Relatório criado com sucesso!">
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
                        {filtered
                            .filter((it) => it.isActive)
                            .sort((a, b) => DateUtil.organizedToLastDate(a, b))
                            .map((it) => (
                                <TableRow key={it.id}>
                                    <TableCell className='data-text'>
                                        {DateUtil.dateFormated(it.date).slice(0, 5) + ' - ' + it.worship}
                                    </TableCell>
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
        </Layout>
    )
}