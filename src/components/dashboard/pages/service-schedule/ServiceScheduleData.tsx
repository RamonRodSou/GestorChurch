import './service-schedule.scss';
import Layout from "@components/layout/Layout";
import { ServiceSchedule } from "@domain/ServiceSchedule/ServiceSchedule";
import { DateUtil, NOT_REGISTER } from "@domain/utils";
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
        if (!entities || entities.length === 0) {
            return NOT_REGISTER;
        }
        return entities
            .map(it => it?.name.split(' ')[0]).join(' / ');
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

    function isFutureDate(date: Date | string): boolean {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const scheduleDate = new Date(date);
        scheduleDate.setHours(0, 0, 0, 0);
        return scheduleDate >= today;
    }

    const groupedData = groupByWeekDayAndPeriod(
        data
            .filter((it) => isFutureDate(it.date))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );

    useEffect(() => {
        fetchData();
    }, [])

    return (
        <Layout
            total={data.filter((it) => isFutureDate(it.date)).length}
            title="Escala de Serviço"
            path="new-service-schedule"
            message="Escala criada com sucesso!"
        >
            {Object.entries(groupedData)
                .filter(([_, { items }]) => items.length > 0)
                .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
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
                                        <Typography className='textInfo'> <span className='subTextInfo' key={it.id}>Membros: </span>{extractFirstName(it.members)}</Typography>
                                        <Typography className='textInfo'>
                                            <span
                                                className='subTextInfo'
                                                key={it?.childrens.filter((it) => it?.id) && null}
                                            >
                                                Menores:
                                            </span> {extractFirstName(it.childrens)}
                                        </Typography>
                                        <Typography className='textInfo'> <span className='subTextInfo'>Observação: </span>{it.observation ?? NOT_REGISTER}</Typography>
                                    </Card>
                                ))}
                        </Box>
                    </>
                ))}
        </Layout>
    )
}