import BackButton from "@components/back-button/BackButton";
import { Audit } from "@domain/audit";
import { TimePeriod, WorshipType } from "@domain/enums";
import { ReportChurch } from "@domain/report";
import { Box, Button, Container, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { auditAdd } from "@service/AuditService";
import { findReportChurchToById, reportChurchAdd, reportUpdate } from "@service/ReportChurchService";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ReportChurchDetails() {
    const [report, setReport] = useState<ReportChurch>(new ReportChurch());
    const [worship, setWorship] = useState<WorshipType>(WorshipType.SUNDAY);
    const [timePeriod, setTimePeriod] = useState<TimePeriod>(TimePeriod.EVENING);
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const isEditOrNew = isEditing ? `Editar Relatório de Culto: ${report.worship}` : 'Novo Relatório de Culto';

    const { reportId } = useParams();
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

        if (isEditing) {
            const update = ReportChurch.fromJson(report);
            const audit = Audit.create(isEditOrNew, report.id);

            await reportUpdate(report.id, update.toJSON());
            await auditAdd(audit);
        } else {
            const audit = Audit.create(isEditOrNew, report.id);

            await reportChurchAdd(report);
            await auditAdd(audit)
            setReport(new ReportChurch());
        }

        navToReport();
    }

    useEffect(() => {
        async function load() {
            if (reportId) {
                const data = await findReportChurchToById(reportId);
                const load = ReportChurch.fromJson(data);
                setIsEditing(true);
                setReport(load)
                setWorship(load.worship)
                setTimePeriod(load.timePeriod)
            }
        }
        load();

    }, [reportId]);


    return (
        <>
            <BackButton path={'report'} />
            <Container className='details-container'>
                <form onSubmit={handleSubmit} className="details-form">
                    <h2>{isEditOrNew}</h2>
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
                    {worship === WorshipType.SUNDAY && (
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
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Salvar Relatório
                        </Button>
                    </Box>
                </form>
            </Container>
        </>
    )
}