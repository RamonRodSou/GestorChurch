import './financial-card.scss'
import { Financial } from "@domain/financial";
import { Box, Paper, Typography, Button } from "@mui/material";
import { findAllFinancials } from "@service/FinancialService";
import { useEffect, useState } from "react";
import { MoneyMovement } from '@domain/enums';
import { DateUtil } from "@domain/utils";

enum Period {
    ALL = 'TODOS',
    CURRENT_MONTH = 'ESTE MÊS',
    LAST_MONTH = 'ÚLTIMO MÊS',
    CURRENT_WEEK = 'ESTA SEMANA'
}

export default function FinancialCard() {
    const [financials, setFinancials] = useState<Financial[]>([]);
    const [filter, setFilter] = useState<Period>(Period.ALL);

    useEffect(() => {
        findAllFinancials()
        .then(setFinancials)
        .catch(console.error);
    }, []);

    const filtered = financials.filter(item => {
        if (filter === Period.ALL)
            return DateUtil.isDateInCurrentWeek(item.createdAt);

        if (filter === Period.CURRENT_MONTH) 
            return DateUtil.isDateInCurrentMonth(item.createdAt);

        if (filter ===  Period.LAST_MONTH)
            return DateUtil.isDateInLastMonth(item.createdAt);
        
        return true;
    });

    return (
        <Box>
            <Box className='boxFilter'>
                <Button variant={filter === Period.ALL ? 'contained' : 'outlined'} onClick={() => setFilter(Period.ALL)}>
                    {Period.ALL}
                </Button>
                <Button variant={filter === Period.CURRENT_WEEK ? 'contained' : 'outlined'} onClick={() => setFilter(Period.CURRENT_WEEK)}>
                    {Period.CURRENT_WEEK}
                </Button>
                <Button variant={filter === Period.CURRENT_MONTH ? 'contained' : 'outlined'} onClick={() => setFilter(Period.CURRENT_MONTH)}>
                   {Period.CURRENT_MONTH}
                </Button>
                <Button variant={filter === Period.LAST_MONTH ? 'contained' : 'outlined'} onClick={() => setFilter(Period.LAST_MONTH)}>
                    {Period.LAST_MONTH}
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
