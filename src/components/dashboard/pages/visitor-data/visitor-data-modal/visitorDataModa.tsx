import './visitor-data-modal.scss';
import { Dialog, DialogContent, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { Visitor } from '@domain/user/visitor/Visitor';
import { whatzapp } from '@domain/utils/whatszappAPI';
import ModalBtns from '@components/modalBtns/ModalBtns';

interface VisitorDataModalProps {
    open: boolean;
    onClose: () => void;
    visitor: Visitor | null;
}

export default function VisitorDataModal({ open, onClose, visitor }: VisitorDataModalProps) {
    const navigate = useNavigate();
    const { userId } = useParams();

    if (!visitor) return null;

    function visitorUpdate(visitorId: String) {
        return navigate(`/dashboard/${userId}/edit-visitor/${visitorId}`);
    }

    function remove () {
        console.log('removido')
    }
         
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent dividers>
                <Typography className='title'>{visitor.name}</Typography>
                <ModalBtns
                    edit={() => visitorUpdate(visitor.id)} 
                    whatsApp={() => whatzapp(visitor.name, visitor.phone)}
                    remove={() => remove()}
                />
                <Typography className='textInfo'> <span className='subTextInfo'>TELEFONE: </span>{visitor.phone}</Typography>
                
                <h3>Histórico de visitas:</h3>
                <ul className="visit-list">
                    {visitor.visitHistory.map((it, index) => (
                        <li className='textInfo' key={index}>{it}</li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}
