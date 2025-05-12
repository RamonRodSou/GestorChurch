import './financial-modal.scss';
import { IncomeType } from '@domain/enums/IncomeType';
import { Dialog, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { EMPTY } from '@domain/utils/string-utils';
import { FinancialSummary } from '@domain/financial';

interface FinancialType {
    open: boolean;
    onClose: () => void;
    onConfirm: (financial: FinancialSummary) => void;
    incomeDefault: number;
    title?: string;
}

enum MoneyMovement {
    INCOME = "ENTRADA",
    EXPENSE = "SAÍDA"
}

export default function FinancialModal({ open, onClose, onConfirm, incomeDefault, title }: FinancialType) {
    const [income, setIncome] = useState(incomeDefault);
    const [type, setType] = useState<MoneyMovement>(MoneyMovement.INCOME);
    const [incomeType, setIncomeType] = useState<IncomeType | null>(null);
    const [expense, setExpense] = useState(0);
    const [expenseType, setExpenseType] = useState<string>(EMPTY);

    const message = title ?? 'Finalizar Ordem de Serviço';

    const handleConfirm = () => {
        const financial = new FinancialSummary(
            undefined,
            income,
            incomeType,
            expense,
            expenseType.toUpperCase()
        );
        onConfirm(financial);
        onClose();
    };
    
    useEffect(() => {
        setIncome(incomeDefault);
        setExpense(0);
    }, [incomeDefault, open]);

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

                {type == MoneyMovement.INCOME && (
                    <>
                        <TextField
                            className="input-field"
                            fullWidth
                            label="Valor recebido (R$)"
                            type="number"
                            value={income}
                            onChange={(e) => setIncome(parseFloat(e.target.value))}
                            margin="dense"
                        />
                        <TextField
                            select
                            label="Tipo de Entrada"
                            value={incomeType ?? null}
                            onChange={(e) => setIncomeType(e.target.value as IncomeType ?? null)}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {Object.values(IncomeType).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </TextField>
                    </>
                )}

                {type == MoneyMovement.EXPENSE && (
                    <>
                        <TextField
                            className="input-field"
                            fullWidth
                            label="Despesas (R$)"
                            type="number"
                            value={expense}
                            onChange={(e) => setExpense(parseFloat(e.target.value))}
                            margin="dense"
                        />
                        <TextField
                            className="input-field"
                            fullWidth
                            label="Tipo de saída"
                            value={expenseType}
                            onChange={(e) => setExpenseType(e.target.value)}
                            margin="dense"
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions className="dialog-actions">
                <Button className="btn-cancel" onClick={onClose}>Cancelar</Button>
                <Button className="btn-confirm" onClick={handleConfirm} variant="contained" color="primary">Confirmar</Button>
            </DialogActions>
        </Dialog>
    );
}
