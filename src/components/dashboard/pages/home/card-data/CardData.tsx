import { useFinancial } from '@context/FinancialContext';
import './card-data.scss'
import { Box, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Visitor } from '@domain/user';
import { findAllVisitors } from '@service/VisitorService';

export default function CardData() {
    const [data, setData] = useState<Visitor[]>([]);
    const { currentCash, monthInflow, monthOutflow } = useFinancial();

    const totalClients = data.length;

    useEffect(() => {
        findAllVisitors()
            .then((it) => {
                setData(it)
            });
    }, []);

    return (
        <Box className="home-statistics">
            <Paper className="home-card" elevation={3} sx={{ flex: '1 1 220px', p: 2, textAlign: 'center' }}>
                <Typography className='title-secondary' variant="h6">Total de clientes</Typography>
                <Typography variant="h4">{totalClients}</Typography>
            </Paper>
            <Paper className="home-card" elevation={3} sx={{ flex: '1 1 220px', p: 2, textAlign: 'center' }}>
                <Typography className='title-secondary' variant="h6">Saldo Atual</Typography>
                <Typography variant="h4">R$ {currentCash.toFixed(2)}</Typography>
            </Paper>
            <Paper className="home-card" elevation={3} sx={{ flex: '1 1 220px', p: 2, textAlign: 'center' }}>
                <Typography className='title-secondary' variant="h6">Entradas no Mês</Typography>
                <Typography variant="h4">R$ {monthInflow.toFixed(2)}</Typography>
            </Paper>
            <Paper className="home-card" elevation={3} sx={{ flex: '1 1 220px', p: 2, textAlign: 'center' }}>
                <Typography className='title-secondary' variant="h6">Saídas no Mês</Typography>
                <Typography variant="h4">R$ {monthOutflow.toFixed(2)}</Typography>
            </Paper>
        </Box>
    )
}