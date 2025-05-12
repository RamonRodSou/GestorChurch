import './financial-data.scss'
import { useEffect, useState } from 'react';
import {
  Typography,
  Button,
  Paper,
  Container
} from '@mui/material';
import { Financial, FinancialSummary } from '@domain/financial';
import { financialSummaryAdd, findAllFinancials } from '@service/FinancialService';
import FinancialModal from './financial-modal/FinancialModal';
import SnackBarMessage from '@components/snackBarMessage/SnackBarMessage';
import FinancialCard from './financial-card/FinancialCard';

export default function FinancialData() {
    const [balance, setBalance] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);

    const isColorRed = balance >= 0 ? '#e8f5e9' : '#ffebee';
    
    function newFinancial() {
        return setOpenModal(true);
    }

    async function handleConfirmFinancial(financialSummary: FinancialSummary) {
        await financialSummaryAdd(financialSummary);
        await load();
        setOpenModal(false);
        setOpenSnackbar(true)
    }

    async function load() {
        const data: Financial[] = await findAllFinancials();
        const currentProfit: number = data.reduce((sum, it) => sum + (it.income - it.expense), 0);
        const spendingToDate = data.reduce((sum, item) => sum + item.expense, 0);
        setBalance(currentProfit);
        setExpense(spendingToDate);
    }
 
    useEffect(() => {
        load();
    }, []); 

    return (
        <Container className='finacial-container'>
            <Typography variant="h4" component="h1" className='title'>
                Painel Financeiro
            </Typography>
            <Paper elevation={3} sx={{ bgcolor: isColorRed }} className='currrent-cash'>
                <Typography variant="h6">
                    Saldo Atual:
                </Typography>
                <Typography variant="h4" color={balance >= 0 ? 'green' : 'error'}>
                    R$ {balance.toFixed(2)}
                </Typography>
            </Paper>
            <Paper elevation={3} sx={{ bgcolor: '#ffebee' }} className='currrent-cash'>
                <Typography variant="h6">
                    Gastos:
                </Typography>
                <Typography variant="h4" color={'error'}>
                    R$ {expense.toFixed(2)}
                </Typography>
            </Paper>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() =>newFinancial()}
            >
                Nova Movimentação
            </Button>
            <FinancialCard/>
            <FinancialModal
                title='Nova movimentação'
                open={openModal}
                onClose={() => setOpenModal(false)}
                onConfirm={handleConfirmFinancial}
                incomeDefault={0}
            />
            <SnackBarMessage 
                message={"Movimentação cadastrada com sucesso!"} 
                openSnackbar={openSnackbar} 
                setOpenSnackbar={setOpenSnackbar}
            />   
      </Container>
    );
}
