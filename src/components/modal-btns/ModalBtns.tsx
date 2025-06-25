import { Delete, Edit, WhatsApp } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";

interface Props {
    edit: () => void;
    whatsApp: () => void;
    remove: () => void;
}

export default function ModalBtns({edit, whatsApp, remove}: Props) {
    return (
        <Box className='modalBtns'>
            <Box className='title-and-editBtn'>
                <IconButton onClick={edit} className='editBtn'>
                    <Edit/>
                </IconButton>
            </Box>                
            <Box className='whatzapp'>
                <IconButton onClick={whatsApp} className='whatzappBtn'>
                    <WhatsApp/>
                </IconButton>     
            </Box>
            <Box className='delete'>
                <IconButton onClick={remove} className='deleteBtn'>
                    <Delete/>
                </IconButton>     
            </Box>
        </Box>
)

}