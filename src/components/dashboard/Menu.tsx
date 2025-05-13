import { JSX } from "@emotion/react/jsx-runtime";
import {
    AccountCircle,
    Assessment,
    Settings,
    Group,
    Person2Outlined,
    Diversity3Outlined,
    StickyNote2Outlined,
  } from '@mui/icons-material';

export interface IMenu {
    path: string;
    label: string;
    icon: JSX.Element;
}


export const getMenuItems  = (permission: number | null): IMenu[] => {
    const items: IMenu[] = [
        {
            path: 'home',
            label: 'Início',
            icon: <AccountCircle/>
        },
        {
            path: 'visitor',
            label: 'Visitantes',
            icon: <Person2Outlined/>,
        },
        {
            path: 'member',
            label: 'Membros',
            icon: <Group/>,
        },
        {
            path: 'group',
            label: 'GC',
            icon: <Diversity3Outlined/>,
        }
    ];
    
    if (permission !== null && permission >= 8) {
        items.push({ path: 'financial', label: 'Finanças', icon: <Assessment /> });
    }

    items.push(
        { path: 'report', label: 'Relatório', icon: <StickyNote2Outlined /> },
        { path: 'preferences', label: 'Configurações', icon: <Settings /> }
    );

    return items;
}
