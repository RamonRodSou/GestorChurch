import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface BirthdayListProps<T> {
    title: string;
    data: T[];
    renderItem: (item: T) => ReactNode;
}

export default function BirthdayList<T>({ title, data, renderItem }: BirthdayListProps<T>) {
    if (data.length === 0) return null;

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h5" className="title-secondary">
                {title}
            </Typography>
            {data
                .sort((a, b) => Number((b as any).isActive) - Number((a as any).isActive))
                .map((item, index) => (
                    <Box key={(item as any).id ?? index} marginLeft={2}>
                        <Typography className="textInfo">
                            {renderItem(item)}
                        </Typography>
                    </Box>
                ))}
        </Box>
    );
}
