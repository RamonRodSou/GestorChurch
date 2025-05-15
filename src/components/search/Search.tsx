import { TextField } from "@mui/material";
import { EMPTY } from "@domain/utils/string-utils";
import { useEffect, useState } from "react";

type SearchProps<T> = {
    data: T[];
    onFilter: (filtered: T[]) => void;
    label: string;
    searchBy: (item: T, term: string) => boolean;
};

export default function Search<T>({ data, onFilter, label, searchBy }: SearchProps<T>) {
 
    const [searchTerm, setSearchTerm] = useState<string>(EMPTY);
    
    useEffect(() => {
        const filtered = data.filter((item) => searchBy(item, searchTerm));
        onFilter(filtered);
    }, [searchTerm, data]);

    return (
        <TextField
            className="search-input"
            variant="outlined"
            label={label}
            color='primary'
            fullWidth
            value={searchTerm.toUpperCase()}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginBottom: '1rem' }}
        />
    );
}
