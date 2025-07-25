import './visitor-details.scss';
import { useContext, useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import { useNavigate, useParams } from 'react-router-dom';
import { ManagerContext } from '@context/ManagerContext';
import { Visitor } from '@domain/user/visitor/Visitor';
import { findByVisitorId, updateVisitor, visitorAdd } from '@service/VisitorService';
import { ValidationForm } from '@domain/validate/validateForm';
import { visitorValidate } from '@domain/validate/validateEntities';

export default function VisitorDetails() {
    const { visitorId, userId } = useParams();
    const navigate = useNavigate();
    const { setOpenSnackbar } = useContext(ManagerContext);
    const [data, setData] = useState<Visitor>(new Visitor());
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const isEditOrNew = isEditing ? `Editar visitante: ${data.name}` : 'Novo Visitante'

    function handleChange(field: keyof Visitor, value: string | number) {
        setData(prev => {
            const updated = { ...prev, [field]: value };
            return Visitor.fromJson(updated);
        });
    };

    function handleAddVisit() {
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        const formatted = today.toLocaleDateString('pt-BR', options);
        const capitalized = formatted.charAt(0).toUpperCase() + formatted.slice(1);

        setData(prev => {
            const updatedHistory = [...prev.visitHistory, capitalized];
            return Visitor.fromJson({ ...prev, visitHistory: updatedHistory });
        });
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!ValidationForm({ data: data, setErrors, entity: visitorValidate() })) return;

        if (isEditing) {
            await updateVisitor(data.id, data.toJSON());
        } else {
            const today = new Date();
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            };
            const formatted = today.toLocaleDateString('pt-BR', options);

            const firstVisit = formatted.charAt(0).toUpperCase() + formatted.slice(1);

            const newVisitor = new Visitor();
            newVisitor.name = data.name;
            newVisitor.phone = data.phone;
            newVisitor.visitHistory = [firstVisit];

            await visitorAdd(newVisitor);
            setData(new Visitor());
        }

        navigate(`/dashboard/${userId}/visitor`);
        setOpenSnackbar(true);
    };

    useEffect(() => {
        async function load() {
            if (visitorId) {
                const data = await findByVisitorId(visitorId);
                setData(Visitor.fromJson(data));
                setIsEditing(true);
            }
        }
        load();
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
