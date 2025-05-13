import { useFinancial } from '@context/FinancialContext';
import './card-data.scss'
import { Box, Paper, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { MemberSummary, Visitor } from '@domain/user';
import { findAllMembersSummary } from '@service/MemberService';
import { PermissionContext } from '@context/PermissionContext';
import { findAllVisitors } from '@service/VisitorService';

export default function CardData() {
    const [data, setData] = useState<MemberSummary[]>([]);
    const [visitor, setVisitor] = useState<Visitor[]>([]);
    const { currentCash, monthInflow, monthOutflow } = useFinancial();
    const context = useContext(PermissionContext);
    const { permission  }: any = context;

    const members = data.length;
    const visitors = visitor.length;

    useEffect(() => {
        findAllMembersSummary()
            .then((it) => {
                setData(it)
            });
        findAllVisitors()
            .then((it) => {
                setVisitor(it)
        })
    }, []); 

    return (
        <>
            <Box className="home-statistics">
                <Paper className="home-card" elevation={3} sx={{ flex: '1 1 220px', p: 2, textAlign: 'center' }}>
                    <Typography className='title-secondary' variant="h6">Total de Membros</Typography>
                    <Typography variant="h4">{members}</Typography>
                </Paper>
                <Paper className="home-card" elevation={3} sx={{ flex: '1 1 220px', p: 2, textAlign: 'center' }}>
                    <Typography className='title-secondary' variant="h6">Total de Visitantes</Typography>
                    <Typography variant="h4">{visitors}</Typography>
                </Paper>
                {permission >= 10 && (
                    <>
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
                    </>
                )}
            </Box>
        </>
    )
}