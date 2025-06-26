type ValidatorFn = (
    value: any,
    data: any
) => string | null


export type ValidationEntity<T> = {
    [K in keyof T]?: ValidatorFn[];
}

interface Props<T> {
    data: T;
    setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    entity: ValidationEntity<T>
}

export function ValidationForm<T>({ data, setErrors, entity }: Props<T>): boolean {
    const newErrors: { [key: string]: string } = {};

    for (const key in entity) {
        const validators = entity[key];
        const value = data[key];

        if (validators) {
            for (const validate of validators) {
                const error = validate(value, entity);
                if (error) {
                    newErrors[key] = error;
                    break;
                }
            }
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}

export function required(msg: string = "Campo obrigatório") {
    return (val: string) => !val ? msg : null;
}

export function minLength(length: number, msg?: string) {
    return (val: string) =>
        val?.length < length ? msg ?? `Mínimo de ${length} caracteres.` : null;
}

export function maxLength(length: number, msg?: string) {
    return (val: string) =>
        val?.length > length ? msg ?? `Máximo de ${length} caracteres.` : null;
}