import { useEffect, useState } from "react";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { allMonth } from "../all-month";
import { Typography } from "@mui/material";
import { CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, ResponsiveContainer } from 'recharts';
import { findAllVisitors } from "@service/VisitorService";

export default function VisitorGraph() {
    const [visitorData, setVisitorData] = useState<{ month: string, newVisitor: number }[]>([]);
    const monthCount: { [key: string]: number } = {};

        useEffect(() => {
            findAllVisitors()
                .then((it) => {
                    it.forEach(visitor => {
                        const month = format(new Date(visitor.createdAt), 'MMM', { locale: ptBR });
                        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        
                        monthCount[capitalizedMonth] 
                            ? monthCount[capitalizedMonth]++
                            : monthCount[capitalizedMonth] = 1;
                    });
        
                    const visitorsPerMonth = allMonth.map((month) => ({
                        month,
                        newVisitor: monthCount[month] || 0
                    }));
        
                    setVisitorData(visitorsPerMonth);
                });
        }, []);
    
    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }} className='title-secondary'>👥 Movimento de Visitantes</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <XAxis dataKey="month"/>
                    <YAxis/>
                    <Tooltip/>
                    <Legend/>
                    <Bar dataKey="newClient" fill="#2196f3" name="Entradas"/>
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}