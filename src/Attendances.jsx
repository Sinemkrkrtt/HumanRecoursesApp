// AttendancePage.jsx
import React, { useState, useMemo } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, TextField, Select, MenuItem,
    Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Paper, IconButton, Tooltip
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, Legend
} from 'recharts';

// örnek attendance verisi
const sampleLogs = [
    { employee: 'Ahmet Yılmaz', department: 'IT', date: '2025-11-24', checkIn: '08:45', checkOut: '17:10', status: 'Present', minutesLate: 15 },
    { employee: 'Ayşe Kuzey', department: 'HR', date: '2025-11-24', checkIn: '09:05', checkOut: '17:00', status: 'Late', minutesLate: 35 },
    { employee: 'Mehmet Talaşoğlu', department: 'Finance', date: '2025-11-24', checkIn: '', checkOut: '', status: 'Absent', minutesLate: 0 },
    { employee: 'Selin Gören', department: 'Marketing', date: '2025-11-24', checkIn: '08:55', checkOut: '16:50', status: 'Present', minutesLate: 5 },
    { employee: 'Can Ahmetoğulları', department: 'Sales', date: '2025-11-24', checkIn: '09:20', checkOut: '17:05', status: 'Late', minutesLate: 50 },
    { employee: 'Burak Demir', department: 'IT', date: '2025-11-23', checkIn: '08:40', checkOut: '17:00', status: 'Present', minutesLate: 0 },
    { employee: 'Derya Kaya', department: 'Finance', date: '2025-11-23', checkIn: '09:10', checkOut: '17:10', status: 'Late', minutesLate: 30 },
    // ... (isteğe göre çoğalt)
];

// küçük yardımcı: tarih formatlama
const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d)) return iso; // eğer string '2025-11-24' ise
    return d.toLocaleDateString();
};

