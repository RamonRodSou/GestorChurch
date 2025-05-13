import './visitor-data-modal.scss';
import { Dialog, DialogContent, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Visitor } from '@domain/user/visitor/Visitor';
import { whatzapp } from '@domain/utils/whatszappAPI';
import ModalBtns from '@components/modalBtns/ModalBtns';
import { useState } from 'react';
import { updateVisitor } from '@service/VisitorService';
import ConfirmModal from '@components/confirm-modal/ConfirmModal';

interface VisitorDataModalProps {
    open: boolean;
    onClose: () => void;
    visitor: Visitor | null;
}

export default function VisitorDataModal({ open, onClose, visitor }: VisitorDataModalProps) {
    const [openData, setOpenData] = useState(false);
    
    const navigate = useNavigate();
    const { userId } = useParams();

    if (!visitor) return null;

    function visitorUpdate(visitorId: String) {
        return navigate(`/dashboard/${userId}/edit-visitor/${visitorId}`);
    }

    async function remove (visitor: Visitor) {
        visitor.isActive = false;
        await updateVisitor(visitor.id, visitor);
        setOpenData(false);
        onClose();
    }

    return ( 
        <Dialog open={open} onClose={onClose}  fullWidth>
            <DialogContent dividers className='dialog'>
                <Typography className='title'>{visitor.name}</Typography>
                <ModalBtns
                    edit={() => visitorUpdate(visitor.id)} 
                    whatsApp={() => whatzapp(visitor.name, visitor.phone)}
                    remove={() => setOpenData(true)}
                />
                <Typography className='textInfo'> <span className='subTextInfo'>TELEFONE: </span>{visitor.phone}</Typography>
                
                <h3>Histórico de visitas:</h3>
                <ul className="visit-list">
                    {visitor.visitHistory.map((it, index) => (
                        <li className='textInfo' key={index}>{it}</li>
                    ))}
                </ul>
            </DialogContent>
            <ConfirmModal
                message={`Tem certeza que deseja remover o visitante ${visitor.name}`}
                open={openData}
                onConfirm={() => remove(visitor)}
                onClose={() => setOpenData(false)}
            />
        </Dialog>
    );
}
