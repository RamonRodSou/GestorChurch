import BackButton from "@components/back-button/BackButton";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Autocomplete, Box, Button, Container, TextField } from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { ServiceSchedule } from "@domain/ServiceSchedule/ServiceSchedule";
import { Departament, TimePeriod, WeekDays } from "@domain/enums";
import { DatePicker } from "@mui/x-date-pickers";
import { ChildSummary, MemberSummary } from "@domain/user";
import { findAllMembers } from "@service/MemberService";
import { findAllChildrens } from "@service/ChildrenService";
import { scheduleAdd } from "@service/ScheduleService";

export default function ServiceScheduleDetails() {
    const navigate = useNavigate();

    const [data, setData] = useState<ServiceSchedule>(new ServiceSchedule());
    const [departament, setDepartament] = useState<Departament>(Departament.EMPTY);
    const [weekDay, setWeekDay] = useState<WeekDays>(WeekDays.SUNDAY);
    const [period, setPeriod] = useState<TimePeriod>(TimePeriod.EVENING);
    const [selectedLeader, setSelectedLeader] = useState<MemberSummary | null>(null);
    const [members, setMembers] = useState<MemberSummary[]>([]);
    const [childrens, setChildrens] = useState<ChildSummary[]>([]);
    const [selectedMembers, setSelectedMembers] = useState<MemberSummary[]>([]);
    const [selectedChildrens, setSelectedChildrens] = useState<ChildSummary[]>([]);

    const { userId} = useParams();

    function handleChange(field: keyof ServiceSchedule, value: any) {
        setData(prev => ServiceSchedule.fromJson({ ...prev, [field]: value }));
    };

    function navToServiceSchedule() {
        navigate(`/dashboard/${userId}/service-schedule`, {
            state: { showSnackbar: true }
        }); 
    }

    async function fetchMembers(): Promise<void>  {
        const response = await findAllMembers(); 
        setMembers(response)
    };

    async function fetchChildrens(): Promise<void>  {
        const response = await findAllChildrens(); 
        setChildrens(response)
    };

    async function handleSubmit(e: React.FormEvent): Promise<void> {
        e.preventDefault();

        data.departament = departament;
        data.weekDay = weekDay;
        data.leader = selectedLeader;
        data.timePeriod = period;
        data.childrens = selectedChildrens;
        data.members = selectedMembers;
        
        if(data.departament === Departament.EMPTY) return
                
        await scheduleAdd(data);

        setData(new ServiceSchedule());

        navToServiceSchedule();
    }
    
    useEffect(() => {
        async function load() {
            fetchMembers();
            fetchChildrens();
        }
        load();
    }, []); 
    
    return (
        <>
            <BackButton path={'service-schedule'}/>
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>Cadastrar Escala</h2>
                    <Box mb={2}>
                        <TextField
                            select
                            label="Departamento"
                            value={departament}
                            onChange={(e) => setDepartament(e.target.value as Departament)}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {Object.values(Departament).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                    <Box mb={2}>
                        <DatePicker
                            label="Data"
                              value={data.date ? dayjs(data.date) : null}
                                onChange={(it) => {
                                    handleChange("date", it?.toDate() ?? null);
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
                            select
                            label="Dia da Semana"
                            value={weekDay}
                            onChange={(e) => setWeekDay(e.target.value as WeekDays)}
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
                            select
                            label="Período"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value as TimePeriod)}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {Object.values(TimePeriod).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                    <Box mb={2}>
                        <Autocomplete
                            options={members}
                            getOptionLabel={(option) => option.name}
                            value={selectedLeader}
                            onChange={(_, newValue) => setSelectedLeader(newValue)}
                            renderInput={(params) => <TextField {...params} label="Selecione o Responsável" />}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            fullWidth
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
                        <TextField
                            label="Observação"
                            value={data.observation}
                            onChange={(e) => 
                                handleChange("observation", e.target.value.toUpperCase())
                            }
                            fullWidth
                            required
                        />
                    </Box>

                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Salvar usuário
                    </Button>
                </form>
            </Container>
        </>
    );
}
