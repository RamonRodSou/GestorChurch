import { Financial } from "@domain/financial";
import { Box, Paper, Typography } from "@mui/material";
import { findAllFinancials } from "@service/FinancialService";
import { useEffect, useState } from "react";

export default function FinancialCard() {
    const [filtered, setFiltered] = useState<Financial[]>([]);
    
    useEffect(() => {
        findAllFinancials()
            .then((it) => {
                setFiltered(it);
            })
            .catch(console.error);
    }, []);
    
    return (
        <Box className='service-order'>
            {filtered.map((item) => {
                const isIncome = item.income > 0;
                const cardColor = isIncome ? '#e8f5e9' : '#ffebee';
                const borderColor = isIncome ? 'green' : 'red';

                return (
                    <Paper
                        key={item.id}
                        elevation={3}
                        className='order-card'
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
                        R$ {(isIncome ? item.income : item.expense).toFixed(2)}
                        </Typography>

                        <Typography variant="body2" mt={1}>
                        Membro: {item.member?.name ?? 'Gerente'}
                        </Typography>

                        <Typography variant="caption" display="block" mt={1}>
                        Criado em: {new Date(item.createdAt).toLocaleDateString()}
                        </Typography>
                    </Paper>
                );
            })}

            </Box>
    )
}