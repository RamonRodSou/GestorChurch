import '../member.scss';
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { Autocomplete, Box, Button, Container, TextField } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import { Member, MemberSummary } from '@domain/user';
import { findAllMembersSummary, memberAdd } from '@service/MemberService';
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
    
    const handleChange = (field: keyof Member, value: string | number | MemberSummary) => {
        const parsedValue =
            field === "spouse"
                ? ensureMemberSummary(value)
                : value;

        setMember(prev => {
            const updated = { ...prev, [field]: parsedValue };
            return Member.fromJson(updated);
        });
    };

    const handleBatismChange = (field: keyof Batism, value: string | Date | boolean) => {
        setMember((prev) => {
            const updatedBatism = { ...prev.batism, [field]: value };
            const updated = { ...prev, batism: updatedBatism };
            return Member.fromJson(updated);
        });
    };

    const handleAddChildField = () => {
        setChildrenInputs([...childrenInputs, EMPTY]);
    };

    const handleChildrenChange = (index: number, value: MemberSummary | string) => {
        const updated = [...childrenInputs];
        updated[index] = ensureMemberSummary(value);
        setChildrenInputs(updated);
        setMember(prev => {
            const updatedMember = { ...prev, children: updated };
            return Member.fromJson(updatedMember);
        });
    };

    const fetchMembers = async () => {
        const response = await findAllMembersSummary();
        setAllMembers(response);
    };

    const fetchGroups = async () => {
        const response = await findAllGroups(); 
        setGroups(response)
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();    
        if (!validateMemberForm({ member, setErrors })) return;
        const updatedMember = Member.fromJson({
            ...member,
        });

        await memberAdd(updatedMember);
        setOpenSnackbar(true);
        setMember(new Member());
        setCepData(null);
        setCivilStatus(CivilStatus.SINGLE);
        setChildrenInputs([]);
    };

    useEffect(() => {
        fetchGroups();
        fetchMembers();
        validateCEP({cepData: cepData, setData: setMember})
    }, [cepData]);

    return (
        <>
            <BackButton path={'member'}/>
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>Novo Membro</h2>
                    <Box mb={2}> 
                        <TextField
                            label="Nome"
                            value={member.name}
                            onChange={(e) => 
                                handleChange("name", e.target.value.toUpperCase())
                            }
                            error={!!errors.name}
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="Telefone"
                            value={member.phone}
                            onChange={(e) => 
                                handleChange("phone", e.target.value)
                            }
                            error={!!errors.phone}
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
                            onChange={(e) => 
                                handleChange("email", e.target.value.toUpperCase())
                            }
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            label="CEP"
                            onBlur={(it) => checkCEP({ it, setCepData })}
                            value={member.zipCode}
                            error={!!errors.zipCode}
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
                            error={!!errors.zipCode}
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
                            error={!!errors.neighborhood}
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
                            error={!!errors.city}
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
                            value={groups.find(group => group.id === member.groupId) ?? null} 
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
                                value={civilStatus}
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
                    message={"Cliente criado com sucesso!"} 
                    openSnackbar={openSnackbar} 
                    setOpenSnackbar={setOpenSnackbar}
                />
            </Container>
        </>
    );
}
