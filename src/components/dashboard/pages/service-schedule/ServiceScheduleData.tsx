import './service-schedule.scss';
import Layout from "@components/layout/Layout";
import { ServiceSchedule } from "@domain/ServiceSchedule/ServiceSchedule";
import { DateUtil } from "@domain/utils";
import { Box, Card, Typography } from "@mui/material";
import { findAllSchedule } from "@service/ScheduleService";
import { useEffect, useState } from "react";

export default function ServiceScheduleData() {
    const [data, setData] = useState<ServiceSchedule[]>([])

    async function fetchData(): Promise<void> {
        const response = await findAllSchedule();
        setData(response);
    }

    function extractFirstName<T extends { name: string }>(entities: T[]): string {
        return entities.map(it => it?.name.split(' ')[0]).join(' / ');
    }

    function groupByWeekDayAndPeriod(data: ServiceSchedule[]) {
        const grouped: Record<string, { title: string, items: ServiceSchedule[] }> = {};
        data.forEach((item) => {
            if (!item.date) return;
            const dateKey = DateUtil.dateFormated(item.date);
            const title = `${item.weekDay} - ${dateKey}`;

            if (!grouped[dateKey]) {
                grouped[dateKey] = {
                    title,
                    items: []
                };
            }

            grouped[dateKey].items.push(item);
        });

        return grouped;
    }

    function isFutureDate(date: string): boolean {
        const today = new Date();
        const scheduleDate = new Date(date);
        return DateUtil.dateFormated(today) <= DateUtil.dateFormated(scheduleDate);
    }

    // Tentando colocar uma funcao para removeer Escalas que ja passaram da data

    // async function removeExpiredSchedules(groupedData: Record<string, { title: string, items: ServiceSchedule[] }>) {
    //     for (const [dateKey, { items }] of Object.entries(groupedData)) {
    //         items.forEach(async (schedule) => {
    //             const scheduleDate = DateUtil.dateFormated(schedule.date);
    //             if (new Date(scheduleDate) < new Date()) {
    //                 schedule.isActive = false;
    //                 await schedulesUpdate(schedule.id, { isActive: false });
    //             }
    //         });
    //     }
    // }

    const groupedData = groupByWeekDayAndPeriod(
        data.filter((it) => isFutureDate(DateUtil.dateFormated(it.date)))
    );

    useEffect(() => {
        fetchData();
    }, [])

    useEffect(() => {
        if (data.length > 0) {
            const groupedData = groupByWeekDayAndPeriod(
                data.filter((it) => isFutureDate(DateUtil.dateFormated(it.date)))
            );
            // removeExpiredSchedules(groupedData);
        }
    }, [data]);

    return (
        <Layout
            total={data.filter((it) => isFutureDate(DateUtil.dateFormated(it.date))).length}
            title="Escala de Serviço"
            path="new-service-schedule"
            message="Escala criada com sucesso!"
        >
            {Object.entries(groupedData)
                .filter(([items]) => items.length > 0)
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                .map(([_, { title, items }]) => (
                    <>
                        <Typography variant="h6" className="title-secondary">{title}</Typography>
                        <Box key={title} className="serviceSchedule">
                            {items
                                .filter((it) => it.isActive)
                                .sort((a, b) => a.timePeriod.localeCompare(b.timePeriod))
                                .map((it) => (
                                    <Card key={it.id} className="card">
                                        <Typography className="subTitle">{it.departament}</Typography>
                                        <Typography className='textInfo'> <span className='subTextInfo'>Responsável: </span>{it.leader?.name?.split(' ')[0]}</Typography>
                                        <Typography className='textInfo'> <span className='subTextInfo'>Data: </span>{DateUtil.dateFormated(it.date)}</Typography>
                                        <Typography className='textInfo'> <span className='subTextInfo'>Dia: </span>{it.weekDay} - {it.timePeriod}</Typography>
                                        <Typography className='textInfo'> <span className='subTextInfo'>Membros: </span>{extractFirstName(it.members)}</Typography>
                                        <Typography className='textInfo'> <span className='subTextInfo'>Menores: </span>{extractFirstName(it.childrens)}</Typography>
                                        <Typography className='textInfo'> <span className='subTextInfo'>Observação: </span>{it.observation}</Typography>

                                    </Card>
                                ))}
                        </Box>
                    </>
                ))}
        </Layout>
    )
}