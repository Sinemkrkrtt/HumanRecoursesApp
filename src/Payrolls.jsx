import React, { useState, useEffect, useMemo } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button,
    TextField, InputAdornment, Select, MenuItem,
    Table, TableRow, TableCell, TableHead, TableBody,
    IconButton, Dialog, DialogContent, DialogTitle, CircularProgress
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CustomAppBar from "./CustomAppBar";
import DrawerComponent from "./DrawerComponent";

export default function Payrolls() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    // VERİTABANI STATE'LERİ
    const [payrolls, setPayrolls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);

    // Filtreleme State'leri
    const [searchTerm, setSearchTerm] = useState("");
    const [departmentFilter, setDepartmentFilter] = useState("All");

    // 1. Backend'den Veri Çekme
    useEffect(() => {
        fetch('http://localhost:5001/api/payrolls') // Port 5001
            .then(res => res.json())
            .then(data => {
                console.log("Payroll Verisi:", data);
                setPayrolls(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Hata:", err);
                setLoading(false);
            });
    }, []);

    // 2. Filtreleme Mantığı
    const filteredPayrolls = useMemo(() => {
        return payrolls.filter(row => {
            const matchesSearch = row.employee.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDept = departmentFilter === "All" || row.department === departmentFilter;
            return matchesSearch && matchesDept;
        });
    }, [payrolls, searchTerm, departmentFilter]);

    // 3. İstatistik Hesaplama
    const stats = useMemo(() => {
        const totalEmployees = payrolls.length;
        const totalPayroll = payrolls.reduce((acc, curr) => acc + parseFloat(curr.net), 0);
        const pending = payrolls.filter(p => p.status === 'Pending').length;
        const paid = payrolls.filter(p => p.status === 'Paid').length;

        // Para formatı (₺ 1,200,000)
        const formattedTotal = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(totalPayroll);

        return { totalEmployees, totalPayroll: formattedTotal, pending, paid };
    }, [payrolls]);


    return (
        <Box sx={{ mt: 10, p: 4, bgcolor: "#f7f7f7", minHeight: "100vh" }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Payrolls" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/* SUMMARY CARDS */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#6A5ACD", color: "white", width: 200, height: 100, ml: 15, mr: 5 }}>
                        <Typography>Total Employees</Typography>
                        <Typography sx={{ fontSize: 26, fontWeight: 700 }}>{stats.totalEmployees}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#8B07D8", color: "white", width: 200, height: 100, mr: 5 }}>
                        <Typography>Total Payroll</Typography>
                        <Typography sx={{ fontSize: 22, fontWeight: 700 }}>{stats.totalPayroll}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#FF8C00", color: "white", width: 200, height: 100, mr: 5 }}>
                        <Typography>Pending Payments</Typography>
                        <Typography sx={{ fontSize: 26, fontWeight: 700 }}>{stats.pending}</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#28a745", color: "white", width: 200, height: 100, mr: 5 }}>
                        <Typography>Paid This Month</Typography>
                        <Typography sx={{ fontSize: 26, fontWeight: 700 }}>{stats.paid}</Typography>
                    </Card>
                </Grid>
            </Grid>

            {/* FILTER BAR */}
            <Box sx={{ mt: 10, mb: 5, display: "flex", alignItems: "center" }}>
                {/* Search */}
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

                {/* Filters */}
                <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>
                    <Select
                        size="small"
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="All">All Departments</MenuItem>
                        <MenuItem value="IT">IT</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Sales">Sales</MenuItem>
                    </Select>

                    <Button variant="contained" sx={{ bgcolor: "#6A5ACD", borderRadius: 2 }}>
                        Generate Payroll
                    </Button>
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
                                <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Base Salary</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Overtime</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Deductions</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Net</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredPayrolls.map((row, i) => (
                                <TableRow key={i} hover>
                                    <TableCell>{row.employee}</TableCell>
                                    <TableCell>{row.department}</TableCell>
                                    <TableCell>₺{parseFloat(row.base).toLocaleString()}</TableCell>
                                    <TableCell>₺{parseFloat(row.overtime).toLocaleString()}</TableCell>
                                    <TableCell>₺{parseFloat(row.deductions).toLocaleString()}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>₺{parseFloat(row.net).toLocaleString()}</TableCell>

                                    {/* STATUS BADGE */}
                                    <TableCell>
                                        <Typography sx={{
                                            p: "4px 10px", borderRadius: 20, color: "white", width: 100, height: 25,
                                            textAlign: "center", display: "inline-block",
                                            bgcolor: row.status === "Paid" ? "#28a745" :
                                                row.status === "Pending" ? "#FFA500" : "#6A5ACD"
                                        }}>
                                            {row.status}
                                        </Typography>
                                    </TableCell>

                                    {/* ACTIONS */}
                                    <TableCell>
                                        <IconButton onClick={() => setSelected(row)}>
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton>
                                            <PictureAsPdfIcon sx={{ color: "#D11A2A" }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredPayrolls.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={8} align="center">No records found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* DETAILS MODAL */}
            <Dialog open={!!selected} onClose={() => setSelected(null)}>
                {selected && (
                    <>
                        <DialogTitle sx={{ fontWeight: 700 }}>
                            Salary Breakdown – {selected.employee}
                        </DialogTitle>
                        <DialogContent>
                            <Typography>Base Salary: ₺{parseFloat(selected.base).toLocaleString()}</Typography>
                            <Typography>Overtime: ₺{parseFloat(selected.overtime).toLocaleString()}</Typography>
                            <Typography>Deductions: ₺{parseFloat(selected.deductions).toLocaleString()}</Typography>
                            <Typography sx={{ mt: 2, fontWeight: 700 }}>
                                Net Salary: ₺{parseFloat(selected.net).toLocaleString()}
                            </Typography>
                        </DialogContent>
                    </>
                )}
            </Dialog>
        </Box>
    );
}