import { useEffect, useState } from "react";
import { format, parse } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { allMonth } from "../all-month";
import { Typography } from "@mui/material";
import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, ResponsiveContainer } from 'recharts';
import { findAllVisitors } from "@service/VisitorService";

export default function VisitorGraph() {
    const [visitorData, setVisitorData] = useState<{ month: string, visits: number, uniqueVisitors: number }[]>([]);

    useEffect(() => {
        findAllVisitors().then((visitors) => {
            const monthVisitCount: { [key: string]: number } = {};
            const monthUniqueVisitors: { [key: string]: Set<string> } = {};
            
            visitors.forEach(visitor => {
                const { id, visitHistory } = visitor;

                    visitHistory.forEach(dateStr => {
                        if (!dateStr) return;

                        const parts = dateStr.split(', ');

                        if (parts.length < 2) return;

                        const dateParsed = parse(parts[1], 'dd/MM/yyyy', new Date());

                        if (isNaN(dateParsed.getTime())) return;

                        const month = format(dateParsed, 'MMM', { locale: ptBR });
                        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

                        monthVisitCount[capitalizedMonth] = (monthVisitCount[capitalizedMonth] || 0) + 1;

                        if (!monthUniqueVisitors[capitalizedMonth]) {
                            monthUniqueVisitors[capitalizedMonth] = new Set();
                        }
                            monthUniqueVisitors[capitalizedMonth].add(id);
                    });

            });

            const visitorsPerMonth = allMonth.map((month) => ({
                month,
                visits: monthVisitCount[month] || 0,
                uniqueVisitors: monthUniqueVisitors[month]?.size || 0
            }));

        
            setVisitorData(visitorsPerMonth);
        });
    }, []);

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }} className='title-secondary'>👥 Movimento de Visitantes</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" fill="#2196f3" name="Total de Visitas" />
                    <Bar dataKey="uniqueVisitors" fill="#4caf50" name="Visitantes Únicos" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
