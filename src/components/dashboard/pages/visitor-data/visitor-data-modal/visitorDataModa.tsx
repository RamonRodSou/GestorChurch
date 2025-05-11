import './visitor-data-modal.scss';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Visitor } from '@domain/user/visitor/Visitor';

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
         
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent dividers>
                <Box className='title-and-editBtn'>
                    <Typography className='title'>{visitor.name}</Typography>
                    <IconButton onClick={() => visitorUpdate(visitor.id)} className='editBtn'>
                        <Edit/>
                    </IconButton>
                </Box>
                <Typography>Telefone: {visitor.phone}</Typography>
                
                <h3>Histórico de visitas:</h3>
                <ul className="visit-list">
                    {visitor.visitHistory.map((it, index) => (
                        <li key={index} className="visit-item">{it}</li>
                    ))}
                </ul>
            </DialogContent>
        </Dialog>
    );
}
