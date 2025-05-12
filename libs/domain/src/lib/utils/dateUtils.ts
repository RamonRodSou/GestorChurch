export function dateFormated(date: Date | string) {
    return new Date(date).toLocaleDateString("pt-BR")
}
