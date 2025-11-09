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
import { CredentialsProvider } from '@context/CredentialsContext';
import { PermissionProvider } from '@context/PermissionContext';
dayjs.locale('pt-br');

createRoot(document.getElementById('root')!).render(

    <React.StrictMode>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AuthProvider>
                <PermissionProvider>
                    <CredentialsProvider>
                        <ManagerProvider>
                            <StrictMode>
                                <AppRouter />
                            </StrictMode>
                        </ManagerProvider>
                    </CredentialsProvider>
                </PermissionProvider>
            </AuthProvider>
        </LocalizationProvider>
    </React.StrictMode>
)
