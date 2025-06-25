import { Box, TextField } from "@mui/material"
import { ChangeEvent } from "react";

interface Props<T> {
    label: string;
    value: T;
    enumObject: Record<string, T>;
    onchange: (value: T) => void;
}

export default function InputSelect <T extends string>({label, value, enumObject, onchange}: Props<T>) {

    function handleChange(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        onchange(e.target.value as T);
    }

    return (
        <Box mb={2}>
            <TextField
                select
                label={label}
                value={value}
                onChange={handleChange}
                fullWidth
                SelectProps={{ native: true }}
            >
                {Object.values(enumObject).map((it) => (
                    <option key={it} value={it}>
                        {it}
                    </option>
                ))}
            </TextField>
        </Box>
    )
}