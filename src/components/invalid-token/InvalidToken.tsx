import './invalid.scss'
import { Box, Typography } from "@mui/material";

export default function InvalidToken() {
    return (
        <Box className="invalid-token-container">
            <Box className="invalid-token-box">
                <Typography className="invalid-token-title">Oops 😕</Typography>
                <Typography className="invalid-token-message">
                    Token inválido ou expirado. <br />
                    Solicite um novo convite ao administrador.
                </Typography>
            </Box>
        </Box>
    )
}