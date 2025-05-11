import { JSX } from "@emotion/react/jsx-runtime";
import {
    AccountCircle,
    Assessment,
    Settings,
    Group,
    Person2Outlined,
    Diversity3Outlined,
  } from '@mui/icons-material';

interface IMenu {
    path: string;
    label: string;
    icon: JSX.Element;
}

export const menuItems: IMenu[] = [
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
        label: 'Grupo Familiar',
        icon: <Diversity3Outlined/>,
    },
    {
        path: 'financial',
        label: 'Finanças',
        icon: <Assessment/>
    },
    // {
    //     path: 'service-order',
    //     label: 'Ordens de Serviço',
    //     icon: <Assignment/>
    // },
    {
        path: 'preferences',
        label: 'Configurações',
        icon: <Settings/>
    }
];
