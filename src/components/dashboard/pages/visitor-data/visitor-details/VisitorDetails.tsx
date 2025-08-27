import './visitor-details.scss';
import { useContext, useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import { useNavigate, useParams } from 'react-router-dom';
import { ManagerContext } from '@context/ManagerContext';
import { Visitor } from '@domain/user/visitor/Visitor';
import { findByVisitorId, updateVisitor, visitorAdd } from '@service/VisitorService';
import { ValidationForm } from '@domain/validate/validateForm';
import { formatVisitDate, visitorValidate } from '@domain/validate/validateEntities';
import { Audit } from '@domain/audit';
import { auditAdd } from '@service/AuditService';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
dayjs.locale('pt-br');

export default function VisitorDetails() {
    const { visitorId, userId } = useParams();
    const navigate = useNavigate();
    const { setOpenSnackbar } = useContext(ManagerContext);
    const [data, setData] = useState<Visitor>(new Visitor());
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());

    const isEditOrNew = isEditing ? `Editar visitante: ${data.name}` : 'Novo Visitante'

    function handleChange(field: keyof Visitor, value: string | number | string[]) {
        setData(prev => {
            const updated = { ...prev, [field]: value };
            return Visitor.fromJson(updated);
        });
    };

    function handleAddVisit() {
        if (!selectedDate) return;
        const dateString = formatVisitDate(selectedDate);

        setData(prev => {
            if (prev.visitHistory.includes(dateString)) return prev;
            const updatedHistory = [...prev.visitHistory, dateString];
            return Visitor.fromJson({ ...prev, visitHistory: updatedHistory });
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!ValidationForm({ data: data, setErrors, entity: visitorValidate() })) return;

        if (selectedDate) {
            const dateString = formatVisitDate(selectedDate);
            if (!data.visitHistory.includes(dateString)) {
                handleChange("visitHistory", [...data.visitHistory, dateString]);
            }
        }

        if (isEditing) {
            const audit = Audit.create(isEditOrNew, data.id);
            await updateVisitor(data.id, data.toJSON());
            await auditAdd(audit);
        } else {
            const newVisitor = new Visitor();
            newVisitor.name = data.name;
            newVisitor.phone = data.phone;
            newVisitor.visitHistory = data.visitHistory.length
                ? data.visitHistory
                : [formatVisitDate(selectedDate ?? dayjs())];

            const audit = Audit.create(isEditOrNew, data.id);

            await visitorAdd(newVisitor);
            await auditAdd(audit);

            setData(new Visitor());
        }

        navigate(`/dashboard/${userId}/visitor`);
        setOpenSnackbar(true);
    }

    useEffect(() => {
        if (visitorId) {
            async function load() {
                const visitorData = await findByVisitorId(String(visitorId));
                const visitor = Visitor.fromJson(visitorData);
                setData(visitor);
                const lastVisit = visitor.visitHistory.length
                    ? dayjs(visitor.visitHistory[visitor.visitHistory.length - 1], 'DD/MM/YYYY').locale('pt-br')
                    : dayjs().locale('pt-br');
                setSelectedDate(lastVisit);

                setIsEditing(true);
            }
            load();
        }
    }, [visitorId]);

    return (
        <>
            <BackButton path={'visitor'} />
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>{isEditOrNew}</h2>
                    <Box mb={2}>
                        <TextField
                            label="Nome"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value.toUpperCase())}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Telefone"
                            type='number'
                            value={data.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <DatePicker
                            label="Data de visita"
                            value={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            format="DD/MM/YYYY"
                        />
                    </Box>
                    {data.visitHistory.length > 0 && (
                        <Box mt={1}>
                            <h3>Histórico de Visitas</h3>
                            <ul>
                                {data.visitHistory.map((visit, index) => (
                                    <li className='visitDate' key={index}>{visit}</li>
                                ))}
                            </ul>
                        </Box>
                    )}
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => handleAddVisit()}
                        style={{ margin: '1rem 0' }}
                    >
                        Registrar nova visita
                    </Button>

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Salvar Visitante
                    </Button>
                </form>
            </Container>
        </>
    );
}
