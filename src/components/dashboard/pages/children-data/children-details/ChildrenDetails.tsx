import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { Autocomplete, Box, Button, Container, TextField } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import { Child, MemberSummary } from '@domain/user';
import { EMPTY } from "@domain/utils/string-utils";
import SnackBarMessage from "@components/snackBarMessage/SnackBarMessage";
import { ChildRole, YesOrNot } from "@domain/enums";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Batism } from "@domain/batism";
import { ensureMemberSummary } from '@domain/utils/EnsuredSummary';
import { findAllGroups } from '@service/GroupService';
import { useNavigate, useParams } from 'react-router-dom';
import { useCredentials } from '@context/CredentialsContext';
import { findAllMembers } from "@service/MemberService";
import { childAdd, childUpdate, findChildToById } from "@service/ChildrenService";
import { AgeGroup } from "@domain/enums/AgeGroup";

export default function ChildDetails() {
    const [data, setData] = useState<Child>(new Child());    
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [role, setRole] = useState<ChildRole>(ChildRole.EMPTY);
    const [age, setAge] = useState<AgeGroup>(AgeGroup.CHILD);
    const [yesOrNot, setYesOrNot] = useState<YesOrNot>(YesOrNot.NOT);
    const [allParent, setAllParent] = useState<MemberSummary[]>([]);
    const [parentInputs, setParentInputs] = useState<(MemberSummary | string)[]>([]);
    const [errors, _] = useState<{ [key: string]: string }>({});
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const isEditOrNew = isEditing ? `Editar criança: ${data.name}` : 'Novo criança'
    const { childId } = useParams();
    const navigate = useNavigate();
    const { clearCredentials } = useCredentials();

    const selectedGroup = groups.find(group => group.id === data.groupId) ?? null;

    function navToChild() {
        navigate(`/dashboard/${childId}/children`, {
            state: { showSnackbar: true }
        }); 
    }

    function handleChange(field: keyof Child, value: any) {
        setData(prev => {
            data.ageGroup = age;
            const updated = { ...prev, [field]: value };
            return Child.fromJson(updated);
        });
    };

    function handleBatismChange(field: keyof Batism, value: any) {
        setData((prev) => {
            const updatedBatism = { ...prev.batism, [field]: value };
            const updated = { ...prev, batism: updatedBatism };
            return Child.fromJson(updated);
        });
    };

    function handleAddChildField() {
        setParentInputs([...parentInputs, EMPTY]);
    };

    function handleParentChange(index: number, value: MemberSummary | string) {
        const updated = [...parentInputs];
        updated[index] = ensureMemberSummary(value);
        const cleanedParents: MemberSummary[] = updated.map(ensureMemberSummary); 
        setParentInputs(cleanedParents);

        setData(prev => {
            const update = { ...prev, parents: cleanedParents };
            return Child.fromJson(update);
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
        const base = {
            ...data,
            role,
            age,
            parent: parentInputs
        };

        if (isEditing) {
            const update = Child.fromJson(base);
            await childUpdate(data.id, update.toJSON());       
        } else {
            const newChild = Child.fromJson(base);
            console.log(newChild)
            newChild.ageGroup = age;
            await childAdd(newChild); 
            clearCredentials();
            setOpenSnackbar(true);
            setData(new Child());
            setParentInputs([]);
        }
        navToChild();
    }

    useEffect(() => {
        async function load() {
            fetchGroups();
            fetchMembers();
            setRole(data.role);
            setAge(data.ageGroup);

            if (childId) {
                const base = await findChildToById(childId);
                const loadedChildren = Child.fromJson(base);
                setData(Child.fromJson(base));
                setIsEditing(true);
                setRole(loadedChildren.role);
                setAge(loadedChildren.ageGroup)
                setParentInputs(loadedChildren.parents ?? []);
            }
        }
        load();
    }, [childId]);
    
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
                            select
                            label="Faixa etária"
                            value={age}
                            onChange={(e) => setAge(e.target.value as AgeGroup)}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {Object.values(AgeGroup).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                    {age !== AgeGroup.CHILD && (
                        <>
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
                                            return Child.fromJson(updatedchildren);
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
                                    filterOptions={(options, state) => {
                                        return options.filter(option =>
                                            option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                                        );
                                    }}  
                                    noOptionsText="Nenhum grupo encontrado"
                                />
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    select
                                    label="Cargo"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as ChildRole)}
                                    fullWidth
                                    SelectProps={{ native: true }}
                                >
                                    {Object.values(ChildRole).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </TextField>
                            </Box>
                            <Box mb={2}>
                                <TextField
                                    select
                                    label="É Batizado?"
                                    value={yesOrNot}
                                    onChange={(e) => setYesOrNot(e.target.value as YesOrNot)}
                                    fullWidth
                                    SelectProps={{ native: true }}
                                >
                                    {Object.values(YesOrNot).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </TextField>
                            </Box>

                            {yesOrNot == YesOrNot.YES &&(
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
                            )}
                        </>
                    )}
                    <Box mb={2}>
                        <TextField
                            select
                            label="Autoriza o uso de imagem?"
                            value={yesOrNot === YesOrNot.YES ? "true" : "false"}
                            onChange={(e) => 
                                handleChange("isImageAuthorized", e.target.value)
                            }                            
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {Object.values(YesOrNot).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Usa alguma medicação? Qual?"
                            value={data.medication}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => 
                                handleChange("medication", e.target.value.toUpperCase())
                            }
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Alguma necessidade especial? Qual?"
                            InputLabelProps={{ shrink: true }}
                            value={data.specialNeed}
                            onChange={(e) => 
                                handleChange("specialNeed", e.target.value.toUpperCase())
                            }
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Alguma alergia? Qual?"
                            InputLabelProps={{ shrink: true }}
                            value={data.allergy}
                            onChange={(e) => 
                                handleChange("allergy", e.target.value.toUpperCase())
                            }
                            fullWidth
                        />
                    </Box>
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
                                    filterOptions={(options, state) => {
                                        return options.filter(option =>
                                            option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                                        );
                                    }}  
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
