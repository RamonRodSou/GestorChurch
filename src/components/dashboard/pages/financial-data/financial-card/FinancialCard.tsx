import './financial-card.scss'
import { Financial } from "@domain/financial";
import { Box, Paper, Typography, Button, ButtonGroup } from "@mui/material";
import { findAllFinancials } from "@service/FinancialService";
import { useEffect, useState } from "react";
import { MoneyMovement } from '@domain/enums';
import { DateUtil } from "@domain/utils";

export default function FinancialCard() {
    const [financials, setFinancials] = useState<Financial[]>([]);
    const [filter, setFilter] = useState<'all' | 'month' | 'week'>('all');

    useEffect(() => {
        findAllFinancials()
        .then(setFinancials)
        .catch(console.error);
    }, []);

    const filtered = financials.filter(item => {
        if (filter === 'month') 
            return DateUtil.isDateInCurrentMonth(item.createdAt);
        
        if (filter === 'week')
            return DateUtil.isDateInCurrentWeek(item.createdAt);
        
        return true;
    });

    return (
        <Box>
            <Box className='boxFilter'>
                <Button variant={filter === 'all' ? 'contained' : 'outlined'} onClick={() => setFilter('all')}>
                    Todos
                </Button>
                <Button variant={filter === 'month' ? 'contained' : 'outlined'} onClick={() => setFilter('month')}>
                    Este Mês
                </Button>
                <Button variant={filter === 'week' ? 'contained' : 'outlined'} onClick={() => setFilter('week')}>
                    Esta Semana
                </Button>
            </Box>

            <Box className="service-order">
                {filtered.map((item) => {
                    const isIncome = item.type === MoneyMovement.INCOME;
                    const cardColor = isIncome ? '#e8f5e9' : '#ffebee';
                    const borderColor = isIncome ? 'green' : 'red';

                    return (
                        <Paper
                        key={item.id}
                        elevation={3}
                        className="order-card"
                        sx={{
                            backgroundColor: cardColor,
                            borderLeft: `5px solid ${borderColor}`,
                            padding: 2,
                            marginBottom: 2
                        }}
                        >
                        <Typography variant="h6" color={borderColor}>
                            {isIncome ? 'Entrada' : 'Saída'}
                        </Typography>

                        <Typography variant="body1" fontWeight="bold">
                            R$ {item.value.toFixed(2)}
                        </Typography>

                        <Typography variant="caption" display="block" mt={1}>
                            Criado em: {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                        </Paper>
                    );
                })}
            </Box>
        </Box>
    );
}
