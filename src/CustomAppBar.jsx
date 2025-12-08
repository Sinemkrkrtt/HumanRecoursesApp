import React, { useState, useEffect } from 'react'; // Hook'ları ekledik
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { useNavigate } from 'react-router-dom';

export default function CustomAppBar({ onMenuClick, title }) {
    const navigate = useNavigate();

    // Bildirim sayısı için state
    const [notificationCount, setNotificationCount] = useState(0);

    // Veritabanından duyuru sayısını çek
    useEffect(() => {
        fetch('http://localhost:5001/api/announcements') // Backend portu 5001
            .then(res => res.json())
            .then(data => {
                // data bir dizi (array) olarak gelir. 
                // Array'in uzunluğu (length) duyuru sayısını verir.
                setNotificationCount(data.length);
            })
            .catch(err => {
                console.error("Bildirim sayısı alınamadı:", err);
                setNotificationCount(0); // Hata olursa 0 göster
            });
    }, []);

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
                            fontFamily: 'Lato, sans-serif',
                            color: 'white',
                        }}
                    >
                        {title}
                    </Typography>
                </Box>

                {/* Sağ taraf: Bildirim ve Profil */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 1 }}>
                    {/* Bildirim İkonu */}
                    <IconButton color="inherit" onClick={() => navigate('/announcements')}>
                        {/* badgeContent artık dinamik state'ten geliyor */}
                        <Badge badgeContent={notificationCount} color="warning">
                            <NotificationsIcon sx={{ fontSize: 30 }} />
                        </Badge>
                    </IconButton>

                    {/* Profil İkonu */}
                    <IconButton color="inherit" onClick={() => navigate('/settings')}>
                        <AccountCircle sx={{ fontSize: 35 }} />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}