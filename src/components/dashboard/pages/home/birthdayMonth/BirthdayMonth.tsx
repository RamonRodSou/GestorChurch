import { Member } from "@domain/user";
import { DateUtil } from "@domain/utils";
import { Box, Typography } from "@mui/material";
import { findAllMembers } from "@service/MemberService";
import { useEffect, useState } from "react";

export default function BirthdayMonth() {
    const [todayBirthdays, setTodayBirthdays] = useState<Member[]>([]);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState<Member[]>([]);

    useEffect(() => {
        findAllMembers()
            .then((members) => {
                checkBirthdays(members);
            })
            .catch(console.error);
    }, []);

    function calculateAge(birthdate: Date, today: Date): number {
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();

        const hasBirthdayPassed =
            today.getMonth() > birth.getMonth() ||
            (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());

        if (!hasBirthdayPassed) {
            age--;
        }

        return age + 1;
    }

    function checkBirthdays(members: Member[]) {
        const today = new Date();
        const todayDay = today.getDate();
        const todayMonth = today.getMonth();

        const inTenDays = new Date();
        inTenDays.setDate(today.getDate() + 10);

        const todayList = members.filter(member => {
            const birth = new Date(member.birthdate);
            return birth.getDate() === todayDay && birth.getMonth() === todayMonth;
        });

        const upcomingList = members.filter(member => {
            const birth = new Date(member.birthdate);
            const birthdayThisYear = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());

            return birthdayThisYear > today && birthdayThisYear <= inTenDays;
        });

        setTodayBirthdays(todayList);
        setUpcomingBirthdays(upcomingList);
    };

    const today = new Date();

    return (
        <Box>
            {todayBirthdays.length > 0 && (
                <Box>
                    <Typography variant="subtitle1" className="textInfo">🎉 Hoje é aniversário de:</Typography>
                    {todayBirthdays.map(member => {
                        const age = calculateAge(new Date(member.birthdate), today);
                        return (
                            <Typography className="textInfo" key={member.id}>
                                {member.name} - {age} anos
                            </Typography>
                        );
                    })}
                </Box>
            )}

            {upcomingBirthdays.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    <Typography className="textInfo" variant="subtitle1">📅 Próximos aniversários (10 dias):</Typography>
                    {upcomingBirthdays.map(member => {
                        const age = calculateAge(new Date(member.birthdate), today);
                        return (
                            <Typography key={member.id} className="textInfo">
                                {member.name} - Faz: {age}, anos no dia {DateUtil.dateFormatedDayAndMonth(member.birthdate)} 
                            </Typography>
                        );
                    })}
                </Box>
            )}

            {todayBirthdays.length === 0 && upcomingBirthdays.length === 0 && (
                <Typography className="textInfo" variant="body2" sx={{ mt: 2 }}>
                    Nenhum aniversário hoje ou nos próximos 10 dias.
                </Typography>
            )}
        </Box>
    );
}
