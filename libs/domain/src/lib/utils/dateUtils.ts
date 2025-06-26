import dayjs from "dayjs";

export class DateUtil {

    static dateFormated(date: Date | string) {
        return new Date(date).toLocaleDateString("pt-BR")
    }

    static dateFormatedPtBr(date: Date | string) {
        const data = new Date(date);
        return new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(data);
    }

    static dateFormatedDayAndMonth(date: Date | string) {
        const currentYear = dayjs().year()
        const data = dayjs(date).year(currentYear).toDate();
        const formatter = new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            weekday: 'long',
            month: '2-digit',
            day: '2-digit',
        })

        const formatted = formatter.format(data);
        return formatted.toUpperCase();
    }

    static isDateInCurrentWeek(dateStr: string) {
        const date = new Date(dateStr);
        const now = new Date();

        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());

        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

        return date >= firstDayOfWeek && date <= lastDayOfWeek;
    }

    static isDateInCurrentMonth(dateStr: string) {
        const date = new Date(dateStr);
        const now = new Date();

        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    static isDateInLastMonth(dateStr: string) {
        const date = new Date(dateStr);
        const now = new Date();

        return date.getMonth() === now.getMonth() - 1 && date.getFullYear() === now.getFullYear();
    }

    static organizedToLastDate<T extends { date?: string | Date }>(a: T, b: T): number {
        const dateA = a.date ? dayjs(a.date).valueOf() : 0;
        const dateB = b.date ? dayjs(b.date).valueOf() : 0;
        return dateB - dateA;
    }

    static calculateAge(birthdate: Date, today: Date): number {
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

}