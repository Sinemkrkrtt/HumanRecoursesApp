import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, TextField,
    InputAdornment, IconButton, Button, Divider, CircularProgress, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, Avatar
} from '@mui/material';

// --- İKONLAR ---
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import BusinessIcon from '@mui/icons-material/Business'; // Departman ikonu
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DescriptionIcon from '@mui/icons-material/Description';
import DomainAddIcon from '@mui/icons-material/DomainAdd'; // Ekleme ikonu

import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';

function Departments() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");

    // --- DATA STATE ---
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // --- DIALOG STATES ---
    // 1. Ekleme (Add)
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newDep, setNewDep] = useState({ name: '', head: '', employees: '', description: '' });

    // 2. Düzenleme (Edit)
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editDep, setEditDep] = useState({ id: '', name: '', head: '', employees: '', description: '' });

    // 3. Görüntüleme (View)
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedDep, setSelectedDep] = useState(null);


    // --- VERİ ÇEKME (READ) ---
    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = () => {
        fetch('http://localhost:5001/api/departments')
            .then(response => {
                if (!response.ok) throw new Error('Veri çekilemedi!');
                return response.json();
            })
            .then(data => {
                setDepartments(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Hata:", err);
                setError("Veriler yüklenemedi. Backend sunucusunu kontrol edin.");
                setLoading(false);
            });
    };

    // --- FONKSİYONLAR ---

    // 1. SİLME (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm("Bu departmanı silmek istediğinize emin misiniz?")) return;

        try {
            const response = await fetch(`http://localhost:5001/api/departments/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // UI'dan da kaldır
                setDepartments(departments.filter(dep => dep.id !== id));
            } else {
                alert("Silme işlemi başarısız oldu.");
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Sunucu hatası: " + error.message);
        }
    };

    // 2. EKLEME (CREATE - POST)
    const handleAddDepartment = async () => {
        if (!newDep.name) {
            alert("Departman adı zorunludur!");
            return;
        }

        try {
            // Tarih bilgisini otomatik ekleyelim
            const depToSend = { ...newDep, created: new Date().toISOString().split('T')[0] };

            const response = await fetch('http://localhost:5001/api/departments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(depToSend),
            });

            if (!response.ok) throw new Error('Ekleme başarısız');

            const savedDep = await response.json();
            setDepartments([...departments, savedDep]); // Listeye ekle
            setOpenAddDialog(false); // Pencereyi kapat
            setNewDep({ name: '', head: '', employees: '', description: '' }); // Formu temizle
            alert("Departman başarıyla eklendi! 🎉");

        } catch (error) {
            alert("Hata: " + error.message);
        }
    };

    // 3. DÜZENLEME BAŞLATMA
    const handleEditClick = (dep) => {
        setEditDep(dep);
        setOpenEditDialog(true);
    };

    // 4. GÜNCELLEME (UPDATE - PUT)
    const handleUpdateDepartment = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/departments/${editDep.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editDep),
            });

            if (!response.ok) throw new Error('Güncelleme başarısız');

            const updatedData = await response.json();

            // Mevcut listeyi güncelle
            const updatedList = departments.map(d => d.id === updatedData.id ? updatedData : d);
            setDepartments(updatedList);

            setOpenEditDialog(false);
            alert("Departman güncellendi! ✅");

        } catch (error) {
            alert("Hata: " + error.message);
        }
    };

    // 5. GÖRÜNTÜLEME (VIEW)
    const handleViewClick = (dep) => {
        setSelectedDep(dep);
        setOpenViewDialog(true);
    };

    // --- Input Değişikliklerini Yakalama ---
    const handleAddInput = (e) => setNewDep({ ...newDep, [e.target.name]: e.target.value });
    const handleEditInput = (e) => setEditDep({ ...editDep, [e.target.name]: e.target.value });


    // --- ARAMA FİLTRESİ ---
    const filteredDepartments = departments.filter(dep =>
        (dep.name || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '110vh' }}>
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
                        onClick={() => setOpenAddDialog(true)}
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
                                            <Typography variant="body2">{dep.created || 'N/A'}</Typography>
                                        </Box>
                                    </Box>

                                    {/* Butonlar - İşlevler Eklendi */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                                        <IconButton size="small" sx={{ color: '#A8A4A4FF', mr: 1 }} onClick={() => handleViewClick(dep)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton size="small" color="secondary" sx={{ mr: 1 }} onClick={() => handleEditClick(dep)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(dep.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* --- DIALOG 1: EKLEME (ADD) --- */}
                <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: 450 } }}>
                    <IconButton onClick={() => setOpenAddDialog(false)} sx={{ position: 'absolute', right: 15, top: 15, color: '#9e9e9e' }}>
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
                        <Avatar sx={{ bgcolor: '#FFFFFFFF', color: '#9B36E8', width: 120, height: 120, mb: 1 }}>
                            <DomainAddIcon sx={{ fontSize: 90 }} />
                        </Avatar>
                    </Box>

                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                            <TextField
                                label="Department Name"
                                name="name"
                                value={newDep.name}
                                onChange={handleAddInput}
                                fullWidth
                                InputProps={{ startAdornment: <BusinessIcon sx={{ mr: 1, color: 'purple' }} /> }}
                            />
                            <TextField
                                label="Head of Department"
                                name="head"
                                value={newDep.head}
                                onChange={handleAddInput}
                                fullWidth
                                InputProps={{ startAdornment: <PersonIcon sx={{ mr: 1, color: 'purple' }} /> }}
                            />
                            <TextField
                                label="Employee Count"
                                name="employees"
                                value={newDep.employees}
                                onChange={handleAddInput}
                                fullWidth
                                type="number"
                                InputProps={{ startAdornment: <GroupIcon sx={{ mr: 1, color: 'purple' }} /> }}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'flex-end', pb: 3 }}>
                        <Button onClick={handleAddDepartment} variant="contained" sx={{ bgcolor: '#9B36E8', width: 180, borderRadius: 2, mt: 1, fontSize: 13 }}>Add Department</Button>
                    </DialogActions>
                </Dialog>

                {/* --- DIALOG 2: DÜZENLEME (EDIT) --- */}
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} PaperProps={{ sx: { borderRadius: 4, p: 2, minWidth: 450 } }}>
                    <IconButton onClick={() => setOpenEditDialog(false)} sx={{ position: 'absolute', right: 15, top: 15, color: '#9E9E9EFF' }}>
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
                        <Avatar sx={{ bgcolor: '#FFFFFFFF', color: '#E54FFFFF', width: 60, height: 60, mb: 1 }}>
                            <EditIcon sx={{ fontSize: 45 }} />
                        </Avatar>
                        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>Edit Department</DialogTitle>
                    </Box>
                    <DialogContent>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 0 }}>
                            <TextField
                                label="Department Name"
                                name="name"
                                value={editDep.name}
                                onChange={handleEditInput}
                                fullWidth
                            />
                            <TextField
                                label="Head of Department"
                                name="head"
                                value={editDep.head}
                                onChange={handleEditInput}
                                fullWidth
                            />
                            <TextField
                                label="Employee Count"
                                name="employees"
                                value={editDep.employees}
                                onChange={handleEditInput}
                                fullWidth
                                type="number"
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, mr: 2 }}>
                        <Button onClick={handleUpdateDepartment} variant="contained" sx={{ bgcolor: '#CF3CF7FF', width: 120 }}>Update</Button>
                    </DialogActions>
                </Dialog>

                {/* --- DIALOG 3: GÖRÜNTÜLEME (VIEW) --- */}
                <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} PaperProps={{ sx: { borderRadius: 4, p: 3, minWidth: 400, height: 330 } }}>
                    <IconButton onClick={() => setOpenViewDialog(false)} sx={{ position: 'absolute', right: 10, top: 10 }}>
                        <CloseIcon />
                    </IconButton>
                    {selectedDep && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <Avatar sx={{ bgcolor: '#FFFFFFFF', color: '#AE4BFFFF', width: 90, height: 90, mb: 1 }}>
                                <BusinessIcon sx={{ fontSize: 80 }} />
                            </Avatar>
                            <Typography variant="h6" sx={{ mb: 4, fontWeight: 'bold' }}>{selectedDep.name}</Typography>

                            <Box sx={{ bgcolor: '#f9f9f9', p: 2, borderRadius: 2, width: '90%', textAlign: 'left' }}>
                                <Typography sx={{ mb: 2 }}><strong>Head:</strong> {selectedDep.head}</Typography>
                                <Divider sx={{ mb: 1 }} />
                                <Typography sx={{ mb: 2 }}><strong>Employees:</strong> {selectedDep.employees}</Typography>

                                <Divider sx={{ mb: 1 }} />
                                <Typography><strong>Created Date:</strong> {selectedDep.created}</Typography>
                            </Box>
                        </Box>
                    )}
                </Dialog>

            </Box>
        </Box>
    );
}

export default Departments;