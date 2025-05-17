export class DateUtil {

    static dateFormated(date: Date | string) {
        return new Date(date).toLocaleDateString("pt-BR")
    }
    
    static dateFormatedPtBr(date: Date | string) {
        const data = new Date(date);
        return new Intl.DateTimeFormat('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        }).format(data);
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
}