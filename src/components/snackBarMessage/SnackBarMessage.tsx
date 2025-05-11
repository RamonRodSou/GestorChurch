import { Snackbar, SnackbarCloseReason } from "@mui/material";

type snackBarType = {
    openSnackbar: boolean;
    setOpenSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
    message: string | (() => string); 
}

export default function SnackBarMessage({openSnackbar, setOpenSnackbar, message}: snackBarType) {
    const resolvedMessage = typeof message === 'function' ? message() : message;

    const handleClose = (
        _: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') return;
        setOpenSnackbar(false);
    };
        
    return (
        <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleClose}
            message={resolvedMessage}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            sx={{ '& .MuiSnackbarContent-root': { justifyContent: 'center' } }}
    />
    )
}