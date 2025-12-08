import React, { useState, useEffect, useMemo } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button,
    TextField, InputAdornment, Select, MenuItem,
    Table, TableRow, TableCell, TableHead, TableBody,
    IconButton, Dialog, DialogContent, DialogTitle, CircularProgress,
    Divider, Chip
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from '@mui/icons-material/Close';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import CustomAppBar from "./CustomAppBar";
import DrawerComponent from "./DrawerComponent";

// PDF Kütüphaneleri
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Payrolls() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // VERİTABANI STATE'LERİ
    const [payrolls, setPayrolls] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    // Filtreleme State'leri
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All");

    // 1. Verileri Backend'den Çekme (Hem Payroll Hem Employee)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [payrollRes, empRes] = await Promise.all([
                    fetch('http://localhost:5001/api/payrolls'),
                    fetch('http://localhost:5001/api/employees')
                ]);

                const payrollData = await payrollRes.json();
                const empData = await empRes.json();

                setPayrolls(payrollData);
                setEmployees(empData);
            } catch (err) {
                console.error("Hata:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // **YENİ:** Çalışan listesinden departmanları otomatik çıkarma
    const departments = useMemo(() => {
        const setDep = new Set(employees.map(e => e.department).filter(Boolean)); // Boş değerleri filtrele
        return ['All', ...Array.from(setDep).sort()];
    }, [employees]);


    // 2. Veri Birleştirme (Merge) ve Filtreleme
    const processedPayrolls = useMemo(() => {
        // Tüm çalışanları dön, payroll kaydı varsa onu al, yoksa varsayılan oluştur.
        const mergedList = employees.map(emp => {
            // İsim eşleşmesi veya ID eşleşmesi (Burada isim üzerinden gidiyoruz, ID varsa daha sağlıklı olur)
            const fullName = `${emp.first_name} ${emp.last_name}`;
            const existingPayroll = payrolls.find(p => p.employee === fullName || p.employee_id === emp.id);

            if (existingPayroll) {
                return { ...existingPayroll, department: emp.department }; // Departmanı güncel tut
            } else {
                // Payroll kaydı olmayan YENİ ÇALIŞAN
                return {
                    id: `temp-${emp.id}`,
                    employee: fullName,
                    department: emp.department,
                    base: 0,
                    overtime: 0,
                    deductions: 0,
                    net: 0,
                    status: 'Unset' // Yeni statü
                };
            }
        });

        // Filtreleme
        return mergedList.filter(row => {
            const matchesSearch = row.employee.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = departmentFilter === "All" || row.department === departmentFilter;
            return matchesSearch && matchesDept;
        });
    }, [payrolls, employees, searchTerm, departmentFilter]);

    // 3. İstatistik Hesaplama
    const stats = useMemo(() => {
        const totalEmployees = processedPayrolls.length;
        const totalPayroll = processedPayrolls.reduce((acc, curr) => acc + (parseFloat(curr.net) || 0), 0);
        const pending = processedPayrolls.filter(p => p.status === 'Pending' || p.status === 'Unset').length;
        const paid = processedPayrolls.filter(p => p.status === 'Paid').length;

        const formattedTotal = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalPayroll);

        return { totalEmployees, totalPayroll: formattedTotal, pending, paid };
    }, [processedPayrolls]);

    // 4. PDF Oluşturma Fonksiyonu
    const handleDownloadPDF = (row) => {
        const doc = new jsPDF();

        // Başlık
        doc.setFontSize(18);
        doc.text("MAAS BORDROSU (PAYSLIP)", 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.text(`Employee: ${row.employee}`, 14, 40);
        doc.text(`Department: ${row.department}`, 14, 48);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 56);
        doc.text(`Status: ${row.status}`, 150, 40);

        // Tablo Oluşturma
        doc.autoTable({
            startY: 70,
            head: [['Description', 'Amount (TRY)']],
            body: [
                ['Base Salary', parseFloat(row.base || 0).toLocaleString()],
                ['Overtime', parseFloat(row.overtime || 0).toLocaleString()],
                ['Deductions', `-${parseFloat(row.deductions || 0).toLocaleString()}`],
                ['NET SALARY', parseFloat(row.net || 0).toLocaleString()]
            ],
            theme: 'grid',
            headStyles: { fillColor: [106, 90, 205] }, // Mor renk
        });

        // Alt Bilgi
        doc.setFontSize(10);
        doc.text("This document is automatically generated.", 105, 280, null, null, "center");

        doc.save(`${row.employee}_Payslip.pdf`);
    };

    return (
        <Box sx={{ mt: 10, p: 4, bgcolor: "#f7f7f7", minHeight: "100vh" }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Payrolls" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/* SUMMARY CARDS */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#C673F9FF", color: "white", width: 220, height: 110, ml: 10, mr: 5 }}>
                        <Typography sx={{ letterSpacing: 0.5, fontWeight: 600, fontSize: 18, justifyContent: 'center', textAlign: 'center', mb: 1, mt: 2 }}>Total Employees</Typography>
                        <Typography sx={{ justifyContent: 'center', textAlign: 'center', fontSize: 28, fontWeight: 700 }}>{stats.totalEmployees}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#8B07D8", color: "white", width: 220, height: 110, mr: 5 }}>
                        <Typography sx={{ letterSpacing: 0.5, fontWeight: 600, fontSize: 18, justifyContent: 'center', textAlign: 'center', mb: 1, mt: 2 }}>Total Payroll</Typography>
                        <Typography sx={{ justifyContent: 'center', textAlign: 'center', fontSize: 26, fontWeight: 700 }}>{stats.totalPayroll}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#FF8C00", color: "white", width: 220, height: 110, mr: 5 }}>
                        <Typography sx={{ letterSpacing: 0.5, fontWeight: 600, fontSize: 18, justifyContent: 'center', textAlign: 'center', mb: 1, mt: 2 }}>Pending / Unset</Typography>
                        <Typography sx={{ justifyContent: 'center', textAlign: 'center', fontSize: 28, fontWeight: 700 }}>{stats.pending}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#28a745", color: "white", width: 220, height: 110, mr: 5 }}>
                        <Typography sx={{ letterSpacing: 0.5, fontWeight: 600, fontSize: 18, justifyContent: 'center', textAlign: 'center', mb: 1, mt: 2 }}>Paid This Month</Typography>
                        <Typography sx={{ justifyContent: 'center', textAlign: 'center', fontSize: 28, fontWeight: 700 }}>{stats.paid}</Typography>
                    </Card>
                </Grid>
            </Grid>

            {/* FILTER BAR */}
            <Box sx={{ mt: 10, mb: 5, display: "flex", alignItems: "center" }}>
                <TextField
                    placeholder="Search Employee"
                    size="small"
                    variant="standard"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 250, borderColor: "#7713BAFF" }}
                    InputProps={{
                        startAdornment: (<InputAdornment position="start"><SearchIcon sx={{ color: "#C43CFFFF" }} /></InputAdornment>)
                    }}
                />

                <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
                    <Select
                        size="small"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        sx={{ width: 200 }}
                    >
                        {/* Dinamik Departman Listesi */}
                        {departments.map((dep) => (
                            <MenuItem key={dep} value={dep}>
                                {dep === 'All' ? 'All Departments' : dep}
                            </MenuItem>
                        ))}
                    </Select>
                    {/* Buton kaldırıldı */}
                </Box>
            </Box>

            {/* PAYROLL TABLE */}
            <Card sx={{ borderRadius: 3, p: 2 }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" p={3}><CircularProgress /></Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: 700, justifyContent: 'center', textAlign: 'center', fontSize: 16 }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Base Salary</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Overtime</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Deductions</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Net</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700, fontSize: 16 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {processedPayrolls.map((row, i) => (
                                <TableRow key={i} hover>
                                    <TableCell>{row.employee}</TableCell>
                                    <TableCell sx={{ justifyContent: 'center', textAlign: 'center' }}>{row.department}</TableCell>
                                    <TableCell>₺{parseFloat(row.base || 0).toLocaleString()}</TableCell>
                                    <TableCell sx={{ color: 'green' }}>+₺{parseFloat(row.overtime || 0).toLocaleString()}</TableCell>
                                    <TableCell sx={{ color: 'red' }}>-₺{parseFloat(row.deductions || 0).toLocaleString()}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>₺{parseFloat(row.net || 0).toLocaleString()}</TableCell>

                                    {/* STATUS BADGE */}
                                    <TableCell>
                                        <Chip
                                            label={row.status}
                                            size="small"
                                            sx={{
                                                bgcolor: row.status === "Paid" ? "#28a745" :
                                                    row.status === "Pending" ? "#FFA500" :
                                                        "#4998FFFF", // Unset için gri
                                                color: "white",
                                                fontWeight: 500,
                                                minWidth: 100
                                            }}
                                        />
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell>
                                        <IconButton onClick={() => setSelected(row)} size="small" sx={{ color: '#898989FF' }}>
                                            <VisibilityIcon />
                                        </IconButton>

                                    </TableCell>
                                </TableRow>
                            ))}
                            {processedPayrolls.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">No records found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* PROFESSIONAL DETAILS MODAL */}
            <Dialog
                open={!!selected}
                onClose={() => setSelected(null)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: 3, p: 0, overflow: 'hidden' } // Header'ı full width yapmak için padding sıfırlandı
                }}
            >
                {selected && (
                    <Box>
                        {/* Header */}
                        <Box sx={{
                            bgcolor: '#6A5ACD',
                            color: 'white',
                            p: 3,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>SALARY SLIP</Typography>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>Employee ID: {selected.id}</Typography>
                            </Box>
                            <IconButton onClick={() => setSelected(null)} sx={{ color: 'white' }}>
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        <DialogContent sx={{ p: 4 }}>

                            {/* Employee Info */}

                            <Grid container spacing={2} sx={{ mb: 4 }}>

                                <Grid item xs={6}>

                                    <Typography sx={{ mr: 4, mb: 1 }} variant="subtitle2" color="text.secondary">Employee Name</Typography>

                                    <Typography sx={{ mr: 4, justifyContent: 'center', textAlign: 'center' }} variant="body1" fontWeight={600}>{selected.employee}</Typography>

                                </Grid>

                                <Grid item xs={6} sx={{ textAlign: 'right' }}>

                                    <Typography sx={{ mr: 4, mb: 1 }} variant="subtitle2" color="text.secondary">Department</Typography>

                                    <Typography sx={{ mr: 4, justifyContent: 'center', textAlign: 'center' }} variant="body1" fontWeight={600}>{selected.department}</Typography>

                                </Grid>

                                <Grid item xs={6}>

                                    <Typography sx={{ mr: 4, mb: 1 }} variant="subtitle2" color="text.secondary">Payment Status</Typography>



                                    <Chip sx={{ mr: 4, justifyContent: 'center', textAlign: 'center' }} label={selected.status} size="small" color={selected.status === 'Paid' ? 'success' : 'warning'} variant="outlined" />

                                </Grid>

                                <Grid item xs={6} sx={{ textAlign: 'right' }}>

                                    <Typography sx={{ mr: 4, mb: 1 }} variant="subtitle2" color="text.secondary">Pay Date</Typography>

                                    <Typography sx={{ mr: 4, justifyContent: 'center', textAlign: 'center' }} variant="body1">{new Date().toLocaleDateString()}</Typography>

                                </Grid>

                            </Grid>
                            <Divider sx={{ mb: 3 }}>EARNINGS</Divider>

                            {/* Earnings Section */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography color="text.secondary">Base Salary</Typography>
                                <Typography fontWeight={500}>₺{parseFloat(selected.base || 0).toLocaleString()}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography color="text.secondary">Overtime</Typography>
                                <Typography fontWeight={500} color="success.main">+ ₺{parseFloat(selected.overtime || 0).toLocaleString()}</Typography>
                            </Box>

                            <Divider sx={{ mb: 3 }}>DEDUCTIONS</Divider>

                            {/* Deductions Section */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography color="text.secondary">Tax & Deductions</Typography>
                                <Typography fontWeight={500} color="error.main">- ₺{parseFloat(selected.deductions || 0).toLocaleString()}</Typography>
                            </Box>

                            {/* Total Net */}
                            <Card sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <MonetizationOnIcon color="primary" />
                                    <Typography variant="h6" fontWeight={700} color="text.primary">NET PAY</Typography>
                                </Box>
                                <Typography variant="h5" fontWeight={800} color="#010008FF">
                                    ₺{parseFloat(selected.net || 0).toLocaleString()}
                                </Typography>
                            </Card>

                            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<PictureAsPdfIcon />}
                                    onClick={() => handleDownloadPDF(selected)}
                                    sx={{
                                        width: 220,
                                        height: 35,
                                        color: '#D11A2A',
                                        borderColor: '#D11A2A',
                                        '&:hover': { borderColor: '#b71c1c', bgcolor: '#E6B6BDFF' }
                                    }}
                                >
                                    Download PDF Slip
                                </Button>
                            </Box>
                        </DialogContent>
                    </Box>
                )}
            </Dialog>
        </Box>
    );
}