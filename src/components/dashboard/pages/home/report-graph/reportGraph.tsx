import { Typography } from "@mui/material";
import { findAllReports } from "@service/ReportChurchService";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br"; 
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ReportChurch } from "@domain/report";
import { allMonth } from "../all-month";
dayjs.extend(customParseFormat);

type ReportWithMonth = ReportChurch & { month: string };

export default function ReportGraph() {
    const [data, setData] = useState<ReportWithMonth[]>([]);

    useEffect(() => {
        findAllReports().then((reports: any[]) => {
            const parsedReports = reports.map((r) => ReportChurch.fromJson(r));
            const monthGroup: { [month: string]: ReportWithMonth } = {};

            parsedReports.forEach((report) => {
                if (!report.createdAt) return;

                const date = dayjs(report.createdAt);
                if (!date.isValid()) return;

                const month = date.locale('pt-br').format("MMM");
                const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);

                if (!monthGroup[capitalizedMonth]) {
                    monthGroup[capitalizedMonth] = Object.assign(new ReportChurch(), {
                        month: capitalizedMonth,
                        totalPeople: 0,
                        totalChildren: 0,
                        totalVolunteers: 0,
                        decisionsForJesus: 0,
                        baptismCandidates: 0,
                        firstTimeVisitors: 0,
                        returningPeople: 0,
                        newMembers: 0,
                        peopleBaptizedThisMonth: 0
                    });
                }

                monthGroup[capitalizedMonth].totalPeople += report.totalPeople;
                monthGroup[capitalizedMonth].totalChildren += report.totalChildren;
                monthGroup[capitalizedMonth].totalVolunteers += report.totalVolunteers;
                monthGroup[capitalizedMonth].decisionsForJesus += report.decisionsForJesus;
                monthGroup[capitalizedMonth].baptismCandidates += report.baptismCandidates;
                monthGroup[capitalizedMonth].firstTimeVisitors += report.firstTimeVisitors;
                monthGroup[capitalizedMonth].returningPeople += report.returningPeople;
                monthGroup[capitalizedMonth].newMembers += report.newMembers;
                monthGroup[capitalizedMonth].peopleBaptizedThisMonth += report.peopleBaptizedThisMonth;
            });

            const finalData = allMonth.map((month) => {
                return monthGroup[month] || {
                    month,
                    totalPeople: 0,
                    totalChildren: 0,
                    totalVolunteers: 0,
                    decisionsForJesus: 0,
                    baptismCandidates: 0,
                    firstTimeVisitors: 0,
                    returningPeople: 0,
                    newMembers: 0,
                    peopleBaptizedThisMonth: 0
                };
            });

            setData(finalData);
        });
    }, []);

    return (
        <>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }} className='title-secondary'>
                📊 Relatório Mensal
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalPeople" fill="#2196f3" name="Pessoas Totais" barSize={30}/>
                    <Bar dataKey="totalChildren" fill="#4caf50" name="Crianças" barSize={30}/>
                    <Bar dataKey="totalVolunteers" fill="#ff9800" name="Voluntários" barSize={30}/>
                    <Bar dataKey="decisionsForJesus" fill="#e91e63" name="Decisões por Jesus" barSize={30}/>
                    <Bar dataKey="baptismCandidates" fill="#673ab7" name="Candidatos ao Batismo" barSize={30}/>
                    <Bar dataKey="firstTimeVisitors" fill="#00bcd4" name="Visitantes Novos" barSize={30}/>
                    <Bar dataKey="returningPeople" fill="#8bc34a" name="Retornos" barSize={30}/>
                    <Bar dataKey="newMembers" fill="#795548" name="Novos Membros" barSize={30}/>
                    <Bar dataKey="peopleBaptizedThisMonth" fill="#f44336" name="Batizados no Mês" barSize={30}/>
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
