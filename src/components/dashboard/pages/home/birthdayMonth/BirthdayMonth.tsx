import './birthday.css'
import BirthdayList from "@components/birthdayList/BirthdayList";
import { Child, Member } from "@domain/user";
import { DateUtil, sendWhatsappMessage, whatAppMessageBirthday } from "@domain/utils";
import { Box, Typography } from "@mui/material";
import { findAllChildrens } from "@service/ChildrenService";
import { findAllMembers } from "@service/MemberService";
import { useEffect, useState } from "react";

export default function BirthdayMonth() {
    const [todayBirthdays, setTodayBirthdays] = useState<(Member | Child)[]>([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState<any[]>([]);
    const today = new Date();

    function age(data: Date): number {
        return DateUtil.calculateAge(new Date(data), today);
    }

    function checkBirthdays(data: (Member | Child)[]) {
        const today = new Date();
        const todayDay = today.getDate();
        const todayMonth = today.getMonth();

        const inTenDays = new Date(today);
        inTenDays.setDate(today.getDate() + 10);

        const todayList = data.filter(it => {
            const birth = new Date(it.birthdate);
            return birth.getDate() === todayDay && birth.getMonth() === todayMonth;
        });

        const upcomingList = data
            .map(it => {
                const birth = new Date(it.birthdate);
                const birthdayThisYear = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
                return { ...it, birthdayThisYear };
            })
            .filter(it => it.birthdayThisYear > today && it.birthdayThisYear <= inTenDays)
            .sort((a, b) => a.birthdayThisYear.getTime() - b.birthdayThisYear.getTime());

        setTodayBirthdays(todayList);
        setUpcomingBirthdays(upcomingList);
    }


    useEffect(() => {
        Promise.all([findAllMembers(), findAllChildrens()])
            .then(([members, children]) => {
                const allPeople = [...members, ...children];
                checkBirthdays(allPeople);
            })
            .catch(console.error);
    }, []);

    return (
        <Box>
            <BirthdayList
                title='🎉 HOJE É ANIVERSÁRIO DE:'
                data={todayBirthdays}
                renderItem={(it) => (
                    <Box
                        className='container'
                    >
                        <span>{DateUtil.dateFormatedDayAndMonth(it.birthdate)}</span>
                        <span className='name msg'
                            onClick={() => sendWhatsappMessage(it.name, it.phone, whatAppMessageBirthday)}
                        >
                            {it.name}
                        </span>
                        <Box className='birthdate'>
                            <span>({age(it.birthdate)} anos) </span>
                            <span
                                style={{
                                    color: it.isActive ? 'green' : 'red',
                                    fontWeight: 'bold',
                                }}
                            >
                                {it.isActive ? 'ATIVO' : 'INATIVO'}
                            </span>
                        </Box>
                    </Box>
                )}
            />

            <BirthdayList
                title='📅 NOS PRÓXIMOS (10 dias):'
                data={upcomingBirthdays}
                renderItem={(it) => (
                    <Box
                        className='container'
                    >
                        <span>{DateUtil.dateFormatedDayAndMonth(it.birthdate)}</span>
                        <span className='name'
                        >
                            {it.name}
                        </span>
                        <Box className='birthdate'>
                            <span>({age(it.birthdate)} anos) </span>
                            <span
                                style={{
                                    color: it.isActive ? 'green' : 'red',
                                    fontWeight: 'bold',
                                }}
                            >
                                {it.isActive ? 'ATIVO' : 'INATIVO'}
                            </span>
                        </Box>
                    </Box>
                )}
            />

            {todayBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
                <Typography className="textInfo" variant="body2" sx={{ mt: 2 }}>
                    Nenhum aniversário hoje ou nos próximos 10 dias.
                </Typography>
            )}
        </Box>
    );
}
