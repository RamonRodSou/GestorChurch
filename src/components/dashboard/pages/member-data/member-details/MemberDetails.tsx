import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { Autocomplete, Box, Button, Container, TextField } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import { ChildSummary, Member, MemberSummary } from '@domain/user';
import { findMemberToById, memberAdd, memberUpdate } from '@service/MemberService';
import { EMPTY } from "@domain/utils/string-utils";
import SnackBarMessage from "@components/snack-bar-message/SnackBarMessage";
import { CivilStatus, Role, YesOrNot } from "@domain/enums";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Batism } from "@domain/batism";
import { ensureChildSummary, ensureMemberSummary } from '@domain/utils/EnsuredSummary';
import ICepData from '@domain/interface/ICepData';
import { checkCEP } from '@domain/utils/checkCEP';
import { useNavigate, useParams } from 'react-router-dom';
import { useCredentials } from '@context/CredentialsContext';
import { GroupSummary } from "@domain/group";
import { fetchChildrensSummary, fetchGroupsSummary, fetchMembersSummary } from "@domain/utils/fetch";
import InputSelect from "@components/input-select/inputSelect";
import { activeFilter, Validate } from "@domain/utils";
import { ValidationForm } from "@domain/validate/validateForm";
import { memberValidate } from "@domain/validate/validateEntities";
import { auditAdd } from "@service/AuditService";
import { Audit } from "@domain/audit";

