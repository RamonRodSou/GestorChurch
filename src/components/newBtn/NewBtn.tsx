import './newBtn.scss';
import { Add } from "@mui/icons-material"
import { Container, IconButton, Tooltip } from "@mui/material"

interface Props {
    navTo: () => void;  
}

export default function NewBtn({navTo}: Props) {
    return (
        <Container className='data-container'>
            <Tooltip className='data-button' title="Click to new member">
                <IconButton onClick={navTo}>
                    <Add/>
                </IconButton>
            </Tooltip>
        </Container>
    )
}