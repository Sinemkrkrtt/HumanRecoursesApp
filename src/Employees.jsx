
import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, TextField, InputAdornment, IconButton, Avatar, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';
import api from './api';

function Employees() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [employees, setEmployees] = useState([]); // array olarak başlat


    useEffect(() => {
        api.get("/employees")
            .then(res => {
                const data = Array.isArray(res.data) ? res.data : [];
                setEmployees(data);
                console.log(data);
            })
            .catch(err => console.error(err));
    }, []);


    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.department.toLowerCase().includes(search.toLowerCase()) ||
        emp.position.toLowerCase().includes(search.toLowerCase())
    );

    // Quick Stats hesaplama
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(emp => emp.status === "Active").length;
    const onLeaveEmployees = employees.filter(emp => emp.status === "On Leave").length;
    const newJoiners = 2; // Örnek sabit sayı

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
                        <Grid key={stat.title} xs={12} sm={6} md={3}>
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
                                    <Typography sx={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{stat.title}</Typography>
                                    <Typography sx={{ fontSize: 32, fontWeight: 500, mt: 1, marginTop: 2 }}>{stat.value}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Arama ve Add Button */}
                <Box sx={{ display: 'flex', mb: 6, mt: 8, gap: 5, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <TextField
                        placeholder="Search Employees"
                        variant="standard"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            width: { xs: '100%', sm: 300 },
                            '& .MuiInputBase-input': { color: '#777' },
                            '& .MuiInput-underline:before': { borderBottomColor: '#D3B3FF' },
                            '& .MuiInput-underline:hover:before': { borderBottomColor: '#6B05A7FF' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#6B05A7FF' },
                        }}
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
                        <Grid key={idx} xs={12} sm={6} md={4}>
                            <Card sx={{ borderRadius: 3, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)", height: 200, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: '#6A5ACD', width: 56, height: 56, mr: 2 }}>
                                            {emp.name ? emp.name.charAt(0) : '?'}
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
        </Box>
    );
}

export default Employees;
