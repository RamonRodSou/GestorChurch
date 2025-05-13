import '../member.scss';
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { Autocomplete, Box, Button, Container, TextField } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import { Member, MemberSummary } from '@domain/user';
import { findAllMembersSummary, findMemberToById, memberAdd, memberUpdate } from '@service/MemberService';
import { EMPTY } from "@domain/utils/string-utils";
import SnackBarMessage from "@components/snackBarMessage/SnackBarMessage";
import { CivilStatus, Role } from "@domain/enums";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Batism } from "@domain/batism";
import { ensureMemberSummary } from '@domain/utils/EnsuredMemberSummary';
import ICepData from '@domain/interface/ICepData';
import { validateMemberForm } from '@domain/utils/validateMemberForm';
import { findAllGroups } from '@service/GroupService';
import validateCEP from '@domain/utils/validateCEP';
import { checkCEP } from '@domain/utils/checkCEP';
import { useParams } from 'react-router-dom';
import { useCredentials } from '@context/CredentialsContext';

export default function MemberDetails() {
    const [member, setMember] = useState<Member>(new Member());
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [civilStatus, setCivilStatus] = useState<CivilStatus>(CivilStatus.SINGLE);
    const [role, setRole] = useState<Role>(Role.MEMBER);
    const [allMembers, setAllMembers] = useState<MemberSummary[]>([]);
    const [childrenInputs, setChildrenInputs] = useState<(MemberSummary | string)[]>([]);
    const [cepData, setCepData] = useState<ICepData | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const isEditOrNew = isEditing ? `Editar membro: ${member.name}` : 'Novo Membro'
    const { memberId } = useParams();
    const { clearCredentials } = useCredentials();

    const selectedGroup = groups.find(group => group.id === member.groupId) ?? null;

    function handleChange(field: keyof Member, value: any) {
        const parsedValue =
            field === "spouse"
                ? ensureMemberSummary(value)
                : value;

        setMember(prev => {
            const updated = { ...prev, [field]: parsedValue };
            return Member.fromJson(updated);
        });
    };

    function handleBatismChange(field: keyof Batism, value: any) {
        setMember((prev) => {
            const updatedBatism = { ...prev.batism, [field]: value };
            const updated = { ...prev, batism: updatedBatism };
            return Member.fromJson(updated);
        });
    };

    function handleAddChildField() {
        setChildrenInputs([...childrenInputs, EMPTY]);
    };

    function handleChildrenChange(index: number, value: MemberSummary | string) {
        const updated = [...childrenInputs];
        updated[index] = ensureMemberSummary(value);
        setChildrenInputs(updated);
        setMember(prev => {
            const updatedMember = { ...prev, children: updated };
            return Member.fromJson(updatedMember);
        });
    };

    function editOrNewMessage() {
        return isEditing 
            ? 'Membro atualizado com sucesso!'
            : 'Membro criado com sucesso!'
    }

    async function  fetchMembers(): Promise<void> {
        const response = await findAllMembersSummary();
        setAllMembers(response);
    };

    async function fetchGroups(): Promise<void>  {
        const response = await findAllGroups(); 
        setGroups(response)
    };

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault(); 
        if (!validateMemberForm({ member, setErrors })) return;

        if (isEditing) {
            await memberUpdate(member.id, member.toJSON());
            setOpenSnackbar(true);
        } else {
            const updatedMember = Member.fromJson({
                ...member,
                cepData,
                role,
                civilStatus,
            });

            await memberAdd(updatedMember);
            clearCredentials();

            setOpenSnackbar(true);
            setMember(new Member());
            setCepData(null);
            setCivilStatus(member.civilStatus);
            setRole(member.role);
            setChildrenInputs([]);
        }
    };

    useEffect(() => {
        async function load() {
            fetchGroups();
            fetchMembers();
            validateCEP({ cepData: cepData, setData: setMember });
            setCivilStatus(member.civilStatus);
            setRole(member.role);

            if (memberId) {
                const data = await findMemberToById(memberId);
                const loadedMember = Member.fromJson(data);
                setMember(Member.fromJson(data));
                setIsEditing(true);

                if (loadedMember.zipCode) {
                    checkCEP({ it: loadedMember.zipCode, setCepData });
                }
            }
        }
        load();
    }, [memberId, cepData]);

    return (
        <>
            <BackButton path={'member'}/>
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>{isEditOrNew}</h2>
                    <Box mb={2}> 
                        <TextField
                            label="Nome"
                            value={member.name}
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
                        <TextField
                            label="CPF"
                            type='number'
                            value={member.cpf}
                            onChange={(e) => 
                                handleChange("cpf", e.target.value)
                            }
                            error={!!errors.cpf}
                            helperText={errors.cpf}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <DatePicker
                            label="Data de nascimento"
                              value={member.birthdate ? dayjs(member.birthdate) : null}
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
                            value={member.phone}
                            onChange={(e) => 
                                handleChange("phone", e.target.value)
                            }
                            error={!!errors.phone}
                            helperText={errors.phone}      
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Email"
                            type="email"
                            value={member.email}
                            error={!!errors.email}
                            helperText={errors.email}                       
                            onChange={(e) => 
                                handleChange("email", e.target.value.toUpperCase())
                            }
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="CEP"
                            type='number'
                            onBlur={(e) => checkCEP({ it: e.target.value, setCepData })}
                            value={member.zipCode}
                            error={!!errors.zipCode}
                            helperText={errors.zipCode}  
                            onChange={(e) => 
                                handleChange("zipCode", e.target.value.toUpperCase())
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Rua"
                            value={cepData?.logradouro.toUpperCase()}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => 
                                handleChange("street", e.target.value.toUpperCase())
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Número"
                            type="number"
                            value={member.houseNumber ?? EMPTY}
                            error={!!errors.houseNumber}
                            helperText={errors.houseNumber}
                            onChange={(e) => 
                                handleChange("houseNumber", Number(e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Bairro"
                            value={cepData?.bairro.toUpperCase()}
                            InputLabelProps={{ shrink: true }}
                            onChange={(e) => 
                                handleChange("neighborhood", e.target.value.toUpperCase())
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Cidade"
                            value={cepData?.localidade.toUpperCase()}
                            onChange={(e) => 
                                handleChange("city", e.target.value.toUpperCase())
                            }
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Estado"
                            value={cepData?.uf.toUpperCase()}
                            onChange={(e) => 
                                handleChange("state", e.target.value.toUpperCase())
                            }
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <Autocomplete
                            value={selectedGroup} 
                            onChange={(_, newValue) => {
                                setMember(prev => {
                                    const updatedMember = { ...prev, groupId: newValue?.id ?? null };
                                    return Member.fromJson(updatedMember);
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
                            onChange={(e) => setRole(e.target.value as Role)}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {Object.values(Role).map((status) => (
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
                                value={member.batism.churchName}
                                onChange={(e) => 
                                    handleBatismChange("churchName", e.target.value.toUpperCase())
                                }
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <TextField
                                label="Nome do Lider que batizou"
                                value={member.batism?.leaderName}
                                onChange={(e) => 
                                    handleBatismChange("leaderName", e.target.value.toUpperCase())
                                }
                                fullWidth
                            />
                        </Box>
                        <Box mb={2}>
                            <DatePicker
                                label="Data do Batismo"
                                value={dayjs(member.batism.baptismDate)}
                                onChange={(date) =>
                                    handleBatismChange("baptismDate", date?.toDate() ?? new Date())
                                }
                                format="DD/MM/YYYY"
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Box>
                    </span>

                    <Box className="family">
                        <h3>Família</h3>
                        <Box mb={2}>
                            <TextField
                                select
                                label="Estado Civil"
                                value={civilStatus ?? member.civilStatus}
                                onChange={(e) => setCivilStatus(e.target.value as CivilStatus)}
                                fullWidth
                                SelectProps={{ native: true }}
                            >
                                {Object.values(CivilStatus).map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </TextField>
                        </Box>

                        {civilStatus === CivilStatus.MARRIED && (
                            <Box mb={2}>
                                <Autocomplete
                                    freeSolo
                                    value={member.spouse ?? null}
                                    onChange={(_, newValue) => {
                                        const spouse = ensureMemberSummary(newValue);
                                        handleChange("spouse", spouse);
                                    }}
                                    options={allMembers}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option : option.name
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Cônjuge"
                                            onChange={(e) => handleChange("spouse", e.target.value.toUpperCase())}
                                            fullWidth
                                            required
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    filterOptions={(x) => x}
                                    noOptionsText="Nenhum membro encontrado"
                                />
                            </Box>
                        )}
                        {childrenInputs.map((child, index) => (
                            <Box key={index} mb={2}>
                                <Autocomplete
                                    freeSolo
                                    value={child}
                                    onChange={(_, newValue) => handleChildrenChange(index, newValue ?? EMPTY)}
                                    options={allMembers}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option.toUpperCase() : option.name.toUpperCase()
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={`Filho ${index + 1}`}
                                            onChange={(e) => handleChildrenChange(index, e.target.value.toUpperCase())}
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
                            Adicionar Filho
                        </Button>

                    </Box>

                                        
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Salvar Cliente
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
