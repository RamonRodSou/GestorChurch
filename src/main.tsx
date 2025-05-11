import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './reset.css';
import './index.css';
import AppRouter from './AppRouter';
import { AuthProvider } from './context/AuthContext';
import { ManagerProvider } from '@context/ManagerContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/pt-br';
import dayjs from 'dayjs';
dayjs.locale('pt-br');

createRoot(document.getElementById('root')!).render(
    
    <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AuthProvider>
                <ManagerProvider>
                    <StrictMode>
                        <AppRouter/>
                    </StrictMode>
                </ManagerProvider>
            </AuthProvider>
        </LocalizationProvider>
    </React.StrictMode>
)
