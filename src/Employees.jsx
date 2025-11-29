// DÜZELTME 1: useEffect buraya eklendi
import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography,
    TextField, InputAdornment, IconButton, Avatar, Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';

function Employees() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [employees, setEmployees] = useState([]);


    useEffect(() => {
        // Backend adresimize istek atıyoruz
        fetch('http://localhost:5001/api/employees')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ağ hatası oluştu');
                }
                return response.json(); // Gelen cevabı JSON'a çevir
            })
            .then(data => {
                console.log("Backend'den gelen veri:", data); // İŞTE BURASI
                setEmployees(data);
            })
            .catch(error => {
                console.error('Veri çekme hatası:', error);
            });
    }, []);

    // DÜZELTME 2: Filtreleme kısmında emp.name yerine first_name ve last_name kontrolü
    const filteredEmployees = employees.filter(emp => {
        const fullName = `${emp.first_name} ${emp.last_name}`.toLowerCase();
        return fullName.includes(search.toLowerCase()) ||
            (emp.department && emp.department.toLowerCase().includes(search.toLowerCase())) ||
            (emp.position && emp.position.toLowerCase().includes(search.toLowerCase()));
    });

    // Quick Stats hesaplama (Status veritabanında olmadığı için hatalı görünebilir)
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === "Active").length;
    const onLeaveEmployees = employees.filter(emp => emp.status === "On Leave").length;
    const newJoiners = 2;

    const handleDelete = (index) => {
        // NOT: Bu işlem şu an sadece ekrandan siler, veritabanından silmez.
        const newEmps = [...employees];
        newEmps.splice(index, 1);
        setEmployees(newEmps);
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Employees" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 1, sm: 3, md: 6 } }}>
                {/* Quick Stats */}
                <Grid container spacing={3} mb={4}>
                    {[
                        { title: "TOTAL EMPLOYEES", value: totalEmployees, color: "#A242EBFF" },
                        { title: "ACTIVE EMPLOYEES", value: activeEmployees, color: "#682188FF" },
                        { title: "ON LEAVE", value: onLeaveEmployees, color: "#360E56FF" },
                    ].map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.title}>
                            <Card sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: stat.color,
                                color: '#fff',
                                height: 170,
                                ml: 3,
                                width: 380,
                                borderRadius: 3,
                                boxShadow: "0px 8px 20px rgba(0,0,0,0.15)"
                            }}>
                                <CardContent sx={{ textAlign: 'center', height: 250, width: 270 }}>
                                    <Typography sx={{ fontSize: 20, fontWeight: 500, marginTop: 2, letterSpacing: 0.9 }}>{stat.title}</Typography>
                                    <Typography sx={{ fontSize: 40, fontWeight: 600, mt: 1, marginTop: 2, }}>{stat.value}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Search and Add Button */}
                <Box sx={{ display: 'flex', mb: 6, mt: 8, gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <TextField
                        placeholder="Search Employees"
                        variant="standard"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: { xs: '100%', sm: 300 } /* Stil kısaltıldı */ }}
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
                        sx={{ bgcolor: '#9B36E8FF', '&:hover': { bgcolor: '#D894FFFF' }, whiteSpace: 'nowrap' }}
                    >
                        Add Employee
                    </Button>
                </Box>

                {/* Employee Cards */}
                <Grid container spacing={3} alignItems="stretch">
                    {filteredEmployees.map((emp, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={emp.id || idx}> {/* Key olarak tercihen ID kullanın */}
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
                                    height: 200,
                                    width: 300,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        {/* DÜZELTME 3: Avatar için first_name'in baş harfi */}
                                        <Avatar sx={{ bgcolor: '#6A5ACD', width: 56, height: 56, mr: 2 }}>
                                            {emp.first_name ? emp.first_name.charAt(0) : '?'}
                                        </Avatar>
                                        <Box>
                                            {/* DÜZELTME 4: İsim ve Soyisim birleştirildi */}
                                            <Typography sx={{ fontWeight: 600, fontSize: 18 }}>
                                                {emp.first_name} {emp.last_name}
                                            </Typography>
                                            <Typography sx={{ color: '#555', fontSize: 14 }}>{emp.position} - {emp.department}</Typography>
                                            <Typography sx={{ color: '#777', fontSize: 12 }}>{emp.email}</Typography>
                                        </Box>
                                    </Box>
                                    {/* Status veritabanında olmadığı için boş gelecektir */}
                                    <Typography sx={{ fontSize: 14, color: emp.status === "Active" ? "#5AB95DFF" : "#9E1313FF", fontWeight: 600 }}>
                                        Status: {emp.status || 'N/A'}
                                    </Typography>
                                </CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 1 }}>
                                    <IconButton color='success'><VisibilityIcon /></IconButton>
                                    <IconButton color="secondary"><EditIcon /></IconButton>
                                    <IconButton color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </Box>
        </Box >
    );
}

export default Employees;