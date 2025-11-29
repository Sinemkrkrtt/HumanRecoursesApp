import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, TextField,
    InputAdornment, IconButton, Button, Divider, CircularProgress, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';

function Departments() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");

    // 1. Verileri tutacak kutularımız
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 2. Sayfa açılınca verileri çek
    useEffect(() => {
        fetch('http://localhost:5001/api/departments')
            .then(response => {
                // Eğer sunucudan cevap gelmezse hata fırlat
                if (!response.ok) {
                    throw new Error('Veri çekilemedi! Backend çalışıyor mu?');
                }
                return response.json();
            })
            .then(data => {
                console.log("Gelen Veri:", data); // Konsoldan kontrol etmek için
                setDepartments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Hata:", err);
                setError("Veriler yüklenemedi. Lütfen 'node server.js'in çalıştığından emin olun.");
                setLoading(false);
            });
    }, []);

    // Arama filtresi
    const filteredDepartments = departments.filter(dep =>
        dep.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (index) => {
        const newDeps = [...departments];
        newDeps.splice(index, 1);
        setDepartments(newDeps);
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Departments" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 2, sm: 4, md: 6 } }}>

                {/* Arama ve Ekleme Butonu */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, mt: 2, mb: 3, }}>
                    <TextField
                        label="Search Departments"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 300 }, bgcolor: 'white' }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#6B05A7FF' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ mt: 2, mb: 3, bgcolor: '#AE4BFFFF', '&:hover': { bgcolor: '#BE8ADDFF' } }}
                    >
                        Add Department
                    </Button>
                </Box>

                {/* HATA veya YÜKLENİYOR Durumları */}
                {loading && <Box display="flex" justifyContent="center" m={5}><CircularProgress /></Box>}
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {/* KARTLAR */}
                <Grid container spacing={3}>
                    {!loading && !error && filteredDepartments.map((dep, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={dep.id || idx}>
                            <Card sx={{
                                borderRadius: 3,
                                boxShadow: "0px 6px 18px rgba(0,0,0,0.08)",
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0px 15px 30px rgba(0,0,0,0.2)' },
                                transition: 'all 0.3s',
                                height: 230,
                                width: 420,
                                display: 'flex',
                                flexDirection: 'column',
                                mt: 2,
                                mb: 1,
                            }}>
                                {/* Departman İsmi */}
                                <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#fff' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#4F4F4FFF' }}>
                                        {dep.name}
                                    </Typography>
                                </Box>
                                <Divider sx={{ bgcolor: '#9D01B9FF', height: 2 }} />

                                {/* Bilgiler */}
                                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                                        {/* HEAD */}
                                        <Box sx={{ bgcolor: '#f3f3f3', p: 1, borderRadius: 1, flex: 1, textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#555', display: 'block', mb: 0.5 }}>Head</Typography>
                                            <Typography variant="body2">{dep.head || '-'}</Typography>
                                        </Box>
                                        {/* EMPLOYEES */}
                                        <Box sx={{ bgcolor: '#f3f3f3', p: 1, borderRadius: 1, flex: 1, textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#555', display: 'block', mb: 0.5 }}>Empl.</Typography>
                                            <Typography variant="body2">{dep.employees}</Typography>
                                        </Box>
                                        {/* CREATED */}
                                        <Box sx={{ bgcolor: '#f3f3f3', p: 1, borderRadius: 1, flex: 1, textAlign: 'center' }}>
                                            <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#555', display: 'block', mb: 0.5 }}>Date</Typography>
                                            <Typography variant="body2">{dep.created}</Typography>
                                        </Box>
                                    </Box>

                                    {/* Butonlar */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <IconButton size="small" color='success'><VisibilityIcon /></IconButton>
                                        <IconButton size="small" color="secondary"><EditIcon /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}

export default Departments;