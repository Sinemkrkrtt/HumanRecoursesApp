import React, { useState } from 'react';
import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const attendanceData = [
    { day: 'Mon', present: 50 },
    { day: 'Tue', present: 45 },
    { day: 'Wed', present: 60 },
    { day: 'Thu', present: 55 },
    { day: 'Fri', present: 40 },
];

const recentActivities = [
    { activity: "Yeni çalışan eklendi: Ahmet Y.", date: "24 Kasım 2025" },
    { activity: "İzin onaylandı: Ayşe K.", date: "23 Kasım 2025" },
    { activity: "Bordro hazırlandı: Kasım 2025", date: "22 Kasım 2025" },
    { activity: "Yeni departman eklendi: Yazılım", date: "21 Kasım 2025" },
];


function Home() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const stats = [
        { title: "Employees", value: 125, icon: <PeopleIcon sx={{ fontSize: 50 }} />, color: "#A242EBFF" },
        { title: "Departments", value: 5, icon: <ApartmentIcon sx={{ fontSize: 50 }} />, color: "#7D39D6FF" },
        { title: "Pending Leaves", value: 8, icon: <AccessTimeIcon sx={{ fontSize: 50 }} />, color: "#682188FF" },
        { title: "Payroll", value: "₺120K", icon: <AttachMoneyIcon sx={{ fontSize: 50 }} />, color: "#360E56FF" },
    ];

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Home" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 2, sm: 3, md: 6 } }}>
                {/* Quick Stats */}
                <Grid container spacing={4} mb={4}>
                    {stats.map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.title}>
                            <Card sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                bgcolor: stat.color,
                                color: '#fff',
                                height: 210,
                                width: 300,
                                borderRadius: 3,
                                boxShadow: "0px 8px 20px rgba(0,0,0,0.15)"
                            }}>
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                                    <Typography sx={{ fontSize: 19, marginBottom: 1, fontWeight: 600 }}>{stat.title}</Typography>
                                    <Typography sx={{ fontSize: 40, fontWeight: 500 }}>{stat.value}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Graphs & Activities */}
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" }}>
                            <Typography variant="h6" mb={3} sx={{ fontWeight: 600 }}>Attendance This Week</Typography>
                            <ResponsiveContainer width={550} height={380}>
                                <BarChart data={attendanceData}>
                                    <XAxis dataKey="day" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="present" fill="#6213FFFF" barSize={35} />
                                </BarChart>
                            </ResponsiveContainer>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                boxShadow: "0px 10px 30px rgba(0,0,0,0.08)",
                                border: "1px solid #eaeaea",
                                backdropFilter: "blur(6px)",
                            }}
                        >
                            {/* Section Header */}
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 700,
                                    mb: 3,
                                    fontSize: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    color: "#333",
                                }}
                            >
                                Recent Activities
                            </Typography>

                            <TableContainer
                                component={Paper}
                                sx={{
                                    width: 620,
                                    height: 390,
                                    boxShadow: "none",
                                    borderRadius: 3,
                                    border: "1px solid #eaeaea",
                                    background: "linear-gradient(135deg, #ffffff 0%, #fafafa 100%)",
                                }}
                            >
                                <Table size="medium" sx={{ borderCollapse: "separate", borderSpacing: "0 8px" }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    color: "#444",
                                                    borderBottom: "none",
                                                    paddingLeft: 2,
                                                }}
                                            >
                                                Activity
                                            </TableCell>

                                            <TableCell
                                                sx={{
                                                    fontWeight: 700,
                                                    fontSize: 14,
                                                    textAlign: "right",
                                                    color: "#444",
                                                    borderBottom: "none",
                                                    paddingRight: 2,
                                                }}
                                            >
                                                Date
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {recentActivities.map((row, idx) => (
                                            <TableRow
                                                key={idx}
                                                sx={{
                                                    backgroundColor: "white",
                                                    borderRadius: 3,
                                                    boxShadow: "0px 2px 10px rgba(0,0,0,0.05)",
                                                    transition: "0.25s",
                                                    "&:hover": {
                                                        backgroundColor: "#f8f8ff",
                                                        transform: "scale(1.01)",
                                                        boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
                                                    },
                                                    "& > *": {
                                                        borderBottom: "none !important",
                                                    },
                                                }}
                                            >
                                                <TableCell
                                                    sx={{
                                                        paddingY: 2,
                                                        paddingLeft: 2,
                                                        fontSize: 14,
                                                        fontWeight: 500,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 1.5,
                                                        color: "#333",
                                                    }}
                                                >
                                                    🟢 {row.activity}
                                                </TableCell>

                                                <TableCell
                                                    sx={{
                                                        paddingY: 2,
                                                        paddingRight: 2,
                                                        textAlign: "right",
                                                        fontSize: 14,
                                                        color: "#666",
                                                        fontWeight: 500,
                                                    }}
                                                >
                                                    {row.date}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Grid>

                </Grid>
            </Box>
        </Box>

    );
}

export default Home;
