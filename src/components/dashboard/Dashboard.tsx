import "./dashboard.scss";
import { HelpCenter, Logout, Menu as MenuIcon } from "@mui/icons-material";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
    AppBar,
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Tooltip,
    Typography
} from "@mui/material";
import { useContext, useState } from "react";
import { getMenuItems } from "./Menu";
import { AuthContext } from "@context/AuthContext";
import { ManagerContext } from "@context/ManagerContext";
import { Admin } from "@domain/user";
import { PermissionContext } from "@context/PermissionContext";
import logo from "@assets/logo.webp";
import { signOut } from "firebase/auth";
import { auth } from "@service/firebase";
import { sendWhatsappMessage, whatAppMessageSupport } from "@domain/utils";

export default function Dashboard() {
    const supportName = import.meta.env.VITE_SUPPORT_NAME
    const supportPhone = import.meta.env.VITE_SUPPORT_PHONE

    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useContext(AuthContext);

    const [mobileOpen, setMobileOpen] = useState(false);

    const { userId } = useParams();
    const { isMobile } = useContext(ManagerContext);
    const { permission } = useContext(PermissionContext) ?? { permission: null };

    const menuItems = getMenuItems(permission);
    const admin = location.state?.admin as Admin;

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    function handleListItemClick(path: string): void {
        navigate(`/dashboard/${userId}/${path}`, { state: { admin } });
        if (isMobile) setMobileOpen(false);
    }

    function logout() {
        signOut(auth)
            .then(() => {
                navigate('/login');
            })
            .catch((error) => {
                console.error('Erro ao fazer logout:', error);
            });
    }

    const isActive = (path: string) => location.pathname === `/dashboard/${userId}/${path}`;
    const mobileMarginTop = isMobile ? 55 : 0;

    const drawerContent = (
        <div className="dashboard-menu-content">
            <Box className="logo">
                <img alt="Logo Dashboard" src={logo} width={50} />
                <Typography className="titleLogo">Admin Church</Typography>
            </Box>
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            selected={isActive(item.path)}
                            onClick={() => handleListItemClick(item.path)}
                            sx={{ color: "white" }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <div className="dashboard-data">
                <Box className="support" onClick={() => sendWhatsappMessage(supportName, supportPhone, whatAppMessageSupport)}>
                    <HelpCenter /><Typography className="">Suporte Técnico</Typography>
                </Box>
                <Tooltip className="data-button" title="Click to logout">
                    <IconButton onClick={logout}>
                        <Logout />
                    </IconButton>
                </Tooltip>
                <Typography variant="caption">
                    {currentUser?.email || "email@exemplo.com"}
                </Typography>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            {isMobile && (
                <AppBar position="fixed" sx={{ zIndex: 1201 }}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Painel de Controle
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            <Drawer
                variant={isMobile ? "temporary" : "permanent"}
                open={isMobile ? mobileOpen : true}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: 240,
                        backgroundColor: 'var(--primary-background)',
                        color: 'var(--primary-color)',
                        boxSizing: "border-box",
                    },
                }}
            >
                {drawerContent}
            </Drawer>
            <div
                className="dashboard-content"
                style={{
                    marginTop: mobileMarginTop
                }}
            >
                <Outlet
                    context={{ admin }}
                />
            </div>
        </div>
    );
}


