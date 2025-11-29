import React, { useState } from "react";
import {
    Box, Grid, Card, CardContent, Typography, Button,
    TextField, InputAdornment, Select, MenuItem,
    Table, TableRow, TableCell, TableHead, TableBody,
    IconButton, Dialog, DialogContent, DialogTitle
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CustomAppBar from "./CustomAppBar";
import DrawerComponent from "./DrawerComponent";

export default function Payrolls() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const payrollData = [
        {
            employee: "Ahmet Yılmaz",
            department: "IT",
            base: 40000,
            overtime: 2500,
            deductions: 1200,
            net: 41300,
            status: "Paid"
        },
        {
            employee: "Selin Gören",
            department: "Marketing",
            base: 36000,
            overtime: 0,
            deductions: 950,
            net: 35050,
            status: "Pending"
        },
        {
            employee: "Mehmet Talaşoğlu",
            department: "Finance",
            base: 42000,
            overtime: 3200,
            deductions: 1100,
            net: 44100,
            status: "Processing"
        }
    ];

    const [selected, setSelected] = useState(null);

    return (
        <Box sx={{ mt: 10, p: 4, bgcolor: "#f7f7f7", minHeight: "100vh" }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Payrolls" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            {/* SUMMARY CARDS */}
            <Grid container spacing={3}>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#6A5ACD", color: "white", width: 200, height: 100, ml: 15, mr: 5 }}>
                        <Typography>Total Employees</Typography>
                        <Typography sx={{ fontSize: 26, fontWeight: 700 }}>25</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#8B07D8", color: "white", width: 200, height: 100, mr: 5 }}>
                        <Typography>Total Payroll</Typography>
                        <Typography sx={{ fontSize: 26, fontWeight: 700 }}>₺ 1,050,000</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#FF8C00", color: "white", width: 200, height: 100, mr: 5 }}>
                        <Typography>Pending Payments</Typography>
                        <Typography sx={{ fontSize: 26, fontWeight: 700 }}>4</Typography>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ p: 2, borderRadius: 3, backgroundColor: "#28a745", color: "white", width: 200, height: 100, mr: 5 }}>
                        <Typography>Paid This Month</Typography>
                        <Typography sx={{ fontSize: 26, fontWeight: 700 }}>21</Typography>
                    </Card>
                </Grid>

            </Grid>

            {/* FILTER BAR */}
            <Box sx={{ mt: 10, mb: 5, display: "flex", alignItems: "center" }}>

                {/* LEFT - Search */}
                <TextField
                    placeholder="Search Employee"
                    size="small"
                    variant="standard"
                    sx={{ width: 250, borderColor: "#7713BAFF" }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ color: "#C43CFFFF" }} />
                            </InputAdornment>
                        )
                    }}
                />

                {/* RIGHT GROUP */}
                <Box sx={{ ml: "auto", display: "flex", gap: 2 }}>

                    <Select size="small" defaultValue="All" sx={{ width: 200 }}>
                        <MenuItem value="All">All Departments</MenuItem>
                        <MenuItem value="IT">IT</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="Finance">Finance</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                    </Select>

                    <Select size="small" defaultValue="January" sx={{ width: 200 }}>
                        <MenuItem value="January">January</MenuItem>
                        <MenuItem value="February">February</MenuItem>
                        <MenuItem value="March">March</MenuItem>
                    </Select>

                    <Button
                        variant="contained"
                        sx={{ bgcolor: "#6A5ACD", borderRadius: 2 }}
                    >
                        Generate Payroll
                    </Button>

                </Box>

            </Box>


            {/* PAYROLL TABLE */}
            <Card sx={{ borderRadius: 3, p: 2 }}>
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
                        {payrollData.map((row, i) => (
                            <TableRow key={i} hover>

                                <TableCell>{row.employee}</TableCell>
                                <TableCell>{row.department}</TableCell>
                                <TableCell>₺{row.base}</TableCell>
                                <TableCell>₺{row.overtime}</TableCell>
                                <TableCell>₺{row.deductions}</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>₺{row.net}</TableCell>

                                {/* STATUS BADGE */}
                                <TableCell>
                                    <Typography sx={{
                                        p: "4px 10px",
                                        borderRadius: 20,
                                        color: "white",
                                        width: 100,
                                        height: 25,
                                        textAlign: "center",
                                        display: "inline-block",
                                        bgcolor:
                                            row.status === "Paid"
                                                ? "#28a745"
                                                : row.status === "Pending"
                                                    ? "#FFA500"
                                                    : "#6A5ACD"
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
                    </TableBody>
                </Table>
            </Card>

            {/* DETAILS MODAL */}
            <Dialog open={!!selected} onClose={() => setSelected(null)}>
                {selected && (
                    <>
                        <DialogTitle sx={{ fontWeight: 700 }}>
                            Salary Breakdown – {selected.employee}
                        </DialogTitle>
                        <DialogContent>

                            <Typography>Base Salary: ₺{selected.base}</Typography>
                            <Typography>Overtime: ₺{selected.overtime}</Typography>
                            <Typography>Deductions: ₺{selected.deductions}</Typography>

                            <Typography sx={{ mt: 2, fontWeight: 700 }}>
                                Net Salary: ₺{selected.net}
                            </Typography>
                        </DialogContent>
                    </>
                )}
            </Dialog>

        </Box>
    );
}
