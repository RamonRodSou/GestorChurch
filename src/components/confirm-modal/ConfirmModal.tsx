import { Dialog, DialogActions, Button, Typography } from '@mui/material';
import { useEffect } from 'react';

type ConfirmModal = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void; 
    message: string;
}

export default function ConfirmModal({ open, onClose, onConfirm, message }: ConfirmModal) {

    useEffect(() => {
    }, [open]);

    return (
        <Dialog className='dialog-box' open={open} onClose={onClose}>
            <div className='dialog-header'>
                <Typography className='dialog-title'>{message}</Typography>
            </div>
            <DialogActions className="dialog-actions">
                <Button className="btn-cancel" onClick={onClose}>Cancelar</Button>
                <Button className="btn-confirm" onClick={(onConfirm)} variant="contained" color="primary">Confirmar</Button>
            </DialogActions>
        </Dialog>
    );
}
