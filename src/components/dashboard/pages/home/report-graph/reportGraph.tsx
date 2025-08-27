import { Typography } from "@mui/material";
import { findAllReports } from "@service/ReportChurchService";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { ReportChurch } from "@domain/report";
dayjs.extend(customParseFormat);

type ReportWithMonth = ReportChurch & { month: string, count: number };

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

                const month = date.locale('pt-br').format("DD/MMM/YYYY");
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
                        peopleBaptizedThisMonth: 0,
                        count: 0
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
                monthGroup[capitalizedMonth].count++;
            });

            const finalData: ReportWithMonth[] = Object.values(monthGroup).map(m => {
                const report = new ReportChurch();
                Object.assign(report, {
                    ...m,
                    totalPeople: Math.round(m.totalPeople / m.count),
                    totalChildren: Math.round(m.totalChildren / m.count),
                    totalVolunteers: Math.round(m.totalVolunteers / m.count),
                    decisionsForJesus: Math.round(m.decisionsForJesus / m.count),
                    baptismCandidates: Math.round(m.baptismCandidates / m.count),
                    firstTimeVisitors: Math.round(m.firstTimeVisitors / m.count),
                    returningPeople: Math.round(m.returningPeople / m.count),
                    newMembers: Math.round(m.newMembers / m.count),
                    peopleBaptizedThisMonth: Math.round(m.peopleBaptizedThisMonth / m.count),
                });
                return report as ReportWithMonth;
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
                    <Bar dataKey="totalPeople" fill="#2196f3" name="Pessoas" barSize={30} />
                    <Bar dataKey="totalChildren" fill="#4caf50" name="Crianças" barSize={30} />
                    <Bar dataKey="totalVolunteers" fill="#ff9800" name="Voluntários" barSize={30} />
                    <Bar dataKey="decisionsForJesus" fill="#e91e63" name="Aceitaram Jesus" barSize={30} />
                    <Bar dataKey="baptismCandidates" fill="#673ab7" name="Deram nome p/ Batismo" barSize={30} />
                    <Bar dataKey="firstTimeVisitors" fill="#00bcd4" name="Visitantes" barSize={30} />
                    <Bar dataKey="returningPeople" fill="#8bc34a" name="Voltaram na Igreja" barSize={30} />
                    <Bar dataKey="newMembers" fill="#795548" name="Novos Membros" barSize={30} />
                    <Bar dataKey="peopleBaptizedThisMonth" fill="#f44336" name="Batizados no Mês" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}
