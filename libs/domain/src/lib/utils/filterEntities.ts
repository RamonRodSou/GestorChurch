import { rowsPerPage } from "./string-utils"

interface Props<T> {
    entity: T[]
    page: number
}

export function activeFilter<T extends { isActive: boolean }>(entity: T[]): T[] {
    return entity.filter(it => it.isActive)
}

export function filterAndPaginate<T>({ entity, page }: Props<T>): T[] {
    return entity
        .slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage
        )
}