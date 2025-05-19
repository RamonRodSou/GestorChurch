import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { Autocomplete, Box, Button, Container, TextField } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import { Children, MemberSummary } from '@domain/user';
import { EMPTY } from "@domain/utils/string-utils";
import SnackBarMessage from "@components/snackBarMessage/SnackBarMessage";
import { ChildrenRole } from "@domain/enums";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Batism } from "@domain/batism";
import { ensureMemberSummary } from '@domain/utils/EnsuredSummary';
import { findAllGroups } from '@service/GroupService';
import { useNavigate, useParams } from 'react-router-dom';
import { useCredentials } from '@context/CredentialsContext';
import { childrenAdd, childrenUpdate, findChildrenToById } from "@service/ChildrenService";
import { findAllMembers } from "@service/MemberService";

export default function ChildrenDetails() {
    const [data, setData] = useState<Children>(new Children());
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [role, setRole] = useState<ChildrenRole>(ChildrenRole.EMPTY);
    const [allParent, setAllParent] = useState<MemberSummary[]>([]);
    const [parentInputs, setParentInputs] = useState<(MemberSummary | string)[]>([]);
    const [errors, _] = useState<{ [key: string]: string }>({});
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const isEditOrNew = isEditing ? `Editar criança: ${data.name}` : 'Novo criança'
    const { userId } = useParams();
    const navigate = useNavigate();
    const { clearCredentials } = useCredentials();

    const selectedGroup = groups.find(group => group.id === data.groupId) ?? null;

    function navToChildren() {
        navigate(`/dashboard/${userId}/children`, {
            state: { showSnackbar: true }
        }); 
    }

    function handleChange(field: keyof Children, value: any) {
        setData(prev => {
            const updated = { ...prev, [field]: value };
            return Children.fromJson(updated);
        });
    };

    function handleBatismChange(field: keyof Batism, value: any) {
        setData((prev) => {
            const updatedBatism = { ...prev.batism, [field]: value };
            const updated = { ...prev, batism: updatedBatism };
            return Children.fromJson(updated);
        });
    };

    function handleAddChildField() {
        setParentInputs([...parentInputs, EMPTY]);
    };

    function handleParentChange(index: number, value: MemberSummary | string) {
        const updated = [...parentInputs];
        updated[index] = ensureMemberSummary(value);
        setParentInputs(updated);
        setData(prev => {
            const update = { ...prev, children: updated };
            return Children.fromJson(update);
        });
    };

    function editOrNewMessage() {
        return isEditing 
            ? 'Criança atualizada com sucesso!'
            : 'Criança criada com sucesso!'
    }

    async function  fetchMembers(): Promise<void> {
        const response = await findAllMembers();
        setAllParent(response);
    };

    async function fetchGroups(): Promise<void>  {
        const response = await findAllGroups(); 
        setGroups(response)
    };

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        // if (!validateMemberForm({ data, setErrors })) return;

        const base = {
            ...data,
            role,
            parent: parentInputs
        };

        if (isEditing) {
            const update = Children.fromJson(base);
            await childrenUpdate(data.id, update.toJSON());
        } else {
            const newChildren = Children.fromJson(base);
            await childrenAdd(newChildren);
            clearCredentials();
            setOpenSnackbar(true);
            setData(new Children());
            setParentInputs([]);
        }
        navToChildren();
    }

    useEffect(() => {
        async function load() {
            fetchGroups();
            fetchMembers();
            setRole(data.role);

            if (userId) {
                const data = await findChildrenToById(userId);
                const loadedChildren = Children.fromJson(data);
                setData(Children.fromJson(data));
                setIsEditing(true);
                setRole(loadedChildren.role);
                setParentInputs(loadedChildren.parent ?? []);
            }
        }
        load();
    }, [userId]);
    
    return (
        <>
            <BackButton path={'children'}/>
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>{isEditOrNew}</h2>
                    <Box mb={2}> 
                        <TextField
                            label="Nome"
                            value={data.name}
                            onChange={(e) => 
                                handleChange("name", e.target.value.toUpperCase())
                            }
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <DatePicker
                            label="Data de nascimento"
                              value={data.birthdate ? dayjs(data.birthdate) : null}
                                onChange={(date) => {
                                    handleChange("birthdate", date?.toDate() ?? null);
                                }}
                            format="DD/MM/YYYY"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    error: !!errors.birthDate,
                                    helperText: errors.birthDate,
                                },
                            }}                        
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Telefone"
                            type='number'
                            value={data.phone}
                            onChange={(e) => 
                                handleChange("phone", e.target.value)
                            }
                            error={!!errors.phone}
                            helperText={errors.phone}      
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Email"
                            type="email"
                            value={data.email}
                            // error={!!errors.email}
                            helperText={errors.email}                       
                            onChange={(e) => 
                                handleChange("email", e.target.value.toUpperCase())
                            }
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <Autocomplete
                            value={selectedGroup} 
                            onChange={(_, newValue) => {
                                setData(prev => {
                                    const updatedchildren = { ...prev, groupId: newValue?.id ?? null };
                                    return Children.fromJson(updatedchildren);
                                });
                            }}
                            options={groups}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Grupo Familiar"
                                    fullWidth
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value?.id} 
                            filterOptions={(x) => x}
                            noOptionsText="Nenhum grupo encontrado"
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            select
                            label="Cargo"
                            value={role}
                            onChange={(e) => setRole(e.target.value as ChildrenRole)}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {Object.values(ChildrenRole).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                    <span>
                        <h3>Batismo</h3>
                        <Box mb={2}>
                            <TextField
                                label="Nome da Igreja"
                                value={data.batism?.churchName}
                                onChange={(e) => 
                                    handleBatismChange("churchName", e.target.value.toUpperCase())
                                }
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                label="Nome do Lider que batizou"
                                value={data.batism?.leaderName}
                                onChange={(e) => 
                                    handleBatismChange("leaderName", e.target.value.toUpperCase())
                                }
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <DatePicker
                                label="Data do Batismo"
                                value={data.batism?.baptismDate ? dayjs(data.batism?.baptismDate) : null}
                                onChange={(date) =>
                                    handleBatismChange("baptismDate", date?.toDate() ?? null)
                                    
                                }
                                format="DD/MM/YYYY"
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Box>
                    </span>

                    <Box mb={2}>
                        <h3>Família</h3>

                        {parentInputs.map((child, index) => (
                            <Box key={index} mb={2}>
                                <Autocomplete
                                    freeSolo
                                    value={child}
                                    onChange={(_, newValue) => handleParentChange(index, newValue ?? EMPTY)}
                                    options={allParent}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option.toUpperCase() : option.name.toUpperCase()
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={`Responsável ${index + 1}`}
                                            onChange={(e) => handleParentChange(index, e.target.value.toUpperCase())}
                                            fullWidth
                                            required
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) =>
                                        typeof option === "string" || typeof value === "string"
                                            ? false
                                            : option.id === value.id
                                    }
                                    filterOptions={(x) => x}
                                    noOptionsText="Nenhum membro encontrado"
                                />
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={handleAddChildField}>
                            Adicionar Responsável
                        </Button>
                    </Box>      
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Salvar Criança
                    </Button>
                </form>
                <SnackBarMessage 
                    message={editOrNewMessage()} 
                    openSnackbar={openSnackbar} 
                    setOpenSnackbar={setOpenSnackbar}
                />
            </Container>
        </>
    );
}
