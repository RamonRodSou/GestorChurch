import { useDashboardNavigation } from '@hooks/useDashboardNavigation';
import './back-button.scss'
import { ArrowBack } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";

type props = {
    path?:  string;
}

export default function BackButton({path}: props) {
    const { goToDashboardPath } = useDashboardNavigation();    

    return (
        <Tooltip title="Click to back page" className='back-button' >
            <IconButton onClick={() => goToDashboardPath( path ?? 'home')}>
                <ArrowBack/>
            </IconButton>
        </Tooltip>
    )
}