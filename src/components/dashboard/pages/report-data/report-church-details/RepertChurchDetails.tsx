import BackButton from "@components/back-button/BackButton";
import { TimePeriod, WorshipType } from "@domain/enums";
import { ReportChurch } from "@domain/report";
import { Box, Button, Container, TextField } from "@mui/material";
import { reportChurchAdd } from "@service/ReportChurchService";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ReportChurchDetails() {
    const [report, setReport] = useState<ReportChurch>(new ReportChurch());
    const [worship, setWorship ] = useState<WorshipType>(WorshipType.SUNDAY_NIGHT);
    const [timePeriod, setTimePeriod ] = useState<TimePeriod>(TimePeriod.MORNING);

    const { userId } = useParams();
    const navigate = useNavigate();

    function handleChange(field: keyof ReportChurch, value: any) {
        setReport(prev => ReportChurch.fromJson({ ...prev, [field]: value }));
    };
    
    function navToReport() {
        navigate(`/dashboard/${userId}/report`, {
            state: { showSnackbar: true }
        });
    }
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        report.worship = worship;
        report.timePeriod = timePeriod;
        await reportChurchAdd(report);
        setReport(new ReportChurch());
        navToReport();
    }

    return (
        <>
            <BackButton path={'report'} />
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>Novo Relatório de Culto</h2>
                    <Box mb={2}>
                        <TextField
                            select
                            label="Tipo de Culto"
                            value={worship}
                            onChange={(e) => setWorship(e.target.value as WorshipType)}
                            fullWidth
                            SelectProps={{ native: true }}
                        >
                            {Object.values(WorshipType).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </TextField>
                    </Box>
                    {worship === WorshipType.SUNDAY_NIGHT && (
                    <Box mb={2}>
                        <TextField
                            select
                            label="Horario do Culto"
                            value={timePeriod}
                            onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
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
                    )}
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Quantidade de pessoas: "
                            value={report.totalPeople ?? 0}
                            onChange={(e) => 
                                handleChange("totalPeople", Number(e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Qtd de crianças: "
                            value={report.totalChildren ?? 0}
                            onChange={(e) => 
                                handleChange("totalChildren", Number(e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Qtd de voluntários: "
                            value={report.totalVolunteers ?? 0}
                            onChange={(e) => 
                                handleChange("totalVolunteers", Number(e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Qtd de pessoas aceitaram Jesus: "
                            value={report.decisionsForJesus ?? 0}
                            onChange={(e) => 
                                handleChange("decisionsForJesus", Number(e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Qtd nomes p/ batismo: "
                            value={report.baptismCandidates ?? 0}
                            onChange={(e) => 
                                handleChange("baptismCandidates", Number(e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Qtd de pessoas, pela primeira vez: "
                            value={report.firstTimeVisitors ?? 0}
                            onChange={(e) => 
                                handleChange("firstTimeVisitors", Number(e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Qtd de pessoas que voltaram: "
                            value={report.returningPeople ?? 0}
                            onChange={(e) => 
                                handleChange("returningPeople", Number(e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Qtd de pessoas novos membros: "
                            value={report.newMembers ?? 0}
                            onChange={(e) => 
                                handleChange("newMembers", Number(e.target.value))
                            }
                            fullWidth
                            required
                        />
                    </Box>
                    <Box mb={2}>
                        <TextField
                            type="number"
                            label="Qtd de pessoas que se batizaram no mês: "
                            value={report.peopleBaptizedThisMonth ?? 0}
                            onChange={(e) => 
                                handleChange("peopleBaptizedThisMonth", Number(e.target.value))
                            }
                            fullWidth
                            required
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
                        <Button type="submit" variant="contained" color="primary">
                            Salvar Relatório
                        </Button>
                    </Box>
                </form>
            </Container>      
        </>
    )
}