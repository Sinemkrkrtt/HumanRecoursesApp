import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography,
    TextField, InputAdornment, IconButton, Avatar, Button,
    Dialog, DialogTitle, DialogContent, DialogActions, Divider
} from '@mui/material';

// --- İKON IMPORTLARI ---
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';

// YENİ EKLENEN TASARIM İKONLARI
import AccountCircle from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import BadgeIcon from '@mui/icons-material/Badge';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info'; // Detay ikonu

import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';

function Employees() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [employees, setEmployees] = useState([]);

    // --- STATE'LER ---

    // 1. Ekleme Dialog State'i
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [newEmployee, setNewEmployee] = useState({
        first_name: '', last_name: '', email: '', position: '', department: '', status: 'Active'
    });

    // 2. Görüntüleme (View) Dialog State'i
    const [openViewDialog, setOpenViewDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    // 3. Düzenleme (Edit) Dialog State'i
    const [openEditDialog, setOpenEditDialog] = useState(false);
    // Edit işlemi için ayrı bir state tutuyoruz ki formda değişiklik yapabilelim
    const [editEmployeeData, setEditEmployeeData] = useState({
        id: '', first_name: '', last_name: '', email: '', position: '', department: '', status: ''
    });
    // Varsayılan olarak "All" (Hepsi) seçili olsun
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = () => {
        fetch('http://localhost:5001/api/employees')
            .then(response => {
                if (!response.ok) throw new Error('Ağ hatası oluştu');
                return response.json();
            })
            .then(data => {
                setEmployees(data);
            })
            .catch(error => console.error('Veri çekme hatası:', error));
    };

    // --- FONKSİYONLAR ---

    // Arama ve Statü Filtresi
    const filteredEmployees = employees.filter(emp => {
        // 1. Yazı Araması
        const fName = (emp.first_name || "").toLowerCase();
        const lName = (emp.last_name || "").toLowerCase();
        const dept = (emp.department || "").toLowerCase();
        const pos = (emp.position || "").toLowerCase();
        const searchKey = search.toLowerCase();
        const matchesSearch = fName.includes(searchKey) || lName.includes(searchKey) || dept.includes(searchKey) || pos.includes(searchKey);

        // 2. Statü Filtresi (Kartlara basınca çalışacak kısım)
        // Eğer filter "All" ise hepsini getir, değilse sadece statüsü eşleşenleri getir.
        const matchesStatus = statusFilter === "All" || emp.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // 1. SİLME İŞLEMİ (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm("Bu çalışanı silmek istediğinize emin misiniz?")) return;

        try {
            const response = await fetch(`http://localhost:5001/api/employees/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setEmployees(employees.filter(emp => emp.id !== id));
            } else {
                // Hata mesajını detaylı alıyoruz
                const errorText = await response.text();
                alert("Silme işlemi başarısız: " + errorText);
            }
        } catch (error) {
            console.error("Silme hatası:", error);
            alert("Hata: " + error.message);
        }
    };

    // 2. EKLEME İŞLEMİ (POST)
    const handleAddEmployee = async () => {
        if (!newEmployee.first_name || !newEmployee.email) {
            alert("Lütfen en azından İsim ve Email alanlarını doldurun.");
            return;
        }
        try {
            const response = await fetch('http://localhost:5001/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newEmployee),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Sunucu hatası');
            }
            const data = await response.json();
            setEmployees([...employees, data]);
            setOpenAddDialog(false);
            setNewEmployee({ first_name: '', last_name: '', email: '', position: '', department: '', status: 'Active' });
            alert("Çalışan eklendi! 🎉");
        } catch (error) {
            alert("Hata: " + error.message);
        }
    };

    // 3. GÖRÜNTÜLEME İŞLEMİ (VIEW - GÖZ İKONU)
    const handleViewClick = (employee) => {
        setSelectedEmployee(employee);
        setOpenViewDialog(true);
    };

    // 4. DÜZENLEME BAŞLATMA (EDIT - KALEM İKONU)
    const handleEditClick = (employee) => {
        setEditEmployeeData(employee); // Mevcut verileri forma doldur
        setOpenEditDialog(true);
    };

    // 5. GÜNCELLEME KAYDETME (PUT) - **GÜNCELLENDİ**
    const handleUpdateEmployee = async () => {
        try {
            const response = await fetch(`http://localhost:5001/api/employees/${editEmployeeData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editEmployeeData),
            });

            // Sunucudan dönen hata mesajını (örneğin "Cannot PUT ...") yakalıyoruz
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Güncelleme hatası');
            }

            const updatedEmp = await response.json();

            // Listeyi güncelle (Eski veriyi çıkar, yenisini koy)
            const updatedList = employees.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp);
            setEmployees(updatedList);

            setOpenEditDialog(false);
            alert("Bilgiler güncellendi! ✅");
        } catch (error) {
            console.error("Güncelleme hatası:", error);
            // Gerçek hatayı ekrana basıyoruz
            alert("Hata: " + error.message);
        }
    };

    // Input Değişikliklerini Yakala (Ekleme ve Düzenleme için)
    const handleInputChange = (e) => {
        setNewEmployee({ ...newEmployee, [e.target.name]: e.target.value });
    };

    const handleEditInputChange = (e) => {
        setEditEmployeeData({ ...editEmployeeData, [e.target.name]: e.target.value });
    };

    // İstatistikler
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === "Active").length;
    const onLeaveEmployees = employees.filter(emp => emp.status === "On Leave").length;

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Employees" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 1, sm: 3, md: 6 } }}>
                {/* Quick Stats */}
                <Grid container spacing={3} mb={4}>
                    {[
                        { title: "TOTAL EMPLOYEES", value: totalEmployees, color: "#430870FF", filterKey: "All" },
                        { title: "ACTIVE EMPLOYEES", value: activeEmployees, color: "#80DC70FF", filterKey: "Active" },
                        { title: "ON LEAVE", value: onLeaveEmployees, color: "#B31515FF", filterKey: "On Leave" },
                    ].map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.title}>
                            <Card
                                // Tıklama özelliğini buraya ekliyoruz
                                onClick={() => setStatusFilter(stat.filterKey)}
                                sx={{
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                                    bgcolor: stat.color, color: '#fff', height: 170, ml: 3, width: 380, borderRadius: 3,
                                    boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                                    cursor: 'pointer', // Tıklanabilir olduğunu göstermek için el işareti
                                    transition: 'transform 0.2s', // Hafif animasyon
                                    '&:hover': { transform: 'scale(1.02)' },
                                }}>
                                <CardContent sx={{ textAlign: 'center', height: 250, width: 270 }}>
                                    <Typography sx={{ fontSize: 20, fontWeight: 500, mt: 2, letterSpacing: 0.9 }}>{stat.title}</Typography>
                                    <Typography sx={{ fontSize: 40, fontWeight: 600, mt: 1 }}>{stat.value}</Typography>
                                    {/* Hangi filtrenin aktif olduğunu göstermek için ufak bir yazı (Opsiyonel) */}
                                    {statusFilter === stat.filterKey && <Typography variant="caption" sx={{ color: 'gold', fontWeight: 'bold' }}></Typography>}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                {/* Arama ve Ekleme */}
                <Box sx={{ display: 'flex', mb: 6, mt: 8, gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <TextField
                        placeholder="Search Employees"
                        variant="standard"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 300 } }}
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
                        sx={{ bgcolor: '#9B36E8FF', '&:hover': { bgcolor: '#D894FFFF' }, whiteSpace: 'nowrap' }}
                    >
                        Add Employee
                    </Button>
                </Box>

                {/* --- ÇALIŞAN KARTLARI --- */}
                <Grid container spacing={3} alignItems="stretch">
                    {filteredEmployees.map((emp, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={emp.id || idx}>
                            <Card sx={{
                                borderRadius: 3, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
                                height: 200, width: 310, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: '#6A5ACD', width: 56, height: 56, mr: 2 }}>
                                            {emp.first_name ? emp.first_name.charAt(0).toUpperCase() : '?'}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
                                                {emp.first_name} {emp.last_name}
                                            </Typography>
                                            <Typography sx={{ color: '#555', fontSize: 14 }}>{emp.position} - {emp.department}</Typography>
                                            <Typography sx={{ color: '#777', fontSize: 12 }}>{emp.email}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography sx={{ fontSize: 14, color: emp.status === "Active" ? "#5AB95DFF" : "#9E1313FF", fontWeight: 600 }}>
                                        Status: {emp.status || 'N/A'}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1 }}>

                                    {/* GÖZ (VIEW) BUTONU */}
                                    <IconButton sx={{ color: "#686767FF" }} onClick={() => handleViewClick(emp)}>
                                        <VisibilityIcon />
                                    </IconButton>

                                    {/* KALEM (EDIT) BUTONU */}
                                    <IconButton color="secondary" onClick={() => handleEditClick(emp)}>
                                        <EditIcon />
                                    </IconButton>

                                    {/* ÇÖP (DELETE) BUTONU */}
                                    <IconButton color="error" onClick={() => handleDelete(emp.id)}>
                                        <DeleteIcon />
                                    </IconButton>

                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* --- DIALOG 1: EKLEME PENCERESİ (ADD) --- */}
                <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} PaperProps={{ sx: { borderRadius: 4, padding: 2, minWidth: 450 } }}>
                    <IconButton onClick={() => setOpenAddDialog(false)} sx={{ position: 'absolute', right: 15, top: 15, color: '#9e9e9e' }}>
                        <CloseIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
                        <Avatar sx={{ bgcolor: '#FFFFFFFF', color: '#9B36E8FF', width: 200, height: 80, mt: 2 }}>
                            <PersonAddAltIcon sx={{ fontSize: 100 }} />
                        </Avatar>
                        <DialogTitle sx={{ letterSpacing: 0.9, p: 0, fontWeight: 600, fontSize: '1.7rem', color: '#333', mt: 2, mb: 1 }}>New Employee</DialogTitle>
                    </Box>
                    <DialogContent sx={{ mt: 0 }}>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><TextField label="First Name" name="first_name" value={newEmployee.first_name} onChange={handleInputChange} fullWidth InputProps={{ startAdornment: (<InputAdornment position="start"><AccountCircle sx={{ color: '#9B36E8FF' }} /></InputAdornment>) }} /></Grid>
                                <Grid item xs={6}><TextField label="Last Name" name="last_name" value={newEmployee.last_name} onChange={handleInputChange} fullWidth /></Grid>
                            </Grid>
                            <TextField label="Email" name="email" value={newEmployee.email} onChange={handleInputChange} fullWidth InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon sx={{ color: '#9B36E8FF' }} /></InputAdornment>) }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}><TextField label="Department" name="department" value={newEmployee.department} onChange={handleInputChange} fullWidth InputProps={{ startAdornment: (<InputAdornment position="start"><WorkIcon sx={{ color: '#9B36E8FF' }} /></InputAdornment>) }} /></Grid>
                                <Grid item xs={6}><TextField label="Position" name="position" value={newEmployee.position} onChange={handleInputChange} fullWidth InputProps={{ startAdornment: (<InputAdornment position="start"><BadgeIcon sx={{ color: '#9B36E8FF' }} /></InputAdornment>) }} /></Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 3 }}>
                        <Button variant="contained"
                            color="primary"
                            type="button"
                            onClick={handleAddEmployee} sx={{ width: 170, bgcolor: '#9B36E8FF', '&:hover': { bgcolor: '#5B02A9FF' }, borderRadius: 2 }}>Save Employee</Button>
                    </DialogActions>
                </Dialog>

                {/* --- DIALOG 2: DÜZENLEME PENCERESİ (EDIT) --- */}
                <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} PaperProps={{ sx: { borderRadius: 4, padding: 2, minWidth: 450 } }}>
                    <IconButton onClick={() => setOpenEditDialog(false)} sx={{ position: 'absolute', right: 15, top: 15, color: '#9e9e9e' }}><CloseIcon /></IconButton>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 1 }}>
                        <Avatar sx={{ bgcolor: '#FEFEFEFF', color: '#C573FFFF', width: 70, height: 70, mb: 1 }}>
                            <EditIcon sx={{ fontSize: 45 }} />
                        </Avatar>
                        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333' }}>Edit Employee</DialogTitle>
                    </Box>
                    <DialogContent sx={{ mt: 0 }}>
                        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}><TextField label="First Name" name="first_name" value={editEmployeeData.first_name || ''} onChange={handleEditInputChange} fullWidth /></Grid>
                                <Grid item xs={6}><TextField label="Last Name" name="last_name" value={editEmployeeData.last_name || ''} onChange={handleEditInputChange} fullWidth /></Grid>
                            </Grid>
                            <TextField label="Email" name="email" value={editEmployeeData.email || ''} onChange={handleEditInputChange} fullWidth />
                            <Grid container spacing={2}>
                                <Grid item xs={6}><TextField label="Department" name="department" value={editEmployeeData.department || ''} onChange={handleEditInputChange} fullWidth /></Grid>
                                <Grid item xs={6}><TextField label="Position" name="position" value={editEmployeeData.position || ''} onChange={handleEditInputChange} fullWidth /></Grid>
                            </Grid>
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'flex-end', pb: 2, mr: 2, }}>
                        <Button onClick={handleUpdateEmployee} variant="contained"
                            color="primary"
                            type="button" sx={{ bgcolor: '#CF81FFFF', width: 180, }}>Update Employee</Button>
                    </DialogActions>
                </Dialog>

                {/* --- DIALOG 3: DETAY GÖRÜNTÜLEME (VIEW) --- */}
                <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} PaperProps={{ sx: { borderRadius: 4, padding: 3, minWidth: 400 } }}>
                    <IconButton onClick={() => setOpenViewDialog(false)} sx={{ position: 'absolute', right: 10, top: 10 }}><CloseIcon /></IconButton>

                    {selectedEmployee && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                            <Avatar sx={{ bgcolor: '#6A5ACD', width: 100, height: 100, fontSize: 40, mb: 2 }}>
                                {selectedEmployee.first_name?.charAt(0)}
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold">
                                {selectedEmployee.first_name} {selectedEmployee.last_name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                {selectedEmployee.position}
                            </Typography>

                            <Box sx={{ width: '100%', bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Email:</strong> {selectedEmployee.email}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}><strong>Department:</strong> {selectedEmployee.department}</Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Status:</strong>
                                    <span style={{ color: selectedEmployee.status === 'Active' ? 'green' : 'red', marginLeft: 5 }}>
                                        {selectedEmployee.status}
                                    </span>
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Dialog>

            </Box>
        </Box >
    );
}

export default Employees;