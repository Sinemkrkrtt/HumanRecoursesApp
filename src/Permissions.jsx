import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, ToggleButton, ToggleButtonGroup, CircularProgress
} from '@mui/material';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';

function Permissions() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [leaves, setLeaves] = useState([]); // Veritabanından gelecek
    const [filterStatus, setFilterStatus] = useState('Pending');
    const [loading, setLoading] = useState(true);

    // 1. Backend'den verileri çekme
    const fetchLeaves = () => {
        fetch('http://localhost:5001/api/leaves') // Port 5001 olduğuna emin ol
            .then(res => res.json())
            .then(data => {
                console.log("İzinler:", data);
                setLeaves(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Hata:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const handleStatusChange = (event, newStatus) => {
        if (newStatus !== null) setFilterStatus(newStatus);
    };

    // 2. Onaylama/Reddetme İşlemi (Veritabanına Kaydeder)
    const handleDecision = (id, decision) => {
        // Backend'e güncelleme isteği gönder
        fetch(`http://localhost:5001/api/leaves/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: decision })
        })
            .then(res => {
                if (res.ok) {
                    // Başarılıysa listeyi yenile veya ekrandaki veriyi güncelle
                    const updatedLeaves = leaves.map(lv =>
                        lv.id === id ? { ...lv, status: decision } : lv
                    );
                    setLeaves(updatedLeaves);
                }
            })
            .catch(err => console.error("Güncelleme hatası:", err));
    };

    const filteredLeaves = leaves.filter(lv => lv.status === filterStatus);

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Permissions" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 2, sm: 4, md: 6 } }}>

                {/* Status Filter */}
                <ToggleButtonGroup
                    value={filterStatus}
                    exclusive
                    onChange={handleStatusChange}
                    sx={{
                        mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center',
                        bgcolor: '#f0f0f0', borderRadius: 5, p: 1, boxShadow: '0px 4px 10px rgba(0,0,0,0.08)',
                    }}
                >
                    {["Pending", "Approved", "Rejected"].map((status) => (
                        <ToggleButton
                            key={status}
                            value={status}
                            sx={{
                                textTransform: 'none', flex: 1, fontWeight: 600, borderRadius: 3,
                                color: filterStatus === status ? '#fff' : '#555',
                                bgcolor: filterStatus === status
                                    ? status === "Pending" ? '#FFA500' :
                                        status === "Approved" ? '#28a745' : '#dc3545'
                                    : '#f0f0f0',
                                '&:hover': {
                                    bgcolor: status === "Pending" ? '#FFB733' :
                                        status === "Approved" ? '#45c465' : '#e46060',
                                    color: '#fff',
                                },
                                transition: '0.3s', fontSize: 14, py: 1.5,
                            }}
                        >
                            {status}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {loading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}

                {/* Leave Cards */}
                <Grid container spacing={3}>
                    {!loading && filteredLeaves.map((lv) => (
                        <Grid item xs={12} sm={6} md={4} key={lv.id}>
                            <Card sx={{
                                ml: 3, mt: 2,
                                borderRadius: 4, width: 400, height: 250,
                                boxShadow: '0px 8px 20px rgba(0,0,0,0.08)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0px 15px 30px rgba(0,0,0,0.15)' },
                            }}>
                                {/* Status Strip */}
                                <Box sx={{
                                    height: 6,
                                    bgcolor: lv.status === 'Approved' ? 'linear-gradient(90deg, #28a745, #51c878)' :
                                        lv.status === 'Rejected' ? 'linear-gradient(90deg, #dc3545, #e57373)' :
                                            'linear-gradient(90deg, #FFA500, #FFC233)'
                                }} />

                                <CardContent sx={{ pt: 3 }}>
                                    <Typography sx={{ fontWeight: 700, fontSize: 17, mb: 3 }}>{lv.employee}</Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        {/* Veritabanı sütun adlarını doğru kullandık: department, type, start_date, end_date */}
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontSize: 12, color: '#555', fontWeight: 600, mb: 0.5, borderBottom: '1px solid #800EF2FF' }}>Department</Typography>
                                            <Typography sx={{ fontSize: 14 }}>{lv.department}</Typography>
                                        </Box>
                                        <Box sx={{ flex: 1, mx: 1 }}>
                                            <Typography sx={{ fontSize: 12, color: '#555', fontWeight: 600, mb: 0.5, borderBottom: '1px solid #800EF2FF' }}>Leave Type</Typography>
                                            <Typography sx={{ fontSize: 14 }}>{lv.type}</Typography>
                                        </Box>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontSize: 12, color: '#555', fontWeight: 600, mb: 0.5, borderBottom: '1px solid #800EF2FF' }}>Duration</Typography>
                                            <Typography sx={{ fontSize: 14 }}>{lv.start_date} / {lv.end_date}</Typography>
                                        </Box>
                                    </Box>

                                    {/* Action Buttons */}
                                    {lv.status === 'Pending' && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleDecision(lv.id, 'Approved')}
                                                sx={{ flex: 1, mr: 1, bgcolor: '#6AA277FF', '&:hover': { bgcolor: '#39E163FF' }, fontWeight: 600 }}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleDecision(lv.id, 'Rejected')}
                                                sx={{ flex: 1, ml: 1, bgcolor: '#FD6F7DFF', '&:hover': { bgcolor: '#D52323FF' }, fontWeight: 600 }}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}

                                    {lv.status !== 'Pending' && (
                                        <Typography sx={{
                                            mt: 2, textAlign: 'center', fontSize: 14, fontWeight: 700,
                                            color: lv.status === 'Approved' ? '#599266FF' : '#D53949FF',
                                        }}>
                                            {lv.status.toUpperCase()}
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {!loading && filteredLeaves.length === 0 && (
                        <Typography sx={{ textAlign: 'center', width: '100%', mt: 4, color: '#777', fontSize: 15 }}>
                            No {filterStatus.toLowerCase()} requests found.
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}

export default Permissions;