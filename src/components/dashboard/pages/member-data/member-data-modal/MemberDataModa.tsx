import { Dialog, DialogContent, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Member } from '@domain/user';
import { whatzapp } from '@domain/utils/whatszappAPI';
import { GroupSummary } from '@domain/group';
import ModalBtns from '@components/modalBtns/ModalBtns';
import { memberUpdate } from '@service/MemberService';
import ConfirmModal from '@components/confirm-modal/ConfirmModal';
import { useState } from 'react';
import { DateUtil } from '@domain/utils';

interface MemberDataModalProps {
    open: boolean;
    onClose: () => void;
    member: Member | null;
    groupData?: GroupSummary | null; 
}

export default function MemberDataModal({ open, onClose, member, groupData }: MemberDataModalProps) {
    const [openData, setOpenData] = useState(false);
    const navigate = useNavigate();
    const { userId } = useParams();
    const group: string = groupData ? groupData?.name : 'SEM GC';
    const children = member?.children.map(m => m?.name.split(' ')[0]).join(' / ');

    if (!member) return null;     

    async function editMember(memberId: String) {
        return await navigate(`/dashboard/${userId}/edit-member/${memberId}`);
    }

    async function remove (member: Member) {
        member.isActive = false;
        await memberUpdate(member.id, member);
        setOpenData(false);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent dividers className='dialog'>
                <Typography className='title'>{member.name}</Typography>
                <ModalBtns
                    edit={() => editMember(member.id)} 
                    whatsApp={() => whatzapp(member.name, member.phone)}
                    remove={() => setOpenData(true)}
                />                
                <Typography className='textInfo'> <span className='subTextInfo'>Nascimento: </span>{DateUtil.dateFormated(member.birthdate)}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>TELEFONE: </span>{member.phone}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>GC: </span>{group}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>RUA: </span>{member.street}</Typography> 
                <Typography className='textInfo'> <span className='subTextInfo'>N: </span>{member.houseNumber}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>BAIRRO: </span>{member.neighborhood}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>CIDADE: </span>{member.city}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>ESTADO: </span>{member.state}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>CEP: </span>{member.zipCode}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>BATISMO: </span>{DateUtil.dateFormated(member.batism.baptismDate)}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>ESTADO CIVIL: </span>{member.civilStatus}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>CÔNJUGUE: </span>{member.spouse?.name}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>
                    FILHO(S): </span>{children}
                </Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>STATUS: </span>{member.role}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>EMAIL: </span>{member.email}</Typography>
            </DialogContent>
            <ConfirmModal
                message={`Tem certeza que deseja remover o membro ${member.name}`}
                open={openData}
                onConfirm={() => remove(member)}
                onClose={() => setOpenData(false)}
            />
        </Dialog>
    );
}
 