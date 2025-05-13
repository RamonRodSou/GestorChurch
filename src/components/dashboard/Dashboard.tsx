import "./dashboard.scss";
import { Logout, Menu as MenuIcon } from "@mui/icons-material";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import {
    AppBar,
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
import { getMenuItems  } from "./Menu";
import { AuthContext } from "@context/AuthContext";
import { ManagerContext } from "@context/ManagerContext";
import { Admin } from "@domain/user";
import { PermissionContext } from "@context/PermissionContext";

export default function Dashboard() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentUser = useContext(AuthContext);
    const { userId } = useParams();
    const { isMobile } = useContext(ManagerContext);
    const { permission } = useContext(PermissionContext) ?? { permission: null };
    const menuItems = getMenuItems (permission);

    const admin = location.state?.admin as Admin;
    
    const [mobileOpen, setMobileOpen] = useState(false);
    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    function handleListItemClick(path: string): void {
        navigate(`/dashboard/${userId}/${path}`, { state: { admin } });
        if (isMobile) setMobileOpen(false);
    }

    function logout() {
        navigate(`/login}`);
    }
    
    const isActive = (path: string) => location.pathname === `/dashboard/${userId}/${path}`;
    const mobileMarginTop = isMobile ? 55 : 0;
    
    const drawerContent = (
        <div className="dashboard-menu-content">
            <List> 
                {menuItems.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            selected={isActive(item.path)}
                            onClick={() => handleListItemClick(item.path)}
                            sx={{ color: "white" }}
                        >
                            <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.label}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <div className="dashboard-data">
                <Tooltip className="data-button" title="Click to logout">
                    <IconButton onClick={logout}>
                        <Logout/>
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
                            <MenuIcon/>
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
                        backgroundColor:'var(--primary-background)',
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