export default function MemberDetails() {
    const [member, setMember] = useState<Member>(new Member());
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [civilStatus, setCivilStatus] = useState<CivilStatus>(CivilStatus.SINGLE);
    const [role, setRole] = useState<Role>(Role.MEMBER);
    const [allMembers, setAllMembers] = useState<MemberSummary[]>([]);
    const [allChidrens, setAllChildrens] = useState<ChildSummary[]>([]);
    const [childrenInputs, setChildrenInputs] = useState<(ChildSummary | string)[]>([]);
    const [cepData, setCepData] = useState<ICepData | null>(null);
    const [yesOrNot, setYesOrNot] = useState<YesOrNot>(YesOrNot.YES);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [groups, setGroups] = useState<GroupSummary[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const isEditOrNew = isEditing ? `Editar membro: ${member.name}` : 'Novo Membro';

    const activeMembers = activeFilter(allMembers);
    const activeChildrens = activeFilter(allChidrens);
    const activeGroups = activeFilter(groups);

    const { memberId } = useParams();
    const { userId } = useParams();
    const { clearCredentials } = useCredentials();
    const navigate = useNavigate();

    function navToGroup() {
        navigate(`/dashboard/${userId}/member`, {
            state: { showSnackbar: true }
        });
    }

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

    function handleRemoveChildField(index: number) {
        setChildrenInputs(childrenInputs.filter((_, i) => i !== index));
    };

    function handleChildrenChange(index: number, value: ChildSummary | string) {
        const updated = [...childrenInputs];
        updated[index] = ensureChildSummary(value);
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
    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();
        if (!ValidationForm({ data: member, setErrors, entity: memberValidate() })) return;

        const isImageAuthorized = yesOrNot === YesOrNot.YES ? true : false;

        const base = {
            ...member,
            cepData,
            role,
            isImageAuthorized,
            civilStatus,
            children: childrenInputs
        };

        if (isEditing) {
            const updatedMember = Member.fromJson(base);
            const audit = Audit.create(editOrNewMessage(), base.id);
            await memberUpdate(member.id, updatedMember.toJSON());
            await auditAdd(audit)
        } else {
            const newMember = Member.fromJson(base);
            await memberAdd(newMember);

            clearCredentials();
            setOpenSnackbar(true);
            setMember(new Member());
            setCepData(null);
            setChildrenInputs([]);
        }
        navToGroup()
    }

    useEffect(() => {
        async function load() {
            fetchGroupsSummary(setGroups);
            fetchMembersSummary(setAllMembers);
            fetchChildrensSummary(setAllChildrens);
            setCivilStatus(member.civilStatus);
            setRole(member.role);

            if (memberId) {
                const data = await findMemberToById(memberId);
                const loadedMember = Member.fromJson(data);
                setMember(Member.fromJson(data));
                setIsEditing(true);
                setCivilStatus(loadedMember.civilStatus);
                setRole(loadedMember.role);
                setChildrenInputs(loadedMember.children ?? []);
                setYesOrNot(member.isImageAuthorized === true ? YesOrNot.YES : YesOrNot.NOT)

                if (loadedMember.zipCode) {
                    checkCEP({ it: loadedMember.zipCode, setCepData });
                }
            }
        }
        load();
    }, [memberId]);

    useEffect(() => {
        if (cepData) {
            Validate.CEP({ cepData, setData: setMember, data: Member })
        }
    }, [cepData]);

    return (
        <>
            <BackButton path={'member'} />
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
                                    error: !!errors.birthdate,
                                    helperText: errors.birthdate,
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
                                handleChange("zipCode", e.target.value)
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
                            value={member.houseNumber ?? EMPTY}
                            error={!!errors.houseNumber}
                            helperText={errors.houseNumber}
                            onChange={(e) =>
                                handleChange("houseNumber", e.target.value.toUpperCase())
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
                            options={activeGroups}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="GC"
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
                    <InputSelect
                        label="Cargo"
                        value={role}
                        enumObject={Role}
                        onchange={setRole}
                    />
                    <InputSelect
                        label="Autoriza o uso de imagem?"
                        value={yesOrNot}
                        enumObject={YesOrNot}
                        onchange={(value) => setYesOrNot(value)}
                    />
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
                                value={member.batism.baptismDate ? dayjs(member.batism.baptismDate) : null}
                                onChange={(date) =>
                                    handleBatismChange("baptismDate", date?.toDate() ?? new Date())

                                }
                                format="DD/MM/YYYY"
                                slotProps={{ textField: { fullWidth: true } }}
                            />
                        </Box>
                    </span>

                    <Box mb={2}>
                        <h3>Família</h3>
                        <InputSelect
                            label="Estado Civil"
                            value={civilStatus ?? member.civilStatus}
                            enumObject={CivilStatus}
                            onchange={setCivilStatus}
                        />

                        {civilStatus === CivilStatus.MARRIED && (
                            <Box mb={2}>
                                <Autocomplete
                                    freeSolo
                                    value={member.spouse ?? null}
                                    onChange={(_, newValue) => {
                                        const spouse = ensureMemberSummary(newValue);
                                        handleChange("spouse", spouse);
                                    }}
                                    options={activeMembers}
                                    getOptionLabel={(option) =>
                                        typeof option === 'string' ? option : option.name
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Cônjuge"
                                            onChange={(e) => handleChange("spouse", e.target.value.toUpperCase())}
                                            fullWidth
                                        />
                                    )}
                                    isOptionEqualToValue={(option, value) => option.id === value.id}
                                    filterOptions={(options, state) => {
                                        return options.filter(option =>
                                            option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                                        );
                                    }}
                                    noOptionsText="Nenhum membro encontrado"
                                />
                            </Box>
                        )}
                        {childrenInputs.map((child, index) => (
                            <Box key={index} className='boxAutoComplete'>
                                <Autocomplete
                                    className='autoComplete'
                                    freeSolo
                                    value={child}
                                    onChange={(_, newValue) => handleChildrenChange(index, newValue ?? EMPTY)}
                                    options={activeChildrens}
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
                                    filterOptions={(options, state) => {
                                        return options.filter(option =>
                                            option.name.toLowerCase().includes(state.inputValue.toLowerCase())
                                        );
                                    }}
                                    noOptionsText="Nenhum membro encontrado"
                                />
                                <Button
                                    variant="outlined"
                                    onClick={() => handleRemoveChildField(index)}
                                    color="secondary"
                                    style={{ marginLeft: '10px' }}
                                >
                                    X
                                </Button>
                            </Box>
                        ))}
                        <Button variant="outlined" onClick={handleAddChildField}>
                            Adicionar Filho
                        </Button>
                    </Box>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Salvar Membro
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
