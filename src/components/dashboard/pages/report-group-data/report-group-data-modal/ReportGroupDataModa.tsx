import './report-group-data-modal.scss';
import { Dialog, DialogContent, Typography } from '@mui/material';
import ConfirmModal from '@components/confirm-modal/ConfirmModal';
import { useState } from 'react';
import { ReportGroup } from '@domain/report';
import { reportGroupUpdate } from '@service/ReportGroupService';
import { GroupSummary } from '@domain/group';

interface ReportGroupDataModalProps {
    open: boolean;
    onClose: () => void;
    report: ReportGroup | null;
    groupData?: GroupSummary | null; 
}

export default function ReportGroupDataModal({ open, onClose, report, groupData }: ReportGroupDataModalProps) {
    const [openData, setOpenData] = useState<boolean>(false);
    const leaders = groupData?.leaders.map(it => it?.name.split(' ')[0]).join(' / ');
    const members = report?.members.map(it => it?.name.split(' ')[0]).join(' / ');
    const childrens = report?.childrens.map(it => it?.name.split(' ')[0]).join(' / ');
    const visitors = report?.visitors.map(it => it?.name.split(' ')[0]).join(' / ');
    const group: string = groupData ? groupData?.name : 'SEM GC';

    const observation = report?.observation 
        ? report.observation
        : 'NENHUMA OBSERVAÇÃO';

    if (!report) return null;     

    async function remove (report: ReportGroup) {
        report.isActive = false;
        await reportGroupUpdate(report.id, report);
        setOpenData(false);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent dividers className='dialog'>
                    <Typography className='title'> <span className='subTextInfo'></span>{group}</Typography>
            <Typography className='textInfo'> <span className='subTextInfo'>DIA: </span>{leaders}</Typography>
                    <Typography className='textInfo'> <span className='subTextInfo'>DIA: </span>{report.weekDay}</Typography>
                    <Typography className='textInfo'> <span className='subTextInfo'>HORÁRIO: </span>{report.time}</Typography>
                    <Typography className='textInfo'> <span className='subTextInfo'>OFERTA: </span>R$ {report.value}</Typography>
                    <Typography className='textInfo'> <span className='subTextInfo'>MEMBROS: </span>{members}</Typography>
                    <Typography className='textInfo'> <span className='subTextInfo'>VISITANTES: </span>{visitors}</Typography>
                    <Typography className='textInfo'> <span className='subTextInfo'>CRIANÇAS: </span>{childrens}</Typography>
                    <Typography className='textInfo'> <span className='subTextInfo'>OBSERVAÇÃO: </span>{observation}</Typography>
            </DialogContent>
            <ConfirmModal
                message={`Tem certeza que deseja remover O relatório`}
                open={openData}
                onConfirm={() => remove(report)}
                onClose={() => setOpenData(false)}
            />
        </Dialog>
    );
}
 