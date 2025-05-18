import NewBtn from '@components/newBtn/NewBtn';
import SnackBarMessage from "@components/snackBarMessage/SnackBarMessage";
import { ManagerContext } from "@context/ManagerContext";
import { Box, Container, Typography } from "@mui/material";
import { ReactNode, useContext } from "react";
import { useNavigate, useParams } from 'react-router-dom';

interface Data {
    title: string;
    message: string;
    path: string;
    children: ReactNode
}

export default function Layout({title, message, path, children}: Data) {
    const { openSnackbar, setOpenSnackbar } = useContext(ManagerContext);
    const { userId } = useParams();
    const navigate = useNavigate();

    function navToNewForm() {
        return navigate(`/dashboard/${userId}/${path}`);
    }
    
    return (
        <Container>
            <Box mb={3}>
                <Typography variant="h4" component="h1" className='title'>
                    {title}
                </Typography>
            </Box>
            <main>
                {children}
            </main>
            <NewBtn navTo={() => navToNewForm()}/>
            <SnackBarMessage 
                message={message} 
                openSnackbar={openSnackbar} 
                setOpenSnackbar={setOpenSnackbar}
            />
        </Container>
    )
} 