import './financial-graph.scss';
import { Financial } from '@domain/financial';
import { Typography } from '@mui/material';
import { findAllFinancials } from '@service/FinancialService';
import { useContext, useEffect, useState } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { allMonth } from '../all-month';
import { useFinancial } from '@context/FinancialContext';
import { PermissionContext } from '@context/PermissionContext';
import { MoneyMovement } from '@domain/enums';

interface FinancialSummary {
    month: string;
    income: number;
    expense: number;
}

export default function FinancialGraph() {
    const [chartData, setChartData] = useState<FinancialSummary[]>([]);
    const { setFinancialData } = useFinancial();
    const context = useContext(PermissionContext);
    const { permission }: any = context;

    function getMonthlySummary(data: Financial[]) {
        const summary: Record<string, { income: number; expense: number }> = {};

        data.forEach(({ createdAt, type, value }) => {
            const month = allMonth[new Date(createdAt).getMonth()];
            if (!summary[month]) summary[month] = { income: 0, expense: 0 };

            if (type === MoneyMovement.INCOME) {
            summary[month].income += value;
            } else if (type === MoneyMovement.EXPENSE) {
            summary[month].expense += value;
            }
        });

        return summary;
    }

    function formatChartData(summary: Record<string, { income: number; expense: number }>): FinancialSummary[] {
        return allMonth.map(month => ({
            month,
            income: summary[month]?.income || 0,
            expense: summary[month]?.expense || 0,
        }));
    }

    function calculateTotalBalance(data: Financial[]) {
        return data.reduce((sum, item) =>
            item.type === MoneyMovement.INCOME ? sum + item.value : sum - item.value, 0);
    }

    function getCurrentMonthFlow(summary: Record<string, { income: number; expense: number }>) {
        const currentMonth = allMonth[new Date().getMonth()];
        return {
            monthInflow: summary[currentMonth]?.income || 0,
            monthOutflow: summary[currentMonth]?.expense || 0
        };
    }

    useEffect(() => {
        async function loadFinancials() {
            const data = await findAllFinancials();

            const summary = getMonthlySummary(data);
            setChartData(formatChartData(summary));

            const currentCash = calculateTotalBalance(data);
            const { monthInflow, monthOutflow } = getCurrentMonthFlow(summary);

            setFinancialData({ currentCash, monthInflow, monthOutflow });
        }

        loadFinancials();
    }, []);

  return (
    <>
      {permission >= 10 && (
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
      )}
    </>
  );
}
