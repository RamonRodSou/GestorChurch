import { EMPTY } from '@domain/utils/string-utils';
import { createContext, useContext, useState, ReactNode } from 'react';

interface CredentialsContextProps {
    userId: string;
    role: string;
    setCredentials: (userId: string, role: string) => void;
    clearCredentials: () => void;
}

const CredentialsContext = createContext<CredentialsContextProps | undefined>(undefined);

export function CredentialsProvider({ children }: { children: ReactNode }) {
    const [userId, setUserId] = useState<string>(EMPTY);
    const [role, setRole] = useState<string>(EMPTY);

    function setCredentials(userId: string, role: string) {
        setUserId(userId);
        setRole(role);
    }

    function clearCredentials() {
        setUserId(EMPTY);
        setRole(EMPTY);
    }

    return (
        <CredentialsContext.Provider value={{ userId, role, setCredentials, clearCredentials }}>
            {children}
        </CredentialsContext.Provider>
    );
}

export function useCredentials() {
    const context = useContext(CredentialsContext);
    if (!context) {
        throw new Error('useCredentials deve ser usado dentro de um CredentialsProvider');
    }
    return context;
}
