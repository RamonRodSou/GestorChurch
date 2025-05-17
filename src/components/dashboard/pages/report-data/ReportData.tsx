import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './report-data.scss'
import { Box, Button, Container, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import SnackBarMessage from '@components/snackBarMessage/SnackBarMessage';

export default function ReportData() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [openSnackbar, setOpenSnackbar] = useState(false);

    function navToNewReportChurch() {
        return navigate(`/dashboard/${userId}/new-report-church`);
    }

    useEffect(() => {
        if (location.state?.showSnackbar) {
            setOpenSnackbar(true);
        }
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
            <SnackBarMessage 
                message={"Relatório criado com sucesso!"} 
                openSnackbar={openSnackbar} 
                setOpenSnackbar={setOpenSnackbar}
            />
        </Container>
    )
}