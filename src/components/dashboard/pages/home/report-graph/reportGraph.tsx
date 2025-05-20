import { Typography } from "@mui/material";
import { findAllReports } from "@service/ReportChurchService";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br"; 
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { ReportChurch } from "@domain/report";

interface AggregatedData {
    month: string;
    totalPeople: number;
    totalChildren: number;
    totalVolunteers: number;
    decisionsForJesus: number;
    baptismCandidates: number;
    firstTimeVisitors: number;
    returningPeople: number;
    newMembers: number;
    peopleBaptizedThisMonth: number;
}

export default function ReportGraph() {
    const [data, setData] = useState<AggregatedData[]>([]);

useEffect(() => {
    findAllReports().then((reports: any[]) => {
        const parsedReports = reports.map((r) => ReportChurch.fromJson(r));

        const grouped: { [month: string]: AggregatedData } = {};

        parsedReports.forEach((report) => {
            if (!report.createdAt) return;

            const dayjsDate = dayjs(report.createdAt, "DD/MM/YYYY, HH:mm:ss");
            if (!dayjsDate.isValid()) {
                console.warn("Data inválida:", report.createdAt);
                return;
            }

            const month = dayjsDate.locale('pt-br').format("MMM");
            const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

            if (!grouped[capitalizedMonth]) {
                grouped[capitalizedMonth] = {
                    month: capitalizedMonth,
                    totalPeople: 0,
                    totalChildren: 0,
                    totalVolunteers: 0,
                    decisionsForJesus: 0,
                    baptismCandidates: 0,
                    firstTimeVisitors: 0,
                    returningPeople: 0,
                    newMembers: 0,
                    peopleBaptizedThisMonth: 0,
                };
            }

            grouped[capitalizedMonth].totalPeople += report.totalPeople;
            grouped[capitalizedMonth].totalChildren += report.totalChildren;
            grouped[capitalizedMonth].totalVolunteers += report.totalVolunteers;
            grouped[capitalizedMonth].decisionsForJesus += report.decisionsForJesus;
            grouped[capitalizedMonth].baptismCandidates += report.baptismCandidates;
            grouped[capitalizedMonth].firstTimeVisitors += report.firstTimeVisitors;
            grouped[capitalizedMonth].returningPeople += report.returningPeople;
            grouped[capitalizedMonth].newMembers += report.newMembers;
            grouped[capitalizedMonth].peopleBaptizedThisMonth += report.peopleBaptizedThisMonth;
        });

        const finalData = Object.values(grouped);

        setData(finalData);
    });
}, []);


    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }} className='title-secondary'>📊 Relatório Mensal</Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalPeople" fill="#2196f3" name="Pessoas Totais" />
                    <Bar dataKey="totalChildren" fill="#4caf50" name="Crianças" />
                    <Bar dataKey="totalVolunteers" fill="#ff9800" name="Voluntários" />
                    <Bar dataKey="decisionsForJesus" fill="#e91e63" name="Decisões por Jesus" />
                    <Bar dataKey="baptismCandidates" fill="#673ab7" name="Candidatos ao Batismo" />
                    <Bar dataKey="firstTimeVisitors" fill="#00bcd4" name="Visitantes Novos" />
                    <Bar dataKey="returningPeople" fill="#8bc34a" name="Retornos" />
                    <Bar dataKey="newMembers" fill="#795548" name="Novos Membros" />
                    <Bar dataKey="peopleBaptizedThisMonth" fill="#f44336" name="Batizados no Mês" />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
