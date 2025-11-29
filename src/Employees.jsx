import React, { useState } from 'react';
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

// Örnek çalışan verisi
const initialEmployees = [
    { name: "Ahmet Yılmaz", department: "IT", position: "Software Engineer", email: "ahmet@company.com", status: "Active" },
    { name: "Ayşe Kuzey", department: "HR", position: "HR Manager", email: "ayse@company.com", status: "On Leave" },
    { name: "Mehmet Talaşoğlu", department: "Finance", position: "Accountant", email: "mehmet@company.com", status: "Active" },
    { name: "Selin Gören", department: "Marketing", position: "Marketing Specialist", email: "selin@company.com", status: "Active" },
    { name: "Can Ahmetoğulları", department: "Sales", position: "Sales Executive", email: "can@company.com", status: "Active" },
    { name: "Elif Bilir", department: "Customer Support", position: "Support Specialist", email: "elif@company.com", status: "On Leave" },
    { name: "Burak Demir", department: "IT", position: "Frontend Developer", email: "burak@company.com", status: "Active" },
    { name: "Derya Kaya", department: "Finance", position: "Financial Analyst", email: "derya@company.com", status: "Active" },
    { name: "Emre Öztürk", department: "HR", position: "Recruiter", email: "emre@company.com", status: "On Leave" },
    { name: "Furkan Yıldız", department: "Marketing", position: "SEO Specialist", email: "furkan@company.com", status: "Active" },
    { name: "Gizem Arslan", department: "Sales", position: "Account Manager", email: "gizem@company.com", status: "Active" },
    { name: "Hakan Polat", department: "Customer Support", position: "Support Lead", email: "hakan@company.com", status: "Active" },
    { name: "Işıl Uysal", department: "IT", position: "Backend Developer", email: "isil@company.com", status: "Active" },
    { name: "Jale Erdem", department: "Finance", position: "Accountant", email: "jale@company.com", status: "On Leave" },
    { name: "Kemal Şahin", department: "HR", position: "HR Specialist", email: "kemal@company.com", status: "Active" },
    { name: "Lale Demirtaş", department: "Marketing", position: "Content Creator", email: "lale@company.com", status: "Active" },
    { name: "Murat Aksoy", department: "Sales", position: "Sales Associate", email: "murat@company.com", status: "Active" },
    { name: "Nihan Topal", department: "Customer Support", position: "Support Specialist", email: "nihan@company.com", status: "On Leave" },
    { name: "Okan Kılıç", department: "IT", position: "DevOps Engineer", email: "okan@company.com", status: "Active" },
    { name: "Pelin Güneş", department: "Finance", position: "Accountant", email: "pelin@company.com", status: "Active" },
    { name: "Rıza Yalçın", department: "HR", position: "HR Manager", email: "riza@company.com", status: "Active" },
    { name: "Seda Çelik", department: "Marketing", position: "Marketing Coordinator", email: "seda@company.com", status: "On Leave" },
];


function Employees() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [employees, setEmployees] = useState(initialEmployees);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase()) ||
        emp.position.toLowerCase().includes(search.toLowerCase())
    );

    // Quick Stats hesaplama
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === "Active").length;
    const onLeaveEmployees = employees.filter(emp => emp.status === "On Leave").length;
    const newJoiners = 2; // Örnek sabit sayı, dilersen tarihe göre hesaplayabilirsin

    const handleDelete = (index) => {
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
                        { title: "ACTIVE EMPLOYEES", value: activeEmployees, color: "#7D39D6FF" },
                        { title: "ON LEAVE", value: onLeaveEmployees, color: "#682188FF" },
                        { title: "NEW JOINERS", value: newJoiners, color: "#360E56FF" },
                    ].map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.title}>
                            <Card sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: stat.color,
                                color: '#fff',
                                height: 150,
                                borderRadius: 3,
                                boxShadow: "0px 8px 20px rgba(0,0,0,0.15)"
                            }}>
                                <CardContent sx={{ textAlign: 'center', height: 250, width: 270 }}>
                                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: 2, }}>{stat.title}</Typography>
                                    <Typography sx={{ fontSize: 32, fontWeight: 500, mt: 1, marginTop: 2, }}>{stat.value}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Box sx={{
                    display: 'flex',
                    mb: 6,
                    mt: 8,
                    gap: 5,
                    flexWrap: 'wrap',
                    justifyContent: 'flex-end', // sola yaslandı
                }}>
                    <TextField
                        placeholder="Search Employees"
                        variant="standard"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            width: { xs: '100%', sm: 300 },
                            '& .MuiInputBase-input': {
                                color: '#777', // yazı rengi
                            },
                            '& .MuiInput-underline:before': {
                                borderBottomColor: '#D3B3FF', // normal açık mor
                            },
                            '& .MuiInput-underline:hover:before': {
                                borderBottomColor: '#6B05A7FF', // hover koyu mor
                            },
                            '& .MuiInput-underline:after': {
                                borderBottomColor: '#6B05A7FF', // focus koyu mor
                            },
                            '& .MuiInputLabel-root': {
                                color: '#777', // label gri
                                '&.Mui-focused': {
                                    color: '#6B05A7FF', // label focus mor
                                },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: '#6B05A7FF' }} />
                                </InputAdornment>
                            ),
                        }}
                    />


                    {/* Add Button */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{
                            bgcolor: '#9B36E8FF',
                            '&:hover': { bgcolor: '#D894FFFF' },
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Add Employee
                    </Button>
                </Box>



                {/* Employee Cards */}
                <Grid container spacing={3} alignItems="stretch">
                    {filteredEmployees.map((emp, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: "0px 8px 20px rgba(0,0,0,0.1)",
                                    height: 200, // tüm kartlar aynı yükseklikte
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: '#6A5ACD', width: 56, height: 56, mr: 2 }}>
                                            {emp.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography sx={{ fontWeight: 600, fontSize: 18 }}>{emp.name}</Typography>
                                            <Typography sx={{ color: '#555', fontSize: 14 }}>{emp.position} - {emp.department}</Typography>
                                            <Typography sx={{ color: '#777', fontSize: 12 }}>{emp.email}</Typography>
                                        </Box>
                                    </Box>
                                    <Typography sx={{ fontSize: 14, color: emp.status === "Active" ? "#5AB95DFF" : "#9E1313FF", fontWeight: 600 }}>
                                        Status: {emp.status}
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
