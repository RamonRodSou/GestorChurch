import './visitor-details.scss';
import { useContext, useEffect, useState } from "react";
import { Box, Button, Container, TextField } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import { useNavigate, useParams } from 'react-router-dom';
import { ManagerContext } from '@context/ManagerContext';
import { Visitor } from '@domain/user/visitor/Visitor';
import { findByVisitorId, updateVisitor, visitorAdd } from '@service/VisitorService';

export default function VisitorDetails() {
    const { visitorId, userId } = useParams();
    const navigate = useNavigate();
    const { setOpenSnackbar } = useContext(ManagerContext);
    const [data, setData] = useState<Visitor>(new Visitor());
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const isEditOrNew = isEditing ? `Editar visitante: ${data.name}` : 'Novo Visitante'

    const handleChange = (field: keyof Visitor, value: string | number) => {
        setData(prev => {
            const updated = { ...prev, [field]: value };
            return Visitor.fromJson(updated);
        });
    };

    const handleAddVisit = () => {
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


    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        const formatted = today.toLocaleDateString('pt-BR', options); // "domingo, 11/05/2025"

        const firstVisit = formatted.charAt(0).toUpperCase() + formatted.slice(1); // capitaliza

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
        async function loadClient() {
            if (visitorId) {
                const clientData = await findByVisitorId(visitorId);
                setData(Visitor.fromJson(clientData));
                setIsEditing(true);
            }
        }
        loadClient();
    }, [visitorId]);

    return (
        <>
            <BackButton path={'visitor'}/>
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>{isEditOrNew}</h2>
                    <Box mb={2}>
                        <TextField
                            label="Nome"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value)}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Telefone"
                            value={data.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
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
                        Salvar Cliente
                    </Button>
                </form>
            </Container>
        </>
    );
}
