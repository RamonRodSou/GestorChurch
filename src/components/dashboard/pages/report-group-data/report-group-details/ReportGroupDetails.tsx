import BackButton from "@components/back-button/BackButton";
import { WeekDays } from "@domain/enums";
import { GroupSummary } from "@domain/group";
import { ReportGroup } from "@domain/report";
import { ChildSummary, MemberSummary } from "@domain/user";
import { VisitorGroup } from "@domain/user/visitor/VisitorGroup";
import { Autocomplete, Box, Button, Container, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { findAllChildrens } from "@service/ChildrenService";
import { findAllGroups } from "@service/GroupService";
import { findAllMembers } from "@service/MemberService";
import { reportGroupAdd } from "@service/ReportGroupService";
import { findAllVisitorsGroup } from "@service/VisitorGroupService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ReportGroupDetails() {
    const [report, setReport] = useState<ReportGroup>(new ReportGroup());
    const [day, setDay] = useState<WeekDays>(WeekDays.THURSDAY);
    const [members, setMembers] = useState<MemberSummary[]>([]);
    const [childrens, setChildrens] = useState<ChildSummary[]>([]);
    const [visitors, setVisitors] = useState<VisitorGroup[]>([]);
    const [groups, setGroups] = useState<GroupSummary[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<GroupSummary | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<MemberSummary[]>([]);
    const [selectedChildrens, setSelectedChildrens] = useState<ChildSummary[]>([]);
    const [selectedVisitors, setSelectedVisitors] = useState<VisitorGroup[]>([]);

    const { userId } = useParams();
    const navigate = useNavigate();

    function handleChange(field: keyof ReportGroup, value: any) {
        setReport(prev => ReportGroup.fromJson({ ...prev, [field]: value }));
    };
    
    function navToReport() {
        navigate(`/dashboard/${userId}/home`, {
            state: { showSnackbar: true }
        }); 
    }

    async function fetchGroups(): Promise<void>  {
        const response = await findAllGroups(); 
        setGroups(response)
    };

    async function fetchMembers(): Promise<void>  {
        const response = await findAllMembers(); 
        setMembers(response)
    };

    async function fetchChildrens(): Promise<void>  {
        const response = await findAllChildrens(); 
        setChildrens(response)
    };

    async function fetchVisitors(): Promise<void>  {
        const response = await findAllVisitorsGroup();  
        setVisitors(response)
    };
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        report.weekDay = day;
        report.childrens = selectedChildrens;
        report.members = selectedMembers;
        report.visitors = selectedVisitors;
        
        await reportGroupAdd(report);
        setReport(new ReportGroup());
        navToReport();
    }

    useEffect(() => {
        async function load() {
            fetchGroups();
            fetchMembers();
            fetchChildrens();
            fetchVisitors();
        }
        load();
    }, []);

    return (
        <>
            <BackButton path={'report-group'} />
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>Novo Relatório do GC</h2>
                    <Box mb={2}>
                        <Autocomplete
                            value={selectedGroup} 
                            onChange={(_, newValue) => {
                                setReport(prev => {
                                    const update = { ...prev, groupId: newValue?.id ?? null };
                                    return ReportGroup.fromJson(update);
                                });
                                setSelectedGroup(newValue); 
                            }}
                            options={groups}
                            getOptionLabel={(option) => option.name}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="GC"
                                    fullWidth
                                    required
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
                            label="Dia da Semana"
                            value={day}
                            onChange={(e) => setDay(e.target.value as WeekDays)}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {Object.values(WeekDays).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="time"
                            label="Horário do GC: "
                            value={report.time}
                            onChange={(e) => 
                                handleChange("time", e.target.value)
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <DatePicker
                            label="Data do GC"
                              value={report.date ? dayjs(report.date) : null}
                                onChange={(date) => {
                                    handleChange("date", date?.toDate() ?? null);
                                }}
                            format="DD/MM/YYYY"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                },
                            }}                        
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Valor da Oferta: "
                            value={report.value ?? 0}
                            onChange={(e) => 
                                handleChange("value", (e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <Autocomplete
                            multiple
                            options={members}
                            getOptionLabel={(option) => option.name}
                            value={selectedMembers}
                            onChange={(_, newValue) => setSelectedMembers(newValue)}
                            renderInput={(params) => <TextField {...params} label="Selecione os Membros" />}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <Autocomplete
                            multiple
                            options={childrens}
                            getOptionLabel={(option) => option.name}
                            value={selectedChildrens}
                            onChange={(_, newValue) => setSelectedChildrens(newValue)}
                            renderInput={(params) => <TextField {...params} label="Selecione as Crianças" />}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                        />
                    </Box>
                    <Box mb={2}>
                        <Autocomplete
                            multiple
                            options={visitors}
                            getOptionLabel={(option) => option.name}
                            value={selectedVisitors}
                            onChange={(_, newValue) => setSelectedVisitors(newValue)}
                            renderInput={(params) => <TextField {...params} label="Selecione os Visitantes do GC" />}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
                        />
                    </Box> 
                    <Box mb={2}>
                        <TextField
                            type="text"
                            label="Observção: "
                            value={report.observation ?? null}
                            onChange={(e) => 
                                handleChange("observation", e.target.value.toUpperCase())
                            }
                            fullWidth
                        />
                    </Box>
                    <Box mt={3}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Salvar Relatório
                        </Button>
                    </Box>
                </form>
            </Container>      
        </>
    )
}