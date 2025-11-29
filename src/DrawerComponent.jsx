import React from 'react';
import { useNavigate } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DescriptionIcon from "@mui/icons-material/Description";
import CampaignIcon from "@mui/icons-material/Campaign";
import SettingsIcon from "@mui/icons-material/Settings";
import QuestionMarkOutlinedIcon from '@mui/icons-material/QuestionMarkOutlined';
import SearchBar from './SearchBar';

function DrawerComponent({ open, onClose }) {
    const navigate = useNavigate();

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

    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 250, bgcolor: '#f5f5f5', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
                <Box>
                    <SearchBar />
                    <List>
                        {menuItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.route)}
                                    sx={{ '&:hover': { bgcolor: '#A242EB33', borderRadius: 1 }, my: 0.5 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 40, color: '#5418ADFF' }}>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.text} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>

                <Box>
                    <Divider sx={{ my: 1, bgcolor: '#A242EBFF' }} />
                    <List>
                        {otherItems.map((item) => (
                            <ListItem key={item.text} disablePadding>
                                <ListItemButton
                                    onClick={() => navigate(item.route)}
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
