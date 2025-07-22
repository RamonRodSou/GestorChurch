import { PermissionLevel } from "@domain/enums/PermissionLevel";
import { JSX } from "@emotion/react/jsx-runtime";
import {
    Assessment,
    Settings,
    Group,
    Person2Outlined,
    Diversity3Outlined,
    StickyNote2Outlined,
    ChildCare,
    StickyNote2TwoTone,
    Person2Rounded,
    Home,
    AssignmentInd,
    CalendarMonthRounded,
} from '@mui/icons-material';

export interface IMenu {
    path: string;
    label: string;
    icon: JSX.Element;
    visible: boolean;
}

export function getMenuItems(permission: number | null): IMenu[] {
    const level = permission ?? 0;

    const items: IMenu[] = [
        { path: 'home', label: 'Início', icon: <Home />, visible: level >= PermissionLevel.VOLUNTARIO },
        { path: 'visitor', label: 'Visitantes', icon: <Person2Outlined />, visible: level >= PermissionLevel.VOLUNTARIO },
        { path: 'member', label: 'Membros', icon: <Group />, visible: level >= PermissionLevel.LIDER },
        { path: 'children', label: 'Menor de Idade', icon: <ChildCare />, visible: level >= PermissionLevel.LIDER },
        { path: 'service-schedule', label: 'Escala de Serviço', icon: <CalendarMonthRounded />, visible: level >= PermissionLevel.LIDER },
        { path: 'report', label: 'Relatório', icon: <StickyNote2Outlined />, visible: level >= PermissionLevel.OBREIRO },
        { path: 'group', label: 'GC', icon: <Diversity3Outlined />, visible: level >= PermissionLevel.LIDER },
        { path: 'visitor-group', label: 'Visitantes GC', icon: <Person2Rounded />, visible: level >= PermissionLevel.LIDER },
        { path: 'new-report-group', label: 'Novo Relatório GC', icon: <StickyNote2TwoTone />, visible: level == PermissionLevel.LIDER },
        { path: 'report-group', label: 'Relatório GC', icon: <StickyNote2TwoTone />, visible: level >= PermissionLevel.LIDER_SUPERVISOR },
        { path: 'financial', label: 'Finanças', icon: <Assessment />, visible: level >= PermissionLevel.ADMINISTRACAO },
        { path: 'user', label: 'Usuarios', icon: <AssignmentInd />, visible: level >= PermissionLevel.GESTOR },
        { path: 'preferences', label: 'Configurações', icon: <Settings />, visible: true },
    ];

    return items.filter(item => item.visible);
};
