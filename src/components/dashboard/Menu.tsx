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
} from '@mui/icons-material';

export interface IMenu {
  path: string;
  label: string;
  icon: JSX.Element;
  visible: boolean;
}

export const getMenuItems = (permission: number | null): IMenu[] => {
  const level = permission ?? 0;

  const items: IMenu[] = [
    { path: 'home', label: 'Início', icon: <Home/>, visible: true },
    { path: 'visitor', label: 'Visitantes', icon: <Person2Outlined />, visible: true },
    { path: 'member', label: 'Membros', icon: <Group />, visible: level >= 3 },
    { path: 'children', label: 'Crianças', icon: <ChildCare />, visible: level >= 3 },
    { path: 'report', label: 'Relatório', icon: <StickyNote2Outlined />, visible: level >= 5 },
    { path: 'group', label: 'GC', icon: <Diversity3Outlined />, visible: level >= 5 },
    { path: 'visitor-group', label: 'Visitantes GC', icon: <Person2Rounded />, visible: level >= 3 },
    { path: 'new-report-group', label: 'Novo Relatório GC', icon: <StickyNote2TwoTone />, visible: level == 3 },
    { path: 'report-group', label: 'Relatório GC', icon: <StickyNote2TwoTone />, visible: level >= 5 },
    { path: 'financial', label: 'Finanças', icon: <Assessment />, visible: level >= 8 },
    { path: 'preferences', label: 'Configurações', icon: <Settings />, visible: true },
  ];

  return items.filter(item => item.visible);
};
