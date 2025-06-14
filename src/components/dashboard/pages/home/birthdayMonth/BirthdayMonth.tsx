import BirthdayList from "@components/birthdayList/BirthdayList";
import { Child, Member } from "@domain/user";
import { DateUtil } from "@domain/utils";
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

        const inTenDays = new Date();
        inTenDays.setDate(today.getDate() + 10);

        const todayList = data.filter(it => {
            const birth = new Date(it.birthdate);
            return birth.getDate() === todayDay && birth.getMonth() === todayMonth;
        });

        const upcomingList = data.filter(it => {
            const birth = new Date(it.birthdate);
            const birthdayThisYear = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());

            return birthdayThisYear > today && birthdayThisYear <= inTenDays;
        });

        setTodayBirthdays(todayList);
        setUpcomingBirthdays(upcomingList);
    };

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
                    <>
                        {DateUtil.dateFormatedDayAndMonth(it.birthdate)} -
                        <span className="birthday"> {it.name} </span> -
                        COMPLETANDO {age(it.birthdate) - 1} ANOS -
                        MEMBRO: {it.isActive
                            ? <span className="active">ATIVO</span>
                            : <span className="inactive">INATIVO</span>} DA IAF
                    </>
                )}
            />

            <BirthdayList
                title='📅 NOS PRÓXIMOS (10 dias):'
                data={upcomingBirthdays}
                renderItem={(it) => (
                    <>
                        {DateUtil.dateFormatedDayAndMonth(it.birthdate)} -
                        <span className="birthday"> {it.name} </span> -
                        COMPLETA: {age(it.birthdate)} ANOS.
                        MEMBRO: {it.isActive
                            ? <span className="active">ATIVO</span>
                            : <span className="inactive">INATIVO</span>} DA IAF
                    </>
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
