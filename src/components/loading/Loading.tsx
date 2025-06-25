import { Box, Typography } from "@mui/material";
import "./loading.scss";

export default function Loading({ message = "Carregando..." }: { message?: string }) {
    return (
        <Box
            className="loading-container"
        >
            <div className="spinner" />
            <Typography mt={3} className="loading-text">
                {message}
            </Typography>
        </Box>
    );
}
