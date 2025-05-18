import './report-church-data-modal.scss';
import { Dialog, DialogContent, Typography } from '@mui/material';
import ConfirmModal from '@components/confirm-modal/ConfirmModal';
import { useState } from 'react';
import { ReportChurch } from '@domain/report';
import { reportUpdate } from '@service/ReportChurchService';

interface ReportChurchDataModalProps {
    open: boolean;
    onClose: () => void;
    report: ReportChurch | null;
    groupData?: ReportChurch | null; 
}

export default function ReportChurchDataModal({ open, onClose, report }: ReportChurchDataModalProps) {
  const [openData, setOpenData] = useState(false);
    {/*  
    const navigate = useNavigate();
    const { userId } = useParams();
*/}  
    if (!report) return null;     

   {/* async function editreport(reportId: String) {
        return await navigate(`/dashboard/${userId}/edit-report/${reportId}`);
    } */}  

    async function remove (report: ReportChurch) {
        report.isActive = false;
        await reportUpdate(report.id, report);
        setOpenData(false);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent dividers className='dialog'>
                <Typography className='title'>{report.worship + report?.timePeriod}</Typography>
                {/*<ModalBtns
                    edit={() => editreport(report.id)} 
                    whatsApp={() => whatzapp(report.name, report.phone)}
                    remove={() => setOpenData(true)}
                />   */}             
                <Typography className='textInfo'> <span className='subTextInfo'>DATA: </span>{report.createdAt}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>TOTAL DE PESSOA: </span>{report.totalPeople}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>TOAL DE CRIANÇÃS: </span>{report.totalChildren}</Typography> 
                <Typography className='textInfo'> <span className='subTextInfo'>TOAL DE VOLUNTÁRIOS: </span>{report.totalVolunteers}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>ACEITARAM JESUS: </span>{report.decisionsForJesus}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>DERAM NOME PRO BATISMO: </span>{report.baptismCandidates}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>TOTAL DE PRIMEIRA VISITA: </span>{report.firstTimeVisitors}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>VISITARAM NOVAMENTE: </span>{report.returningPeople}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>TOTAL DE NOVO MEMBRO: </span>{report.newMembers}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>OBSERVAÇÃO: </span>{report.observation}</Typography>
            </DialogContent>
            <ConfirmModal
                message={`Tem certeza que deseja remover O relatório de ${report.worship}`}
                open={openData}
                onConfirm={() => remove(report)}
                onClose={() => setOpenData(false)}
            />
        </Dialog>
    );
}
 