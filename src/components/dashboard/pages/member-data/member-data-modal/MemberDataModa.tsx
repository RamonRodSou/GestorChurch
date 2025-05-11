import './member-data-modal.scss';
import { Box, Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import { Edit, WhatsApp } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { Member } from '@domain/user';
import { whatzapp } from '@domain/utils/whatszappAPI';
import { GroupSummary } from '@domain/group';

interface MemberDataModalProps {
    open: boolean;
    onClose: () => void;
    member: Member | null;
    groupData: GroupSummary | null; 
}

export default function MemberDataModal({ open, onClose, member, groupData }: MemberDataModalProps) {
    const navigate = useNavigate();
    const { userId } = useParams();

    if (!member || !groupData) return null;     

    function memberUpdate(memberId: String) {
        return navigate(`/dashboard/${userId}/edit-member/${memberId}`);
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth>
            <DialogContent dividers>
                <Box className='title-and-editBtn'>
                    <Typography className='title'>{member.name}</Typography>
                    <IconButton onClick={() => memberUpdate(member.id)} className='editBtn'>
                        <Edit/>
                    </IconButton>
                </Box>                
                <Box className='whatzapp'>
                    <IconButton onClick={() => whatzapp(member.name, member.phone)} className='whatzappBtn'>
                        <WhatsApp/>
                    </IconButton>     
                </Box>
                <Typography className='textInfo'> <span className='subTextInfo'>TELEFONE: </span>{member.phone}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>GC: </span>{groupData.name}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>RUA: </span>{member.street}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>N: </span>{member.houseNumber}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>BAIRRO: </span>{member.neighborhood}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>CIDADE: </span>{member.city}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>ESTADO: </span>{member.state}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>CEP: </span>{member.zipCode}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>BATISMO: </span>{member.batism.baptismDate.toLocaleString()}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>ESTADO CIVIL: </span>{member.civilStatus}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>CÔNJUGUE: </span>{member.spouse?.name}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>
                    FILHO(S): </span>{member.children.map(m => m.name.split(" ")[0]).join(" / ")}
                </Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>STATUS: </span>{member.role}</Typography>
                <Typography className='textInfo'> <span className='subTextInfo'>EMAIL: </span>{member.email}</Typography>
            </DialogContent>
        </Dialog>
    );
}
