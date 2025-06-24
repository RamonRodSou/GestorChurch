import { rowsPerPage } from "./string-utils"

interface Props<T> {
    data: T[]
    page: number
}

export function paginatedActive<T extends { isActive: boolean }>(data: T[]): T[] {
    return data.filter(it => it.isActive)
}

export function filterAndPaginate<T>({ data, page }: Props<T>): T[] {
    return data
        .slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        )
}