import './financial-data.scss'
import { useEffect, useState } from 'react';
import {
    Typography,
    Paper,
    Container,
} from '@mui/material';
import { Financial } from '@domain/financial';
import { financialAdd } from '@service/FinancialService';
import FinancialModal from './financial-modal/FinancialModal';
import SnackBarMessage from '@components/snack-bar-message/SnackBarMessage';
import FinancialCard from './financial-card/FinancialCard';
import { MoneyMovement } from '@domain/enums';
import NewBtn from '@components/newBtn/NewBtn';
import { fetchFinancial } from '@domain/utils';
import { Audit } from '@domain/audit';
import { auditAdd } from '@service/AuditService';

export default function FinancialData() {
    const [balance, setBalance] = useState<number>(0);
    const [expense, setExpense] = useState<number>(0);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [financials, setFinancials] = useState<Financial[]>([]);

    const isColorRed = balance >= 0 ? '#e8f5e9' : '#ffebee';

    function newFinancial() {
        return setOpenModal(true);
    }

    async function handleConfirmFinancial(financial: Financial) {
        const audit = Audit.create('Criando card de Finanças', financial.id);

        await financialAdd(financial);
        await auditAdd(audit);

        loadFinancialData()
        setOpenModal(false);
        setOpenSnackbar(true)
    }

    async function load(data: Financial[]) {
        let totalBalance = 0;
        let totalExpense = 0;

        data.forEach((item) => {
            if (item.type === MoneyMovement.INCOME) {
                totalBalance += item.value;
            } else {
                totalBalance -= item.value;
                totalExpense += item.value;
            }
        });

        setBalance(totalBalance);
        setExpense(totalExpense);
    }

    async function loadFinancialData() {
        const data = await fetchFinancial();
        setFinancials(data)
        load(data)
    }

    useEffect(() => {
        loadFinancialData();
    }, []);

    return (
        <>
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
                <FinancialCard financials={financials} />
                <FinancialModal
                    title='Nova movimentação'
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    onConfirm={handleConfirmFinancial}
                />
                <SnackBarMessage
                    message={"Movimentação cadastrada com sucesso!"}
                    openSnackbar={openSnackbar}
                    setOpenSnackbar={setOpenSnackbar}
                />
            </Container>
            <NewBtn navTo={() => newFinancial()} />
        </>
    );
}
