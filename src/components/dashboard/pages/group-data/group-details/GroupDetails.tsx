import '../group.scss';
import { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Autocomplete } from "@mui/material";
import BackButton from '@components/back-button/BackButton';
import SnackBarMessage from "@components/snackBarMessage/SnackBarMessage";
import { MemberSummary } from '@domain/user';
import { findAllMembersSummary } from '@service/MemberService';
import { EMPTY } from "@domain/utils/string-utils";
import { ensureMemberSummary } from '@domain/utils/EnsuredMemberSummary';
import { Group } from '@domain/group/Group';
import { groupAdd } from '@service/GroupService';
import validateCEP from '@domain/utils/validateCEP';
import CepData from '@domain/interface/ICepData';
import { checkCEP } from '@domain/utils/checkCEP';
import { validateGroupForm } from '@domain/utils/validateGroupForm';

export default function GroupDetails() {
    const [group, setGroup] = useState<Group>(new Group());
    const [allMembers, setAllMembers] = useState<MemberSummary[]>([]);
    const [membersInputs, setMembersInputs] = useState<(MemberSummary | string)[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [cepData, setCepData] = useState<CepData | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    function handleChange(field: keyof Group, value: any) {
        setGroup(prev => Group.fromJson({ ...prev, [field]: value }));
    };

    function handleAddMemberField() {
        setMembersInputs([...membersInputs, EMPTY]);
    };

    function handleMemberChange(index: number, value: MemberSummary | string) {
        const updated = [...membersInputs];
        updated[index] = ensureMemberSummary(value);
        setMembersInputs(updated);
        setGroup(prev => {
            const updatedGroup = { ...prev, members: updated };
            return Group.fromJson(updatedGroup);
        });
    };

    async function fetchMembers() {
        const response = await findAllMembersSummary();
        setAllMembers(response);
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validateGroupForm({ group, setErrors })) return;
        const updatedGroup = Group.fromJson({ ...group });

        await groupAdd(updatedGroup);
        
        setOpenSnackbar(true);
        setGroup(new Group());
        setCepData(null);
        setMembersInputs([]);
    };

    useEffect(() => {
        fetchMembers();
        validateCEP({cepData: cepData, setData: setGroup})
    }, [cepData]);

    return (
        <>
            <BackButton path={'group'} />
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>Novo Grupo</h2>
                    <Box mb={2}>
                        <TextField
                            label="Nome do Grupo"
                            value={group.name}
                            onChange={(e) => 
                                handleChange("name", e.target.value.toUpperCase())
                            }
                            fullWidth
                            helperText={errors.name}
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <Autocomplete
                            multiple
                            value={group.leaders || []}
                            onChange={(_, newValue) => 
                                handleChange("leaders", newValue)}
                            options={allMembers}
                            getOptionLabel={(option) =>
                                typeof option === 'string' ? option : option.name
                            }
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Líderes do Grupo"
                                    fullWidth
                                    helperText={errors.leaderName}
                                />
                            )}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            noOptionsText="Nenhum membro encontrado"
                        />
                    </Box>

                    <Box mb={2}>
                        <TextField
                            label="CEP"
                            onBlur={(e) => checkCEP({ it: e.target.value, setCepData })}
                            helperText={errors.zipCode}
                            error={!!errors.zipCode}
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
                            value={cepData?.logradouro}
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
                            value={group.houseNumber ?? EMPTY}
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
                            value={cepData?.bairro}
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
                            value={cepData?.localidade}
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
                            value={cepData?.uf}
                            onChange={(e) => 
                                handleChange("state", e.target.value.toUpperCase())
                            }
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            required
                        />
                    </Box>                        
                    <h3>Membros do Grupo</h3>
                    {membersInputs.map((member, index) => (
                        <Box key={index} mb={2}>
                            <Autocomplete
                                freeSolo
                                value={member}
                                onChange={(_, newValue) => handleMemberChange(index, newValue ?? EMPTY)}
                                options={allMembers}
                                getOptionLabel={(option) =>
                                    typeof option === 'string' ? option : option.name
                                }
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={`Membro ${index + 1}`}
                                        onChange={(e) => 
                                            handleMemberChange(index, e.target.value.toUpperCase())
                                        }
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
                    <Button variant="outlined" onClick={handleAddMemberField}>
                        Adicionar Membro
                    </Button>

                    <Box mt={3}>
                        <Button type="submit" variant="contained" color="primary">
                            Salvar Grupo
                        </Button>
                    </Box>
                </form>
            </Container>
            <SnackBarMessage 
                message={"Grupo familiar criado com sucesso!"} 
                openSnackbar={openSnackbar} 
                setOpenSnackbar={setOpenSnackbar}
            />        
        </>
    );
}
