import React, { useState, useMemo, useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, TextField, Select, MenuItem,
    Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
    Paper, IconButton, Tooltip, CircularProgress
} from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';
import {
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, Legend
} from 'recharts';

export default function Attendances() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // filtreler
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [department, setDepartment] = useState('All');
    const [query, setQuery] = useState('');

    // VERİTABANI BAĞLANTISI İÇİN STATE'LER
    const [logs, setLogs] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Verileri Backend'den Çekme
    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [logsRes, empRes] = await Promise.all([
                fetch('http://localhost:5001/api/attendance'),
                fetch('http://localhost:5001/api/employees')
            ]);

            const logsData = await logsRes.json();
            const empData = await empRes.json();

            setLogs(logsData);

            const formattedEmployees = empData.map(e => ({
                ...e,
                fullName: `${e.first_name} ${e.last_name}`
            }));
            setEmployees(formattedEmployees);

        } catch (err) {
            console.error("Veri çekme hatası:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    // Departman listesi
    const departments = useMemo(() => {
        // Departmanları artık tüm çalışan listesinden çekiyoruz ki henüz logu olmayan departmanlar da gelsin
        const setDep = new Set(employees.map(e => e.department));
        return ['All', ...Array.from(setDep)];
    }, [employees]);

    // --- ÖNEMLİ: HEDEF TARİH BELİRLEME ---
    // Tabloda "Absent"leri göstermek için spesifik bir güne bakmalıyız.
    // Kullanıcı tarih seçtiyse onu, seçmediyse en son veri olan günü alıyoruz.
    const targetDate = useMemo(() => {
        if (toDate) return toDate;
        const dates = [...new Set(logs.map(l => l.date))].sort().reverse();
        return dates.length > 0 ? dates[0] : new Date().toISOString().slice(0, 10);
    }, [logs, toDate]);


    // --- TABLO VERİSİ (BİRLEŞTİRİLMİŞ LİSTE) ---
    // Burası değişti: Artık Logs değil, Employees üzerinden dönüyoruz.
    const filteredLogs = useMemo(() => {
        // 1. Hedef tarihteki mevcut logları bul
        const daysLogs = logs.filter(l => l.date === targetDate);

        // Hızlı erişim için logları isme göre haritala
        const logMap = new Map(daysLogs.map(l => [l.employee, l]));

        // 2. Tüm çalışanları dön ve listeyi oluştur
        let mergedList = employees.map(emp => {
            const log = logMap.get(emp.fullName);

            if (log) {
                // Kaydı varsa olduğu gibi döndür
                return log;
            } else {
                // Kaydı yoksa "Absent" olarak oluştur (Tabloda gözükmesi için)
                return {
                    id: `temp-${emp.id}`, // Geçici ID
                    employee: emp.fullName,
                    department: emp.department,
                    date: targetDate,
                    checkIn: null,   // Henüz giriş yok
                    checkOut: null,  // Henüz çıkış yok
                    status: 'Absent',
                    minutesLate: 0
                };
            }
        });

        // 3. Filtreleri Uygula (Departman ve Arama)
        if (department !== 'All') {
            mergedList = mergedList.filter(l => l.department === department);
        }

        if (query) {
            const q = query.toLowerCase();
            mergedList = mergedList.filter(l =>
                l.employee.toLowerCase().includes(q) ||
                l.status.toLowerCase().includes(q) ||
                l.department.toLowerCase().includes(q)
            );
        }

        return mergedList;
    }, [logs, employees, targetDate, department, query]);


    // --- İSTATİSTİKLER ---
    // Artık filteredLogs içinde herkes (Absent dahil) olduğu için direkt oradan sayabiliriz.
    const stats = useMemo(() => {
        const totalEmployees = employees.length; // Toplam çalışan sayısı sabit

        // filteredLogs o günün tam listesidir (Filtre uygulanmamış halini hesaplamak daha doğru olurdu ama 
        // tasarımda genelde filtreye göre sayıların değişmesi istenir, o yüzden filteredLogs kullanıyoruz)
        // Ancak üstteki kartlarda genelde "Tüm Şirket" durumu istenir.
        // Doğrusu: O günün tüm listesi üzerinden hesaplamak.

        // Kartlar için filtrelerden bağımsız o günün tam özetini çıkaralım:
        const daysLogs = logs.filter(l => l.date === targetDate);
        const logMap = new Map(daysLogs.map(l => [l.employee, l]));

        let present = 0, absent = 0, late = 0, checkInTimes = [];

        employees.forEach(emp => {
            const log = logMap.get(emp.fullName);
            if (log) {
                if (log.status === 'Present') present++;
                else if (log.status === 'Late') late++;
                else absent++; // Logu var ama Absent ise

                if (log.checkIn) checkInTimes.push(log.checkIn);
            } else {
                absent++; // Logu yoksa Absent
            }
        });

        // Ortalama saat hesabı
        const minutes = checkInTimes.map(t => {
            const [hh, mm] = t.split(':').map(Number);
            return hh * 60 + mm;
        });
        const avg = minutes.length ? Math.round(minutes.reduce((a, b) => a + b, 0) / minutes.length) : null;
        const avgTime = avg
            ? `${String(Math.floor(avg / 60)).padStart(2, '0')}:${String(avg % 60).padStart(2, '0')}`
            : '-';

        return { totalEmployees, present, absent, late, avgTime, todayISO: targetDate };
    }, [logs, employees, targetDate]);


    // --- GRAFİK VERİSİ ---
    // Grafik geçmişi göstermeli, tablo ise bugünü gösteriyor. O yüzden ayırdık.
    const chartData = useMemo(() => {
        // Eğer tarih aralığı (From) seçildiyse ona göre filtrele
        let historyLogs = logs;
        if (fromDate) {
            historyLogs = logs.filter(l => l.date >= fromDate);
        }

        const map = {};
        historyLogs.forEach(l => {
            if (!map[l.date]) map[l.date] = { date: l.date, late: 0, present: 0, absent: 0 };
            if (l.status === 'Late') map[l.date].late += 1;
            if (l.status === 'Present') map[l.date].present += 1;
            if (l.status === 'Absent') map[l.date].absent += 1;
        });

        // Tarihe göre sırala ve son 7 günü al (veya filtreye uyanları)
        return Object.values(map).sort((a, b) => (a.date > b.date ? 1 : -1));
    }, [logs, fromDate]);


    // CSV export (Artık ekrandaki tabloyu indirir - Absentler dahil)
    const exportCSV = () => {
        const headers = ['Employee', 'Department', 'Date', 'CheckIn', 'CheckOut', 'Status', 'MinutesLate'];
        const rows = filteredLogs.map(r => [r.employee, r.department, r.date, r.checkIn || '-', r.checkOut || '-', r.status, r.minutesLate || 0]);
        const csv = [headers, ...rows].map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attendance_export_${targetDate}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Quick Edit Handler
    const handleQuickEdit = (index) => {
        const item = filteredLogs[index];
        const newStatus = item.status === 'Absent' ? 'Present' : 'Absent';

        // UI'da anında güncelle (Optimistic Update)
        // Not: Bu sadece görüntüde günceller. Eğer kayıt 'temp' ise (yeni çalışansa)
        // backend'de henüz ID'si yoktur, bu yüzden PUT isteği hata verebilir.
        // Tam çözüm için backend'e POST isteği atmak gerekir ama şimdilik UI'ı güncelliyoruz.

        // Eğer gerçek bir log ise (temp değilse)
        if (!String(item.id).startsWith('temp-')) {
            const updatedLogs = logs.map(l => l.id === item.id ? { ...l, status: newStatus } : l);
            setLogs(updatedLogs);

            fetch(`http://localhost:5001/api/attendance/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            }).catch(err => console.error("Güncelleme hatası", err));
        } else {
            // Eğer bu geçici (temp) bir kayıtsa, kullanıcıya bilgi verelim veya
            // sadece localde 'logs' arrayine sahte bir ekleme yapıp günü kurtarabiliriz.
            alert("Bu çalışan için henüz veritabanı kaydı oluşturulmamış. (Backend'e POST işlemi gereklidir)");
        }
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Attendances" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 2, sm: 4, md: 6 }, pb: 6 }}>
                {/* Filters & Export */}
                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1, mb: 2 }}>
                        {/* Tasarım bozulmasın diye From ve To inputlarını korudum */}
                        {/* Ancak Tablo artık tek bir günü (To Date veya En son gün) gösteriyor */}
                        <TextField
                            size="medium"
                            label="From (Chart)"
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                            sx={{ minWidth: 140, mr: 4, ml: 10, width: 200, }}
                        />
                        <TextField
                            size="medium"
                            label="Date View" // Etiketi mantıklı olsun diye değiştirdim
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
                            size="medium"
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

                {loading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}

                {/* Quick Stats */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#A242EBFF', color: '#fff', width: 200, height: 150, ml: 18, mb: 1, justifyContent: 'center', textAlign: 'center' }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14, fontWeight: 900 }}>TOTAL EMPLOYEES</Typography>
                                <Typography sx={{ fontSize: 28, fontWeight: 600, mt: 3 }}>{stats.totalEmployees}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#6A5ACD', color: '#fff', width: 200, height: 150, ml: 5, justifyContent: 'center', textAlign: 'center', mb: 1, }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14, fontWeight: 900 }}>PRESENT  ({stats.todayISO})</Typography>
                                <Typography sx={{ fontSize: 28, fontWeight: 600, mt: 3 }}>{stats.present}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#682188FF', color: '#fff', width: 200, height: 150, ml: 5, justifyContent: 'center', textAlign: 'center', mb: 1, }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 14, fontWeight: 900, }}>ABSENT</Typography>
                                <Typography sx={{ fontSize: 28, fontWeight: 600, mt: 3 }}>{stats.absent}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Card sx={{ bgcolor: '#3C0468FF', color: '#fff', width: 200, height: 150, ml: 5, justifyContent: 'center', textAlign: 'center', mb: 1, }}>
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
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Attendance Overview (Last 7 Days)</Typography>
                            <Box sx={{ mr: 15, height: 360, width: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                                        <YAxis />
                                        <ReTooltip />
                                        <Legend />
                                        <Bar dataKey="late" name="Late" barSize={18} fill="#FFA500" />
                                        <Bar dataKey="present" name="Present" barSize={18} fill="#6A5ACD" />
                                        <Bar dataKey="absent" name="Absent" barSize={18} fill="#D32F2F" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card sx={{ height: 400, width: 770, p: 2, borderRadius: 3, boxShadow: "0px 8px 20px rgba(0,0,0,0.08)" }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Daily Attendance Logs ({targetDate})</Typography>

                            <TableContainer component={Paper} sx={{ boxShadow: 'none', maxHeight: 360 }}>
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
                                        {filteredLogs.slice(0, 50).map((r, i) => (
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
                                                    <Tooltip title="Quick toggle Absent/Present">
                                                        <IconButton size="small" onClick={() => handleQuickEdit(i)}>
                                                            <EditIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}

                                        {filteredLogs.length === 0 && (
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