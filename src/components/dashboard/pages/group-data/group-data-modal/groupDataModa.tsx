import './group-data-modal.scss';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Group } from '@domain/group';

interface GroupDataModalProps {
    open: boolean;
    onClose: () => void;
    group: Group | null;
}

export default function GroupDataModal({ open, onClose, group }: GroupDataModalProps) {
    const navigate = useNavigate();
    const { userId } = useParams();

    if (!group) return null;

    function groupUpdate(groupId: String) {
        return navigate(`/dashboard/${userId}/edit-group/${groupId}`);
    }
         
    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent dividers className='dialog'>
                <Box className='title-and-editBtn'>
                    <Typography className='title'>{group.name}</Typography>
                    <IconButton onClick={() => groupUpdate(group.id)} className='editBtn'>
                        <Edit/>
                    </IconButton>
                </Box>
                <Typography className='subTitle'>Lideres: {group.leaders.map(it => it.name.split(" ")[0]).join(" / ")}</Typography>         
                <Typography className='textInfo'>Rua: {group.street}</Typography>
                <Typography className='textInfo'>N: {group.houseNumber}</Typography>
                <Typography className='textInfo'>Bairro: {group.neighborhood}</Typography>
                <Typography className='textInfo'>Cidade: {group.city}</Typography>
                <Typography className='textInfo'>Estado: {group.state}</Typography>
                <Typography className='textInfo'>CEP: {group.zipCode}</Typography>
                <h3>Membros:</h3>
                <Typography className='textInfo'>
                    {group.members.map(m => m.name.split(" ")[0]).join(" / ")}
                </Typography>
            </DialogContent>
        </Dialog>
    );
}
