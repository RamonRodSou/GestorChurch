import './visitor-group-details.scss';
import { useContext, useEffect, useState } from "react";
import { Autocomplete, Box, Button, Container, TextField } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import { useNavigate, useParams } from 'react-router-dom';
import { ManagerContext } from '@context/ManagerContext';
import { findByVisitorGroupId, visitorGroupAdd } from '@service/VisitorGroupService';
import { VisitorGroup } from '@domain/user/visitor/VisitorGroup';
import { GroupSummary } from '@domain/group';
import { findAllGroupsSummary } from '@service/GroupService';
import { ValidationForm, visitorGroupValidate } from '@domain/validate';

export default function VisitorGroupDetails() {
    const { visitorId, userId } = useParams();
    const navigate = useNavigate();
    const { setOpenSnackbar } = useContext(ManagerContext);
    const [data, setData] = useState<VisitorGroup>(new VisitorGroup());
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [groups, setGroups] = useState<GroupSummary[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const selectedGroup = groups.find(group => group.id === data.groupId) ?? null;

    const isEditOrNew = isEditing ? `Editar visitante: ${data.name}` : 'Novo Visitante'

    function handleChange(field: keyof VisitorGroup, value: string | number) {
        setData(prev => {
            const updated = { ...prev, [field]: value };
            return VisitorGroup.fromJson(updated);
        });
    };

    async function fetchGroups(): Promise<void> {
        const response = await findAllGroupsSummary();
        setGroups(response)
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!ValidationForm({ data: data, setErrors, entity: visitorGroupValidate() })) return;
        await visitorGroupAdd(data);

        setData(new VisitorGroup());
        navigate(`/dashboard/${userId}/visitor-group`);
        setOpenSnackbar(true);
    };

    useEffect(() => {
        async function load() {
            fetchGroups();
            if (visitorId) {
                const data = await findByVisitorGroupId(visitorId);
                setData(VisitorGroup.fromJson(data));
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
                    <Box mb={2}>
                        <Autocomplete
                            value={selectedGroup}
                            onChange={(_, newValue) => {
                                setData(prev => {
                                    const update = { ...prev, groupId: newValue?.id ?? null };
                                    return VisitorGroup.fromJson(update);
                                });
                            }}
                            options={groups}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="GC"
                                    error={!!errors.groupId}
                                    helperText={errors.groupId}
                                    fullWidth
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value?.id}
                            filterOptions={(options, state) => {
                                return options.filter(option =>
                                    option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                                );
                            }}
                            noOptionsText="Nenhum grupo encontrado"
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Salvar Visitante
                    </Button>
                </form>
            </Container>
        </>
    );
}
