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
        return scheduleDate >= today;
    }

    const groupedData = groupByWeekDayAndPeriod(
        data.filter((it) => it.date && isFutureDate(DateUtil.dateFormated(it.date)))
    );

    useEffect(() => { 
        fetchData();
    },[])

    return (
        <Layout total={data?.length} title="Escala de Serviço" path="new-service-schedule" message="Escala criada com sucesso!">
            {Object.entries(groupedData)
                .filter(([items]) => items.length > 0) 
                .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
                 .map(([_, { title, items }]) => (
                    
                <>
                    <Typography variant="h6" className="title-secondary">{title}</Typography>
                    <Box key={title} className="serviceSchedule">
                        {items
                            .sort((a, b) => a.timePeriod.localeCompare(b.timePeriod))    
                            .map((it) => (
                                <Card key={it.id} className="card">
                                    <Typography className="subTitle">{it.departament}</Typography>
                                    <Typography className='textInfo'> <span className='subTextInfo'>Responsável: </span>{it.leader?.name?.split(' ')[0]}</Typography>
                                    <Typography className='textInfo'> <span className='subTextInfo'>Data: </span>{DateUtil.dateFormated(it.date)}</Typography>
                                    <Typography className='textInfo'> <span className='subTextInfo'>Dia: </span>{it.weekDay} - {it.timePeriod}</Typography>
                                    <Typography className='textInfo'> <span className='subTextInfo'>Membros: </span>{extractFirstName(it.members)}</Typography>
                                    <Typography className='textInfo'> <span className='subTextInfo'>Menores: </span>{extractFirstName(it.childrens)}</Typography>
                                </Card>
                        ))}
                    </Box>
                </>
            ))}
        </Layout>
    )
}