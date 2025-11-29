import React, { useState, useEffect } from "react";
import {
    Box, Grid, Card, CardContent, Typography, TextField, InputAdornment,
    Select, MenuItem, Chip, Dialog, DialogTitle, DialogContent, Avatar, CircularProgress
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CustomAppBar from "./CustomAppBar";
import DrawerComponent from "./DrawerComponent";

const categoryColors = {
    HR: "#FF8C00",
    IT: "#6A5ACD",
    Management: "#28a745",
    Events: "#CE14B2FF",
};

const categoryIcons = {
    HR: <InfoIcon sx={{ color: "white", fontSize: 18 }} />,
    IT: <WarningIcon sx={{ color: "white", fontSize: 18 }} />,
    Management: <InfoIcon sx={{ color: "white", fontSize: 18 }} />,
    Events: <EventIcon sx={{ color: "white", fontSize: 18 }} />,
};

export default function Announcements() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [selected, setSelected] = useState(null);

    // VERİTABANI STATE'LERİ
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Verileri Çekme
    useEffect(() => {
        fetch('http://localhost:5001/api/announcements') // Port 5001
            .then(res => res.json())
            .then(data => {
                console.log("Duyurular:", data);
                setAnnouncements(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Hata:", err);
                setLoading(false);
            });
    }, []);

    const filteredAnnouncements = announcements.filter((ann) => {
        const matchesSearch =
            ann.title.toLowerCase().includes(search.toLowerCase()) ||
            ann.content.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
            categoryFilter === "All" ? true : ann.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    return (
        <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh" }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Announcements" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: "90px", paddingX: { xs: 2, sm: 4, md: 6 } }}>

                {/* Search + Filter */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 6, mt: 3, alignItems: "center" }}>
                    <TextField
                        placeholder="Search announcements..."
                        size="small"
                        variant="standard"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: 250, mr: 3 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start"><SearchIcon /></InputAdornment>
                            ),
                        }}
                    />
                    <Select
                        size="small"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        sx={{ width: 200 }}
                    >
                        <MenuItem value="All">All Categories</MenuItem>
                        <MenuItem value="HR">HR</MenuItem>
                        <MenuItem value="IT">IT</MenuItem>
                        <MenuItem value="Management">Management</MenuItem>
                        <MenuItem value="Events">Events</MenuItem>
                    </Select>
                </Box>

                {loading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}

                {/* Announcement Cards */}
                <Grid container spacing={3}>
                    {!loading && filteredAnnouncements.length > 0 ? (
                        filteredAnnouncements.map((ann, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={ann.id || idx}>
                                <Card
                                    sx={{
                                        borderRadius: 3, width: 600, height: 160, mb: 2, ml: 5,
                                        boxShadow: "0px 8px 25px rgba(0,0,0,0.12)",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        cursor: "pointer", overflow: "hidden",
                                        borderLeft: `6px solid ${categoryColors[ann.category] || "#6A5ACD"}`,
                                        '&:hover': { transform: "translateY(-6px)", boxShadow: "0px 16px 35px rgba(0,0,0,0.18)" },
                                    }}
                                    onClick={() => setSelected(ann)}
                                >
                                    <CardContent>
                                        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                            <Avatar sx={{ bgcolor: categoryColors[ann.category] || "#6A5ACD", width: 28, height: 28, mr: 1 }}>
                                                {categoryIcons[ann.category]}
                                            </Avatar>
                                            <Typography sx={{ fontWeight: 700, fontSize: 16, flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {ann.title}
                                            </Typography>
                                            {ann.importance === "High" && (
                                                <Chip label="IMPORTANT" size="small" sx={{ bgcolor: "#D11A2A", color: "white", fontWeight: 700, ml: 1 }} />
                                            )}
                                        </Box>
                                        <Typography sx={{ fontSize: 12, color: "#555", mb: 1 }}>{ann.date}</Typography>
                                        <Typography sx={{ fontSize: 14, color: "#777", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                                            {ann.content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : !loading && (
                        <Typography sx={{ textAlign: "center", width: "100%", mt: 4, color: "#777" }}>
                            No announcements found.
                        </Typography>
                    )}
                </Grid>

                {/* Details Modal */}
                <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="sm" fullWidth>
                    {selected && (
                        <>
                            <DialogTitle sx={{ fontWeight: 700 }}>{selected.title}</DialogTitle>
                            <DialogContent>
                                <Chip
                                    label={selected.category}
                                    sx={{ bgcolor: categoryColors[selected.category] || "#6A5ACD", color: "#fff", fontWeight: 700, mb: 2 }}
                                />
                                <Typography sx={{ mb: 1, color: "#555" }}>
                                    <strong>Date:</strong> {selected.date}
                                </Typography>
                                <Typography sx={{ mt: 1 }}>{selected.content}</Typography>
                            </DialogContent>
                        </>
                    )}
                </Dialog>
            </Box>
        </Box>
    );
}