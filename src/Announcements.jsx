import React, { useState, useEffect } from "react";
import {
    Box, Grid, Card, CardContent, Typography, TextField, InputAdornment,
    Select, MenuItem, Chip, Dialog, DialogContent, Avatar, CircularProgress,
    IconButton, Divider, DialogActions, Button
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EventIcon from "@mui/icons-material/Event";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close"; // Yeni ikon
import CustomAppBar from "./CustomAppBar";
import DrawerComponent from "./DrawerComponent";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CampaignIcon from "@mui/icons-material/Campaign";
import SettingsIcon from "@mui/icons-material/Settings";
import PublicIcon from "@mui/icons-material/Public";
// (InfoIcon, WarningIcon, EventIcon zaten mevcut varsayılmıştır)
const categoryColors = {
    // Mevcut Kategoriler
    HR: "#FF8C00",      // Koyu Turuncu (İnsan Kaynakları)
    IT: "#6A5ACD",      // Mor (Teknoloji/BT)
    Management: "#28a745", // Yeşil (Yönetim)
    Events: "#CE14B2FF",  // Pembe/Macenta (Etkinlikler)

    // Yeni Kategoriler
    Finance: "#FFE74AFF",    // Canlı Yeşil (Mali/Finans)
    Marketing: "#FF5722",  // Derin Turuncu (Pazarlama/Satış)
    Operations: "#2EB6FFFF", // Turkuaz (Operasyonlar)
    General: "#575757FF",    // Mavi Gri (Genel Güncellemeler)
};

const categoryIcons = {
    // Mevcut Kategoriler
    HR: <InfoIcon sx={{ color: "white", fontSize: 18 }} />,
    IT: <WarningIcon sx={{ color: "white", fontSize: 18 }} />,
    Management: <InfoIcon sx={{ color: "white", fontSize: 18 }} />,
    Events: <EventIcon sx={{ color: "white", fontSize: 18 }} />,

    // Yeni Kategoriler
    Finance: <AttachMoneyIcon sx={{ color: "white", fontSize: 18 }} />,
    Marketing: <CampaignIcon sx={{ color: "white", fontSize: 18 }} />,
    Operations: <SettingsIcon sx={{ color: "white", fontSize: 18 }} />,
    General: <PublicIcon sx={{ color: "white", fontSize: 18 }} />,
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

            <Box sx={{ paddingTop: "90px", paddingX: { xs: 2, sm: 4, md: 6 }, pb: 6 }}>

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
                                <InputAdornment position="start"><SearchIcon sx={{ color: '#6A5ACD' }} /></InputAdornment>
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

                        {/* Yeni Menüler */}
                        <MenuItem value="Finance">Finance</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Operations">Operations</MenuItem>
                        <MenuItem value="General">General</MenuItem>
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
                                        borderRadius: 3,
                                        width: 620,
                                        height: 160,
                                        mb: 2,
                                        boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
                                        transition: "transform 0.2s, box-shadow 0.2s",
                                        cursor: "pointer",
                                        overflow: "hidden",
                                        borderLeft: `6px solid ${categoryColors[ann.category] || "#6A5ACD"}`,
                                        '&:hover': {
                                            transform: "translateY(-6px)",
                                            boxShadow: "0px 16px 35px rgba(0,0,0,0.15)"
                                        },
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
                                                <Chip label="IMPORTANT" size="small" sx={{ bgcolor: "#D11A2A", color: "white", fontWeight: 700, ml: 1, height: 20, fontSize: '0.65rem' }} />
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

                {/* --- PROFESSIONAL DETAILS MODAL --- */}
                <Dialog
                    open={!!selected}
                    onClose={() => setSelected(null)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            borderRadius: 4,
                            overflow: "hidden" // Header renginin taşmaması için
                        }
                    }}
                >
                    {selected && (
                        <>
                            {/* 1. Header Area */}
                            <Box sx={{
                                bgcolor: categoryColors[selected.category] || "#6A5ACD",
                                p: 3,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                                color: "white"
                            }}>
                                <Box sx={{ pr: 2 }}>
                                    <Typography variant="h6" fontWeight={700} sx={{ lineHeight: 1.3 }}>
                                        {selected.title}
                                    </Typography>
                                    {selected.importance === "High" && (
                                        <Chip
                                            label="HIGH IMPORTANCE"
                                            size="small"
                                            sx={{
                                                mt: 1,
                                                bgcolor: "#CF0011FF",
                                                color: "#FFFFFFFF",
                                                fontWeight: 800,
                                                fontSize: '0.6rem',
                                                width: 120,
                                            }}
                                        />
                                    )}
                                </Box>
                                <IconButton onClick={() => setSelected(null)} sx={{ color: "white", mt: -1, mr: -1 }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            {/* 2. Content Area */}
                            <DialogContent sx={{ p: 4 }}>
                                {/* Metadata Row */}
                                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                                    {/* Kategori Çipi - Outline stil */}
                                    <Chip
                                        icon={categoryIcons[selected.category]} // Ikonu tekrar klonlamak gerekebilir, basitlik için text icon kullandık veya null geçebiliriz
                                        label={selected.category}
                                        sx={{
                                            bgcolor: 'transparent',
                                            color: categoryColors[selected.category],
                                            fontWeight: 700,
                                            border: `1px solid ${categoryColors[selected.category]}`,
                                            '& .MuiChip-icon': { color: categoryColors[selected.category] }
                                        }}
                                    />

                                    {/* Tarih */}
                                    <Box sx={{ display: "flex", alignItems: "center", color: "#666" }}>
                                        <EventIcon sx={{ fontSize: 20, mr: 0.5 }} />
                                        <Typography variant="body2" fontWeight={600}>
                                            {selected.date}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 3 }} />

                                {/* Main Text */}
                                <Typography sx={{
                                    fontSize: 16,
                                    lineHeight: 1.8,
                                    color: "#333",
                                    whiteSpace: "pre-wrap" // Satır başlarını korur
                                }}>
                                    {selected.content}
                                </Typography>
                            </DialogContent>


                        </>
                    )}
                </Dialog>
            </Box>
        </Box>
    );
}