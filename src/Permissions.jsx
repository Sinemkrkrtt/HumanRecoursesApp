import React, { useState } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, ToggleButton, ToggleButtonGroup
} from '@mui/material';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';

const initialLeaves = [
    { employee: "Ahmet Yılmaz", department: "IT", type: "Annual", start: "2025-12-01", end: "2025-12-05", status: "Pending" },
    { employee: "Ayşe Kuzey", department: "HR", type: "Sick", start: "2025-11-28", end: "2025-11-30", status: "Approved" },
    { employee: "Mehmet Talaşoğlu", department: "Finance", type: "Unpaid", start: "2025-12-10", end: "2025-12-12", status: "Rejected" },
    { employee: "Selin Gören", department: "Marketing", type: "Annual", start: "2025-12-15", end: "2025-12-20", status: "Pending" },
];

function Permissions() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [leaves, setLeaves] = useState(initialLeaves);
    const [filterStatus, setFilterStatus] = useState('Pending');

    const handleStatusChange = (event, newStatus) => {
        if (newStatus !== null) setFilterStatus(newStatus);
    };

    const handleDecision = (index, decision) => {
        const updatedLeaves = [...leaves];
        updatedLeaves[index].status = decision;
        setLeaves(updatedLeaves);
    };

    const filteredLeaves = leaves.filter(lv => lv.status === filterStatus);

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Permissions" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 2, sm: 4, md: 6 } }}>
                {/* Status Filter */}
                <ToggleButtonGroup
                    value={filterStatus}
                    exclusive
                    onChange={handleStatusChange}
                    sx={{
                        mb: 4,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: 0,
                        bgcolor: '#f0f0f0',
                        borderRadius: 5,
                        p: 1,
                        boxShadow: '0px 4px 10px rgba(0,0,0,0.08)',
                    }}
                >
                    {["Pending", "Approved", "Rejected"].map((status) => (
                        <ToggleButton
                            key={status}
                            value={status}
                            sx={{
                                textTransform: 'none',
                                flex: 1,
                                fontWeight: 600,
                                borderRadius: 3,
                                color: filterStatus === status ? '#fff' : '#555',
                                bgcolor:
                                    filterStatus === status
                                        ? status === "Pending" ? '#FFA500' :
                                            status === "Approved" ? '#28a745' :
                                                '#dc3545'
                                        : '#f0f0f0',
                                '&:hover': {
                                    bgcolor:
                                        status === "Pending" ? '#FFB733' :
                                            status === "Approved" ? '#45c465' :
                                                '#e46060',
                                    color: '#fff',
                                },
                                boxShadow: filterStatus === status ? '0px 4px 12px rgba(0,0,0,0.15)' : 'none',
                                transition: '0.3s',
                                fontSize: 14,
                                py: 1.5,
                            }}
                        >
                            {status}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>

                {/* Leave Cards */}
                <Grid container spacing={3}>
                    {filteredLeaves.map((lv, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card sx={{
                                borderRadius: 4,
                                width: 400,
                                height: 250,

                                boxShadow: '0px 8px 20px rgba(0,0,0,0.08)',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': { transform: 'translateY(-6px)', boxShadow: '0px 15px 30px rgba(0,0,0,0.15)' },
                            }}>
                                {/* Status strip with gradient */}
                                <Box sx={{
                                    height: 6,
                                    bgcolor:
                                        lv.status === 'Approved' ? 'linear-gradient(90deg, #28a745, #51c878)' :
                                            lv.status === 'Rejected' ? 'linear-gradient(90deg, #dc3545, #e57373)' :
                                                'linear-gradient(90deg, #FFA500, #FFC233)'
                                }} />

                                <CardContent sx={{ pt: 3 }}>
                                    {/* Employee Name */}
                                    <Typography sx={{ fontWeight: 700, fontSize: 17, mb: 3 }}>{lv.employee}</Typography>

                                    {/* Info boxes */}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        {["Department", "Leave Type", "Duration"].map((label, i) => (
                                            <Box key={i} sx={{ flex: 1, mx: i === 1 ? 1 : 0 }}>
                                                <Typography sx={{
                                                    fontSize: 12,
                                                    color: '#555',
                                                    fontWeight: 600,
                                                    mb: 0.5,
                                                    borderBottom: '1px solid #800EF2FF',
                                                    pb: 0.5
                                                }}>{label}</Typography>
                                                <Typography sx={{ fontSize: 14, fontWeight: 400 }}>
                                                    {label === "Department" ? lv.department :
                                                        label === "Leave Type" ? lv.type :
                                                            `${lv.start} - ${lv.end}`}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>

                                    {/* Decision Buttons */}
                                    {lv.status === 'Pending' && (
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleDecision(leaves.indexOf(lv), 'Approved')}
                                                sx={{
                                                    flex: 1,
                                                    mr: 1,
                                                    py: 1.2,
                                                    borderRadius: 2,
                                                    bgcolor: '#6AA277FF',
                                                    '&:hover': { bgcolor: '#39E163FF' },
                                                    fontWeight: 600,
                                                    width: 10,
                                                    height: 30,
                                                }}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleDecision(leaves.indexOf(lv), 'Rejected')}
                                                sx={{
                                                    flex: 1,
                                                    ml: 1,
                                                    py: 1.2,
                                                    borderRadius: 2,
                                                    bgcolor: '#FD6F7DFF',
                                                    '&:hover': { bgcolor: '#D52323FF' },
                                                    fontWeight: 600,
                                                    width: 10,
                                                    height: 30
                                                }}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}

                                    {/* Status Badge */}
                                    <Typography sx={{
                                        mt: 2,
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: lv.status === 'Approved' ? '#599266FF' :
                                            lv.status === 'Rejected' ? '#D53949FF' : '#F9A24FFF',
                                    }}>
                                        {lv.status.toUpperCase()}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}

                    {filteredLeaves.length === 0 && (
                        <Typography sx={{ textAlign: 'center', width: '100%', mt: 4, color: '#777', fontSize: 15 }}>
                            No leave requests found.
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}

export default Permissions;
