import './financial-graph.scss';
import { Financial } from '@domain/financial';
import { Typography } from '@mui/material';
import { findAllFinancials } from '@service/FinancialService';
import { useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { allMonth } from '../all-month';
import { useFinancial } from '@context/FinancialContext';

interface FinancialSummary {
    month: string;
    income: number;
    expense: number;
}

export default function FinancialGraph() {
    const [chartData, setChartData] = useState<FinancialSummary[]>([]);
    const { setFinancialData } = useFinancial();

    useEffect(() => {
        async function load() {
            const data: Financial[] = await findAllFinancials();
    
            const monthlyData: Record<string, { income: number; expense: number }> = {};
    
            data.forEach(item => {
                const date = new Date(item.createdAt); 
                const monthIndex = date.getMonth(); 
                const month = allMonth[monthIndex];
    
                if (!monthlyData[month]) {
                    monthlyData[month] = { income: 0, expense: 0 };
                }
    
                monthlyData[month].income += item.income;
                monthlyData[month].expense += item.expense;
            });
    
            const formattedData: FinancialSummary[] = allMonth.map(month => ({
                month,
                income: monthlyData[month]?.income || 0,
                expense: monthlyData[month]?.expense || 0
            }));
    
            setChartData(formattedData);
    
            const total = data.reduce((sum, item) => sum + item.balance, 0);
            const now = new Date();
            const currentMonth = allMonth[now.getMonth()];
            const inflow = monthlyData[currentMonth]?.income || 0;
            const outflow = monthlyData[currentMonth]?.expense || 0;
    
            setFinancialData({ currentCash: total, monthInflow: inflow, monthOutflow: outflow });
        }
    
        load();
    }, []);

    return (
        <>
            <Typography variant="h5" gutterBottom className='title-secondary'>📈 Finanças do Ano</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <Line type="monotone" dataKey="income" stroke="#4caf50" strokeWidth={3} name="Entradas" />
                    <Line type="monotone" dataKey="expense" stroke="#f44336" strokeWidth={3} name="Saídas" />
                    <CartesianGrid stroke="#ccc" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                </LineChart>
            </ResponsiveContainer>
        </>
    )
}
