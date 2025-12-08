import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ApartmentIcon from '@mui/icons-material/Apartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useNavigate } from 'react-router';



function Home() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const navigate = useNavigate();

    // State'ler
    const [employeeCount, setEmployeeCount] = useState(0);
    const [departmentCount, setDepartmentCount] = useState(0);
    const [pendingLeaves, setPendingLeaves] = useState(0);
    const [payroll, setPayroll] = useState(0);
    const [attendanceData, setAttendanceData] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Backend'den tüm dashboard verilerini tek seferde çekiyoruz
        fetch("http://localhost:5001/api/home-stats")
            .then(res => res.json())
            .then(data => {
                console.log("Dashboard Verisi:", data);

                // Sayıları yerleştir
                setEmployeeCount(data.employees);
                setDepartmentCount(data.departments);
                setPendingLeaves(data.pendingLeaves);
                setPayroll(data.payroll);

                // Grafik verisi (Attendance tablosundan geliyor)
                setAttendanceData(data.attendance);

                // Aktiviteler (Announcements tablosundan geliyor)
                setRecentActivities(data.activities);

                setLoading(false);
            })
            .catch(err => {
                console.error("Hata:", err);
                setLoading(false);
            });
    }, []);

    const stats = [
        { title: "Employees", value: employeeCount, icon: <PeopleIcon sx={{ fontSize: 50 }} />, color: "#A242EBFF", path: "/employees" },
        { title: "Departments", value: departmentCount, icon: <ApartmentIcon sx={{ fontSize: 50 }} />, color: "#7D39D6FF", path: "/departments" },
        { title: "Pending Leaves", value: pendingLeaves, icon: <AccessTimeIcon sx={{ fontSize: 50 }} />, color: "#682188FF", path: "/attendances" },
        { title: "Payroll", value: payroll ? `₺${Number(payroll).toLocaleString()}` : "₺0", icon: <AttachMoneyIcon sx={{ fontSize: 50 }} />, color: "#360E56FF", path: "/payrolls" },
    ];


    // Tarih formatlamak için yardımcı fonksiyon
    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString('tr-TR');
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Home" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 2, sm: 3, md: 6 } }}>

                <Grid container spacing={4} mb={4}>
                    {stats.map((stat) => (
                        <Grid item xs={12} sm={6} md={3} key={stat.title}>
                            <Card
                                onClick={() => navigate(stat.path)}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    bgcolor: stat.color,
                                    color: '#fff',
                                    height: 210,
                                    width: 300,
                                    borderRadius: 3,
                                    boxShadow: "0px 8px 20px rgba(0,0,0,0.15)",
                                    transition: "all 0.25s ease",
                                    cursor: "pointer",
                                    '&:hover': {
                                        transform: "scale(1.05)",
                                        boxShadow: "0px 12px 25px rgba(0,0,0,0.25)"
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                                    <Typography sx={{ fontSize: 19, marginBottom: 1, fontWeight: 600 }}>{stat.title}</Typography>
                                    <Typography sx={{ fontSize: 32, fontWeight: 500 }}>
                                        {loading ? "..." : stat.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Attendance Chart + Recent Activities */}
                <Grid container spacing={4}>

                    {/* SOL: Attendance Chart (Veritabanından Gelen Veri) */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" }}>
                            <Typography variant="h6" mb={3} sx={{ fontWeight: 600 }}>Attendance This Week</Typography>

                            {loading ? (
                                <Box display="flex" justifyContent="center" alignItems="center" height="380px"><CircularProgress /></Box>
                            ) : (
                                <ResponsiveContainer width={550} height={380}>
                                    <BarChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#777', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            domain={[0, 150]} // Üst sınır 150
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#777', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(240, 240, 240, 0.4)' }}
                                            contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }}
                                        />
                                        {/* Backend 'present' verisi gönderiyor */}
                                        <Bar dataKey="present" name="Present" fill="#4000FFFF" barSize={35} radius={[10, 10, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </Card>
                    </Grid>

                    {/* SAĞ: Recent Activities (Announcements Tablosundan) */}
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
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: 20 }}>
                                Recent Activities
                            </Typography>

                            <TableContainer
                                component={Paper}
                                sx={{
                                    width: 620,
                                    height: 390,
                                    borderRadius: 3,
                                    border: "1px solid #eaeaea",
                                    boxShadow: 'none'
                                }}
                            >
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>Activity</TableCell>
                                            <TableCell sx={{ fontWeight: 700, textAlign: "right" }}>Date</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {!loading && recentActivities.map((item, idx) => (
                                            <TableRow key={idx}>
                                                {/* item.title: Announcements tablosundaki başlık */}
                                                <TableCell sx={{ height: 30, }}>🟢 {item.title}</TableCell>
                                                <TableCell sx={{ textAlign: "right" }}>{formatDate(item.date)}</TableCell>
                                            </TableRow>
                                        ))}
                                        {recentActivities.length === 0 && !loading && (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center" sx={{ color: '#999', py: 4 }}>No recent activities</TableCell>
                                            </TableRow>
                                        )}
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