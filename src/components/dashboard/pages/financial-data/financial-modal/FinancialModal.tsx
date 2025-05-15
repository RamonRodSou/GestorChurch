import './financial-modal.scss';
import { IncomeType } from '@domain/enums/IncomeType';
import { Dialog, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { EMPTY } from '@domain/utils/string-utils';
import { Financial } from '@domain/financial';
import { MoneyMovement } from '@domain/enums';

interface FinancialType {
    open: boolean;
    onClose: () => void;
    onConfirm: (financial: Financial) => void;
    title?: string;
}

export default function FinancialModal({ open, onClose, onConfirm, title }: FinancialType) {
    const [value, setValue] = useState(0);
    const [type, setType] = useState<MoneyMovement>(MoneyMovement.INCOME);
    const [description, setDescription] = useState<string>(EMPTY);

    const message = title ?? 'Finalizar Ordem de Serviço';

    function handleConfirm() {
        const financial = new Financial(
            undefined,
            type,
            value,
            type === MoneyMovement.INCOME ? description as IncomeType : description.toUpperCase()
        );
        onConfirm(financial);
        onClose();
    };

    useEffect(() => {
        setValue(0);
        setDescription(EMPTY);
    }, [type, open]);

    return (
        <Dialog className='dialog-box' open={open} onClose={onClose}>
            <div className='dialog-header'>
                <Typography className='dialog-title'>{message}</Typography>
            </div>
            <DialogContent className="dialog-content">

                <TextField
                    select
                    label="Tipo de Movimentação"
                    value={type}
                    onChange={(e) => setType(e.target.value as MoneyMovement)}
                    fullWidth
                    SelectProps={{ native: true }}

                >
                    {Object.values(MoneyMovement).map((status) => (
                        <option key={status} value={status}>
                            {status}
                        </option>
                    ))}
                </TextField>
                <TextField
                    label="Valor (R$)"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(parseFloat(e.target.value))}
                />

                {type === MoneyMovement.INCOME ? (
                    <TextField
                        select
                        label="Tipo de Entrada"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        SelectProps={{ native: true }}
                    >
                        {Object.values(IncomeType).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </TextField>
                ) : (
                    <TextField
                        label="Descrição da Saída"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                    />
                )}

            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button className="btn-cancel" onClick={onClose}>Cancelar</Button>
                <Button className="btn-confirm" onClick={handleConfirm} variant="contained" color="primary">Confirmar</Button>
            </DialogActions>
        </Dialog>
    );
}
