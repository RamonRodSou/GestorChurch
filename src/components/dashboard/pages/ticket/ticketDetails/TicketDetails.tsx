import { Guest } from "@domain/guest";
import { Lot } from "@domain/lot";
import { ticketValidate, ValidationForm } from "@domain/validate";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { findAllLots } from "@service/LotService";
import { ticketAdd } from "@service/ticketService";
import dayjs from "dayjs";
import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function TicketDetails() {
    const [form, setForm] = useState<Guest>(new Guest());
    const [quantity, setQuantity] = useState<number>(1);
    const [lots, setLots] = useState<Lot[]>([]);
    const [selectedLotId, setSelectedLotId] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const { userId } = useParams();
    const navigate = useNavigate();

    const handleChange = <K extends keyof Guest>(field: K, value: Guest[K]) => {
        setForm((prev) => ({ ...prev, [field]: value } as Guest));
    };

    function navToReport() {
        navigate(`/dashboard/${userId}/ticket`, {
            state: { showSnackbar: true }
        });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!ValidationForm({ data: form, setErrors, entity: ticketValidate() })) return;

        if (!quantity || quantity < 1 && !selectedLotId) return;

        try {
            setLoading(true);

            for (let i = 0; i < quantity; i++) {
                form.lotId = selectedLotId;
                await ticketAdd(form);
            }

            setForm(new Guest());
            setQuantity(1);
            navToReport();

        } catch (error) {
            console.error("Erro ao comprar ingressos:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        async function initLots() {
            const availableLots = await findAllLots();
            setLots(availableLots);

            const lot = availableLots
                .sort((a, b) => a.price - b.price)
                .filter((it) => it.isActive)[0].id;

            setSelectedLotId(lot);
        }
        initLots();
    }, []);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <form className="ticketForm" onSubmit={handleSubmit}>
                <Box marginBottom="1rem" component="div">
                    <TextField
                        label="Nome completo"
                        value={form?.name}
                        onChange={(it) => handleChange('name', it.target.value)}
                        error={!!errors.name}
                        helperText={errors.name}
                        fullWidth
                        required
                    />
                </Box>
                <Box marginBottom="1rem" component="div">
                    <TextField
                        label="Telefone"
                        value={form?.phone}
                        onChange={(it) => handleChange('phone', it.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        fullWidth
                        required
                    />
                </Box>
                <Box mb={2} className="dateNQuantity">
                    <DatePicker
                        className="date"
                        label="Data de nascimento"
                        value={form.birthdate ? dayjs(form.birthdate) : null}
                        onChange={(date) => {
                            handleChange("birthdate", date?.toDate() ?? null);
                        }}
                        format="DD/MM/YYYY"
                    />

                    <TextField
                        label="Quantidade de convites"
                        type="number"
                        value={quantity ?? 1}
                        onChange={(it) => setQuantity(Number(it.target.value))}
                        inputProps={{ min: 1 }}
                        error={!!errors.quantity}
                        helperText={errors.quantity}
                        fullWidth
                        required
                    />
                </Box>
                <Box marginBottom="1rem" component="div">

                    <TextField
                        select
                        label="Escolha o lote"
                        value={selectedLotId}
                        onChange={(e) => setSelectedLotId(e.target.value)}
                        fullWidth
                        required
                        SelectProps={{ native: true }}
                        margin="normal"
                    >
                        {lots
                            .filter(it => it.isActive && it.quantity > 0)
                            .sort((a, b) => a.price - b.price)
                            .map((lot) => (
                                <option key={lot.id} value={lot.id}>
                                    {lot.name} - R$ {lot.price} ({lot.quantity} disponíveis)
                                </option>
                            ))}
                    </TextField>
                </Box>

                <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Comprar"}
                </Button>
            </form>
        </LocalizationProvider>
    )
}
