import { createContext, useEffect, useState, ReactNode } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AdminSummary } from '@domain/user';
import { findAdminToById } from '@service/AdminService';

type PermissionContextType = {
    permission: number | null;
    setPermission: (value: number | null) => void;
    adminData: AdminSummary | null;
};

export const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
    const [permission, setPermission] = useState<number | null>(null);
    const [adminData, setAdminData] = useState<AdminSummary | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(getAuth(), async (user) => {
            if (user?.uid) {
            try {
                const data = await findAdminToById(user.uid);
                setAdminData(data);
                setPermission(typeof data?.permission === 'number' ? data.permission : null);
            } catch (error) {
                console.error('Erro ao buscar dados do admin:', error);
            }
            } else {
            setPermission(null);
            setAdminData(null);
            }
        });

        return () => unsubscribe();;
    }, []);

    return (
        <PermissionContext.Provider value={{ permission, setPermission, adminData }}>
            {children}
        </PermissionContext.Provider>
    );
}
