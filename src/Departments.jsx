import React, { useState } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, TextField,
    InputAdornment, IconButton, Button, Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';

const initialDepartments = [
    { name: "IT", head: "Ahmet Yılmaz", employees: 12, created: "01.01.2020" },
    { name: "HR", head: "Ayşe Kuzey", employees: 8, created: "15.02.2020" },
    { name: "FINANCE", head: "Mehmet Talaşoğlu", employees: 5, created: "10.03.2020" },
    { name: "MARKETING", head: "Selin Gören", employees: 7, created: "20.04.2020" },
    { name: "SALES", head: "Can Ahmetoğulları", employees: 10, created: "05.05.2020" },
    { name: "CUSTOMER SUPPORT", head: "Elif Bilir", employees: 9, created: "12.06.2020" },
    { name: "R&D", head: "Hakan Cevahir", employees: 6, created: "18.07.2020" },
    { name: "OPERATIONS", head: "Berk Duman", employees: 11, created: "23.08.2020" },
    { name: "LEGAL", head: "Fatma Akarsu", employees: 4, created: "30.09.2020" },
    { name: "PROCUREMENT", head: "Emre Taştan", employees: 5, created: "15.10.2020" },
];

function DepartmentsPage() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [departments, setDepartments] = useState(initialDepartments);

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
                {/* Header: Search + Add */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 4 }}>
                    <TextField
                        label="Search Departments"
                        variant="outlined"
                        size="small"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{
                            marginLeft: 3,
                            marginTop: 2,
                            width: { xs: '100%', sm: 300 },
                            '& .MuiOutlinedInput-root': {
                                color: '#777',
                                '& fieldset': { borderColor: '#ccc' },
                                '&:hover fieldset': { borderColor: '#6B05A7FF' },
                                '&.Mui-focused fieldset': { borderColor: '#6B05A7FF' },
                            },
                            '& .MuiInputLabel-root': {
                                color: '#777',
                                '&.Mui-focused': { color: '#686869FF' },
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

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ fontSize: 14, bgcolor: '#AE4BFFFF', '&:hover': { bgcolor: '#BE8ADDFF' }, whiteSpace: 'nowrap' }}
                    >
                        Add Department
                    </Button>
                </Box>
                {/* Department Cards - Modern Minimal Style */}
                <Grid container spacing={3}>
                    {filteredDepartments.map((dep, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                boxShadow: "0px 6px 18px rgba(0,0,0,0.08)",
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0px 15px 30px rgba(0,0,0,0.2)' },
                                display: 'flex',
                                flexDirection: 'column',
                                width: 400,
                                height: 260,
                                marginLeft: 3,
                            }}>
                                {/* Header Band */}
                                <Box sx={{
                                    bgcolor: '#FFFFFFFF',
                                    color: '#4F4F4FFF',
                                    textAlign: 'center',
                                    fontWeight: 600,
                                    fontSize: 20,
                                    letterSpacing: 0.9,
                                    mt: 2,
                                    mb: 1,
                                }}>
                                    {dep.name}
                                </Box>

                                <Divider sx={{ bgcolor: '#9D01B9FF', height: 2, my: 1 }} />



                                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pt: 3 }}>
                                    {/* Info Boxes */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Box sx={{ bgcolor: '#f3f3f3', p: 1.5, borderRadius: 1, textAlign: 'center', flex: 1, mr: 1 }}>
                                            <Typography sx={{ mb: 1, mt: 1, fontSize: 14, color: '#555', fontWeight: 600, borderBottom: '1px solid #8B07D8FF' }}>Head</Typography>
                                            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{dep.head}</Typography>
                                        </Box>
                                        <Box sx={{ bgcolor: '#f3f3f3', p: 1.5, borderRadius: 1, textAlign: 'center', flex: 1, mx: 1 }}>
                                            <Typography sx={{ mb: 1, mt: 1, fontSize: 14, color: '#555', fontWeight: 600, borderBottom: '1px solid #8B07D8FF' }}>Employees</Typography>
                                            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{dep.employees}</Typography>
                                        </Box>
                                        <Box sx={{ bgcolor: '#f3f3f3', p: 1.5, borderRadius: 1, textAlign: 'center', flex: 1, ml: 1 }}>
                                            <Typography sx={{ mb: 1, mt: 1, fontSize: 14, color: '#555', fontWeight: 600, borderBottom: '1px solid #8B07D8FF' }}>Created</Typography>
                                            <Typography sx={{ fontSize: 14, fontWeight: 400 }}>{dep.created}</Typography>
                                        </Box>
                                    </Box>

                                    {/* Action Buttons */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                        <IconButton color='success'><VisibilityIcon /></IconButton>
                                        <IconButton color="secondary"><EditIcon /></IconButton>
                                        <IconButton color="error" onClick={() => handleDelete(idx)}><DeleteIcon /></IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {filteredDepartments.length === 0 && (
                        <Typography sx={{ textAlign: 'center', width: '100%', mt: 4, color: '#777' }}>
                            No departments found.
                        </Typography>
                    )}
                </Grid>



            </Box>
        </Box>
    );
}

export default DepartmentsPage;
