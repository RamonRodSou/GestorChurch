import './financial-data.scss'
import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Divider,
  Container
} from '@mui/material';
import { Financial, FinancialSummary } from '@domain/financial';
import { financialSummaryAdd, findAllFinancials } from '@service/FinancialService';
import FinancialModal from './financial-modal/FinancialModal';
import Search from '@components/search/Search';
import SnackBarMessage from '@components/snackBarMessage/SnackBarMessage';

export default function FinancialData() {
    const [records, setRecords] = useState<Financial[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [filtered, setFiltered] = useState<Financial[]>([]);
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

        setRecords(data);
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
            <Search<Financial> 
                data={records}
                onFilter={setFiltered}
                label={'Buscar uma movimentação'}
                searchBy={(item, term) => 
                    item?.member?.name.toLowerCase().includes(term.toLowerCase())
                }                 
            />
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() =>newFinancial()}
            >
                Nova Movimentação
            </Button>
            <Box className='service-order'>
                {filtered.map((item) => (
                    <Paper
                        key={item.id}
                        elevation={2}
                        className='order-card'
                    >
                        <Typography variant="subtitle2" className='title-secondary'>
                            {/* Faturamento OS - {item.serviceOrder?.orderNumber ?? 'Movimentação Manual'} */}
                        </Typography>

                        <Divider sx={{ my: 1 }} />

                        <Typography variant="body2">Entrada: R$ {item.income}</Typography>
                        <Typography variant="body2">Saída: R$ {item.expense}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                            Saldo: R$ {(item.income - item.expense).toFixed(2)}
                        </Typography>
                        <Typography variant="body2">Colaborador: {item.member?.name ?? 'Gerente'}</Typography>
                        <Typography variant="caption" display="block" mt={1}>
                            Criado em: {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                    </Paper>
                ))}
            </Box>
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
