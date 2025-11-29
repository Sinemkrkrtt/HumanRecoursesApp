import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';

export default function CustomAppBar({ onMenuClick, title }) {
    return (
        <AppBar position="fixed" sx={{ bgcolor: '#681CD9FF', height: 74, boxShadow: '0px 4px 10px rgba(0,0,0,0.2)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {/* Sol taraf: Menü */}
                <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick} sx={{ mr: 2 }}>
                        <MenuIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                    <Typography
                        sx={{
                            fontSize: 26,
                            fontWeight: 400,
                            letterSpacing: 1.5,
                            fontFamily: 'Lato, sans-serif', // daha zarif bir font
                            color: 'white', // direkt beyaz, gradient yerine
                        }}
                    >
                        {title}
                    </Typography>


                </Box>

                {/* Sağ taraf: Bildirim ve Profil */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 1 }}>
                    <IconButton color="inherit">
                        <Badge badgeContent={5} color="warning">
                            <NotificationsIcon sx={{ fontSize: 30 }} />
                        </Badge>
                    </IconButton>

                    <IconButton color="inherit">
                        <AccountCircle sx={{ fontSize: 35 }} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
