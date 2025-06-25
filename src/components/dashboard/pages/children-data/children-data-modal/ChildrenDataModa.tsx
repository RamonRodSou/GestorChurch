import { Dialog, DialogContent, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Child } from '@domain/user';
import { GroupSummary } from '@domain/group';
import ModalBtns from '@components/modal-btns/ModalBtns';
import ConfirmModal from '@components/confirm-modal/ConfirmModal';
import { useState } from 'react';
import { DateUtil, NOT_REGISTER, sendWhatsappMessage, whatAppMessageChild } from '@domain/utils';
import { childUpdate } from '@service/ChildrenService';
import { YesOrNot } from '@domain/enums';

interface ChildrenDataModalProps {
    open: boolean;
    onClose: () => void;
    children: Child | null;
    groupData?: GroupSummary | null;
}

export default function ChildrenDataModal({ open, onClose, children, groupData }: ChildrenDataModalProps) {
    const [openData, setOpenData] = useState(false);
    const navigate = useNavigate();
    const { userId } = useParams();
    const group: string = groupData ? groupData?.name : NOT_REGISTER;
    const parent = children?.parents.map(m => m?.name.split(' ')[0]).join(' / ');
    const phone: string = children?.phone ? children.phone : `RESPONÁVEL - ${children?.parents.map((it) => it.phone).join(' / ')}`;
    const email: string = children?.email || NOT_REGISTER;
    const IsAuthorized = children?.isImageAuthorized === true ? YesOrNot.YES : YesOrNot.NOT;
    const medication = children?.medication || NOT_REGISTER;
    const allergy = children?.allergy || NOT_REGISTER;
    const specialNeed = children?.specialNeed || NOT_REGISTER;

    if (!children) return null;

    async function editChildren(childrenId: String) {
        return await navigate(`/dashboard/${userId}/edit-children/${childrenId}`);
    }

    async function remove(children: Child) {
        children.isActive = false;
        await childUpdate(children.id, children);
        setOpenData(false);
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent dividers className='dialog'>
                <Typography className='title'>{children.name}</Typography>
                <ModalBtns
                    edit={() => editChildren(children.id)}
                    whatsApp={() => sendWhatsappMessage(children.name, children?.phone ?? children.parents.at(0), whatAppMessageChild)}
                    remove={() => setOpenData(true)}
                />
                <Typography className='textInfo'> <span className='subTextInfo'>TA AUTORIZADA A IMAGEM ? </span>{IsAuthorized}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>NASCIMENTO: </span>{DateUtil.dateFormated(children.birthdate)}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>FAIXA ETÁRIA: </span>{children.ageGroup}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>TELEFONE: </span>{phone}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>
                    RESPONSÁVEL: </span>{parent}
                </Typography>
                {children.batism && (
                    <Typography className='textInfo'> <span className='subTextInfo'>BATISMO: </span>{DateUtil.dateFormated(children.batism.baptismDate)}</Typography>
                )}
                <Typography className='textInfo'> <span className='subTextInfo'>GC: </span>{group}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>STATUS: </span>{children.role}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>EMAIL: </span>{email}</Typography>

                <Typography className='textInfo'> <span className='subTextInfo'>USA ALGUMA MEDICAÇÃO: </span>{medication}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>TEM ALGUMA ALERGIA: </span>{allergy}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>ALGUMA NECESSIDADE ESPECIAL: </span>{specialNeed}</Typography>
            </DialogContent>
            <ConfirmModal
                message={`Tem certeza que deseja remover o membro ${children.name}`}
                open={openData}
                onConfirm={() => remove(children)}
                onClose={() => setOpenData(false)}
            />
        </Dialog>
    );
}
