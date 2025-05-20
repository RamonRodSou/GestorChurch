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

export default function VisitorGroupDetails() {
    const { visitorId, userId } = useParams();
    const navigate = useNavigate();
    const { setOpenSnackbar } = useContext(ManagerContext);
    const [data, setData] = useState<VisitorGroup>(new VisitorGroup());
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [groups, setGroups] = useState<GroupSummary[]>([]);

    const selectedGroup = groups.find(group => group.id === data.groupId) ?? null;

    const isEditOrNew = isEditing ? `Editar visitante: ${data.name}` : 'Novo Visitante'

    function handleChange(field: keyof VisitorGroup, value: string | number) {
        setData(prev => {
            const updated = { ...prev, [field]: value };
            return VisitorGroup.fromJson(updated);
        });
    }; 

    async function fetchGroups(): Promise<void>  {
        const response = await findAllGroupsSummary(); 
        setGroups(response)
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
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
            <BackButton path={'visitor'}/>
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>{isEditOrNew}</h2>
                    <Box mb={2}>
                        <TextField
                            label="Nome"
                            value={data.name}
                            onChange={(e) => handleChange("name", e.target.value.toUpperCase())}
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
                                    fullWidth
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value?.id} 
                            filterOptions={(x) => x}
                            noOptionsText="Nenhum grupo encontrado"
                        />
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Salvar Cliente
                    </Button>
                </form>
            </Container>
        </>
    );
}