export default function Attendance() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // filtreler
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [department, setDepartment] = useState('All');
    const [query, setQuery] = useState('');

    const [logs, setLogs] = useState(sampleLogs);

    // departman listesi otomatik çıkarılıyor
    const departments = useMemo(() => {
        const setDep = new Set(logs.map(l => l.department));
        return ['All', ...Array.from(setDep)];
    }, [logs]);

    // filtrelenmiş kayıtlar
    const filtered = useMemo(() => {
        return logs.filter(l => {
            // tarih aralığı
            const logDate = new Date(l.date + 'T00:00:00');
            if (fromDate) {
                const f = new Date(fromDate + 'T00:00:00');
                if (logDate < f) return false;
            }
            if (toDate) {
                const t = new Date(toDate + 'T00:00:00');
                if (logDate > t) return false;
            }

            // departman
            if (department !== 'All' && l.department !== department) return false;

            // arama
            const q = query.trim().toLowerCase();
            if (q) {
                const haystack = `${l.employee} ${l.department} ${l.status} ${l.date}`.toLowerCase();
                if (!haystack.includes(q)) return false;
            }

            return true;
        });
    }, [logs, fromDate, toDate, department, query]);

    // quick stats (genel filtreye göre)
    const stats = useMemo(() => {
        const totalEmployees = new Set(logs.map(l => l.employee)).size;
        // today'e göre: kullanıcının seçtiği tarihin toDate yoksa bugünü, yoksa toDate kullan
        const todayISO = toDate || new Date().toISOString().slice(0, 10);
        const todayLogs = logs.filter(l => l.date === todayISO);
        const present = todayLogs.filter(l => l.status === 'Present').length;
        const absent = todayLogs.filter(l => l.status === 'Absent').length;
        const late = todayLogs.filter(l => l.status === 'Late').length;

        // avg check-in (dakika) (sadece present/late olanlar)
        const minutes = todayLogs
            .map(l => l.checkIn)
            .filter(Boolean)
            .map(t => {
                const [hh, mm] = t.split(':').map(Number);
                return hh * 60 + mm;
            });
        const avg = minutes.length ? Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length) : null;
        const avgTime = avg ? `${String(Math.floor(avg / 60)).padStart(2, '0')}:${String(avg % 60).padStart(2, '0')}` : '-';

        return { totalEmployees, present, absent, late, avgTime, todayISO };
    }, [logs, toDate]);

    // chart verisi: gec gelme sayısı (gün bazında) filtered üzerinden create
    const chartData = useMemo(() => {
        // group by date
        const map = {};
        filtered.forEach(l => {
            if (!map[l.date]) map[l.date] = { date: l.date, late: 0, present: 0, absent: 0 };
            if (l.status === 'Late') map[l.date].late += 1;
            if (l.status === 'Present') map[l.date].present += 1;
            if (l.status === 'Absent') map[l.date].absent += 1;
        });
        // sort by date asc
        return Object.values(map).sort((a, b) => (a.date > b.date ? 1 : -1));
    }, [filtered]);

    // CSV export
    const exportCSV = () => {
        const headers = ['Employee', 'Department', 'Date', 'CheckIn', 'CheckOut', 'Status', 'MinutesLate'];
        const rows = filtered.map(r => [r.employee, r.department, r.date, r.checkIn || '-', r.checkOut || '-', r.status, r.minutesLate || 0]);
        const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_export_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // basit edit handler (modal yok, örnek amaçlı güncelleme)
    const handleQuickEdit = (index) => {
        // örnek: toggle absent <-> present
        const updated = [...logs];
        const idxGlobal = logs.indexOf(filtered[index]);
        if (idxGlobal === -1) return;
        updated[idxGlobal].status = updated[idxGlobal].status === 'Absent' ? 'Present' : 'Absent';
        setLogs(updated);
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Attendances" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 2, sm: 4, md: 6 }, pb: 6 }}>
                {/* Filters & Export */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                            size="medium"
                            label="From"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 140, mr: 4, ml: 10, width: 200, }}
                        />
                        <TextField
                            size="medium"
                            label="To"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 140, mr: 4, width: 200, color: 'gray' }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <Select
                            fullWidth
                            size="medıum"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            sx={{ minWidth: 140, mr: 4, width: 200, }}
                        >
                            {departments.map(dep => (
                                <MenuItem key={dep} value={dep}>{dep}</MenuItem>
                            ))}
                        </Select>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            size="medium"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            InputProps={{
                                startAdornment: <SearchIcon sx={{ mr: 4, color: '#6A5ACD', width: 60, height: 20 }} />
                            }}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} md={2} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                        <Button
                            variant="contained"
                            startIcon={<FileDownloadIcon />}
                            onClick={exportCSV}
                            sx={{ bgcolor: '#9B36E8FF', width: 160, height: 40, ml: 4 }}
                        >
                            Export CSV
                        </Button>
                    </Grid>
                </Grid>

                {/* Quick Stats */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#A242EBFF', color: '#fff', width: 200, height: 150, ml: 18, justifyContent: 'center', textAlign: 'center' }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14, fontWeight: 900 }}>TOTAL EMPLOYEES</Typography>
                                <Typography sx={{ fontSize: 28, fontWeight: 600, mt: 3 }}>{stats.totalEmployees}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#6A5ACD', color: '#fff', width: 200, height: 150, ml: 5, justifyContent: 'center', textAlign: 'center' }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14, fontWeight: 900 }}>PRESENT  ({stats.todayISO})</Typography>
                                <Typography sx={{ fontSize: 28, fontWeight: 600, mt: 3 }}>{stats.present}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#682188FF', color: '#fff', width: 200, height: 150, ml: 5, justifyContent: 'center', textAlign: 'center' }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14, fontWeight: 900, }}>ABSENT</Typography>
                                <Typography sx={{ fontSize: 28, fontWeight: 600, mt: 3 }}>{stats.absent}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#3C0468FF', color: '#fff', width: 200, height: 150, ml: 5, justifyContent: 'center', textAlign: 'center' }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 12, fontWeight: 900, }}>LATE</Typography>
                                <Typography sx={{ fontSize: 20, fontWeight: 600, mt: 3 }}>{stats.late}</Typography>
                                <Typography sx={{ fontSize: 12, mt: 1 }}>Avg Check-in: {stats.avgTime}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Chart + Recent Logs */}
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{ p: 2, borderRadius: 3, boxShadow: "0px 8px 20px rgba(0,0,0,0.08)" }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Late Arrivals (filtered)</Typography>
                            <Box sx={{ mr: 15, height: 380, width: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="date" tickFormatter={(d) => d} />
                                        <YAxis />
                                        <ReTooltip />
                                        <Legend />
                                        <Bar dataKey="late" name="Late" barSize={18} fill="#FFA500" />
                                        <Bar dataKey="present" name="Present" barSize={18} fill="#6A5ACD" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: 430, width: 770, p: 2, borderRadius: 3, boxShadow: "0px 8px 20px rgba(0,0,0,0.08)" }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Recent Attendance Logs</Typography>

                            <TableContainer component={Paper} sx={{ boxShadow: 'none', maxHeight: 380 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Check-in</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Check-out</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 700, textAlign: 'center' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filtered.slice(0, 50).map((r, i) => (
                                            <TableRow key={i} hover>
                                                <TableCell>{r.employee}</TableCell>
                                                <TableCell>{r.department}</TableCell>
                                                <TableCell>{r.date}</TableCell>
                                                <TableCell>{r.checkIn || '-'}</TableCell>
                                                <TableCell>{r.checkOut || '-'}</TableCell>
                                                <TableCell>
                                                    <Box component="span" sx={{
                                                        px: 1.1, py: 0.4, borderRadius: 1.2,
                                                        bgcolor: r.status === 'Approved' || r.status === 'Present' ? '#E8F6EE' :
                                                            r.status === 'Late' ? '#FFF4E5' : '#FDECEF',
                                                        color: r.status === 'Present' ? '#20724A' : r.status === 'Late' ? '#A46A00' : '#A12F2F',
                                                        fontWeight: 700,
                                                        fontSize: 12
                                                    }}>{r.status}</Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Tooltip title="Quick toggle absent/present (example)">
                                                        <IconButton size="small" onClick={() => handleQuickEdit(i)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {filtered.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center" sx={{ color: '#777', py: 4 }}>
                                                    No records found.
                                                </TableCell>
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
