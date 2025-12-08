import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // 1. useLocation eklendi
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from '@mui/material/Typography';

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import CampaignIcon from "@mui/icons-material/Campaign";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchBar from './SearchBar';

function DrawerComponent({ open, onClose }) {
    const navigate = useNavigate();
    const location = useLocation(); // 2. Mevcut konumu almak için hook
    const [searchTerm, setSearchTerm] = useState("");

    const menuItems = [
        { text: "Home", icon: <DashboardIcon />, route: "/home" },
        { text: "Employees", icon: <PeopleIcon />, route: "/employees" },
        { text: "Departments", icon: <ApartmentIcon />, route: "/departments" },
        { text: "Permissions", icon: <BeachAccessIcon />, route: "/permissions" },
        { text: "Attendances", icon: <AccessTimeIcon />, route: "/attendances" },
        { text: "Payrolls", icon: <AttachMoneyIcon />, route: "/payrolls" },
        { text: "Documents", icon: <DescriptionIcon />, route: "/documents" },
        { text: "Announcements", icon: <CampaignIcon />, route: "/announcements" },
    ];

    const otherItems = [
        { text: "Settings", icon: <SettingsIcon />, route: "/settings" },
    ];

    const filterItems = (items) => {
        return items.filter(item =>
            item.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const filteredMenu = filterItems(menuItems);
    const filteredOther = filterItems(otherItems);

    // 3. YENİ YÖNLENDİRME MANTIĞI
    const handleNavigation = (route) => {
        // Zaten o sayfadaysak sadece drawer'ı kapat
        if (location.pathname === route) {
            onClose();
            return;
        }

        // Eğer 'Home'a gidiyorsak -> Normal git (Push)
        if (route === '/home') {
            navigate(route);
        }
        // Eğer şu an 'Home'daysak -> Normal git (Push)
        else if (location.pathname === '/home' || location.pathname === '/') {
            navigate(route);
        }
        // Eğer alt sayfadan başka alt sayfaya geçiyorsak -> Yer Değiştir (Replace)
        // Bu sayede tarayıcı geçmişine yığılma yapmaz.
        else {
            navigate(route, { replace: true });
        }

        onClose(); // Drawer'ı kapat
    };

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 250, bgcolor: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                <Box>
                    <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

                    <List sx={{ mt: 1 }}>
                        {filteredMenu.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    // 4. onClick içinde yeni fonksiyonu kullanıyoruz
                                    onClick={() => handleNavigation(item.route)}
                                    sx={{ '&:hover': { bgcolor: '#A242EB33', borderRadius: 1 }, my: 0.5 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: '#5418ADFF' }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}

                        {filteredMenu.length === 0 && filteredOther.length === 0 && (
                            <Typography variant="body2" sx={{ color: '#999', textAlign: 'center', mt: 2 }}>
                                No results found.
                            </Typography>
                        )}
                    </List>
                </Box>

                <Box>
                    {(filteredMenu.length > 0 && filteredOther.length > 0) && (
                        <Divider sx={{ my: 1, bgcolor: '#A242EBFF' }} />
                    )}

                    <List>
                        {filteredOther.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    // 4. onClick içinde yeni fonksiyonu kullanıyoruz
                                    onClick={() => handleNavigation(item.route)}
                                    sx={{ '&:hover': { bgcolor: '#A242EB33', borderRadius: 1 }, my: 0.5 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: '#5E17C8FF' }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Box>
        </Drawer>
    );
}

export default DrawerComponent;