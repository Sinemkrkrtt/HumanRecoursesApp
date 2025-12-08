import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, IconButton,
    TextField, InputAdornment, MenuItem, Select, Chip, Dialog,
    DialogContent, Stack, CircularProgress, Divider, Tooltip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';
import '@fontsource/poppins/600.css';

export default function Documents() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [query, setQuery] = useState('');
    const [folderFilter, setFolderFilter] = useState('All');

    const [previewDoc, setPreviewDoc] = useState(null);
    const fileInputRef = useRef(null);

    // 1. Fetch Data (GET)
    const fetchDocs = () => {
        setLoading(true);
        fetch('http://localhost:5001/api/documents')
            .then(res => res.json())
            .then(data => {
                console.log("Documents fetched:", data);
                setDocs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching documents:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    // Unique folders for filter dropdown
    const folders = useMemo(() => ["All", ...Array.from(new Set(docs.map(d => d.folder)))], [docs]);

    // Filtering logic
    const filtered = docs.filter(d => {
        const q = query.trim().toLowerCase();
        if (folderFilter !== 'All' && d.folder !== folderFilter) return false;
        if (!q) return true;
        return d.name.toLowerCase().includes(q) || d.uploaded_by.toLowerCase().includes(q);
    });

    // 2. File Upload Simulation (POST)
    const handleFiles = (files) => {
        Array.from(files).forEach((file) => {
            const ext = (file.name.split('.').pop() || '').toLowerCase();
            const sizeStr = `${(file.size / 1024 / 1024) >= 1 ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : Math.round(file.size / 1024) + ' KB'}`;

            const newDocData = {
                name: file.name,
                size: sizeStr,
                type: ext,
                folder: 'Unsorted',
                uploaded_by: 'You'
            };

            fetch('http://localhost:5001/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDocData)
            })
                .then(res => res.json())
                .then(savedDoc => {
                    setDocs(prev => [savedDoc, ...prev]);
                })
                .catch(err => console.error("Upload error:", err));
        });
    };

    const onFileChange = (e) => {
        handleFiles(e.target.files);
        e.target.value = null;
    };

    // 3. Delete Document (DELETE)
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this document?")) return;

        fetch(`http://localhost:5001/api/documents/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    setDocs(prev => prev.filter(d => d.id !== id));
                    if (previewDoc && previewDoc.id === id) setPreviewDoc(null);
                } else {
                    console.error("Failed to delete");
                }
            })
            .catch(err => console.error("Delete error:", err));
    };

    // Download Simulation
    const handleDownload = (doc) => {
        alert(`Downloading ${doc.name}... (This is a demo action)`);
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Documents" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 2, sm: 4, md: 6 }, pb: 6 }}>

                {/* Header: Search + Filters + Upload */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
                    <TextField
                        size="small"
                        variant='standard'
                        placeholder="Search documents..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        sx={{ mt: 2, mr: 2, borderRadius: 1, width: { xs: '100%', sm: 300 } }}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon color="action" /></InputAdornment>)
                        }}
                    />

                    <Select
                        size="small"
                        value={folderFilter}
                        onChange={(e) => setFolderFilter(e.target.value)}
                        sx={{ mt: 2, minWidth: 160, bgcolor: 'white', borderRadius: 1 }}
                    >
                        {folders.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                    </Select>

                    <Box sx={{ flex: 1 }} />

                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        style={{ display: 'none' }}
                        onChange={onFileChange}
                    />
                    <Button
                        variant="contained"
                        startIcon={<UploadFileIcon />}
                        onClick={() => fileInputRef.current.click()}
                        sx={{ width: 130, mt: 2, bgcolor: '#BF48FFFF', '&:hover': { bgcolor: '#560e85' } }}
                    >
                        Upload
                    </Button>
                </Box>

                {loading && <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>}

                {/* Documents Grid */}
                <Grid container spacing={3}>
                    {!loading && filtered.length === 0 ? (
                        <Grid item xs={12}>
                            <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'transparent', boxShadow: 'none' }}>
                                <Typography sx={{ color: '#777' }}>No documents found.</Typography>
                            </Card>
                        </Grid>
                    ) : filtered.map(doc => (
                        <Grid item xs={12} sm={6} md={4} key={doc.id}>
                            <Card sx={{
                                borderRadius: 3,
                                mt: 2,
                                boxShadow: '0px 4px 12px rgba(0,0,0,0.05)',
                                height: 180,
                                width: 400,
                                display: 'flex',
                                flexDirection: 'column',
                                transition: '0.3s',
                                '&:hover': { boxShadow: '0px 8px 24px rgba(0,0,0,0.1)' }
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Stack direction="row" spacing={2} alignItems="flex-start">
                                        <Box sx={{ p: 1.5, bgcolor: '#FFFFFFFF', borderRadius: 2 }}>
                                            <InsertDriveFileIcon sx={{ fontSize: 40, color: '#9B5FF0FF', }} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.2, mb: 0.5 }}>
                                                {doc.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: '#666', display: 'block', mb: 1 }}>
                                                {doc.size} • {doc.uploaded_by}
                                            </Typography>
                                            <Stack direction="row" spacing={1}>
                                                <Chip label={doc.type.toUpperCase()} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }} />
                                                <Chip label={doc.folder} size="small" icon={<FolderIcon style={{ fontSize: 14 }} />} sx={{ height: 20, fontSize: '0.65rem' }} />
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </CardContent>

                                <Divider />
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1, px: 2, bgcolor: '#fafafa' }}>
                                    <Box>
                                        <Tooltip title="View Details">
                                            <IconButton size="small" onClick={() => setPreviewDoc(doc)}>
                                                <VisibilityIcon sx={{ mr: 1 }} fontSize="small" color='#A9A7A7FF' />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download">
                                            <IconButton size="small" onClick={() => handleDownload(doc)}>
                                                <DownloadIcon fontSize="small" color="info" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Tooltip title="Delete">
                                        <IconButton size="small" color="error" onClick={() => handleDelete(doc.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* --- PROFESSIONAL PREVIEW DIALOG --- */}
                <Dialog
                    open={!!previewDoc}
                    onClose={() => setPreviewDoc(null)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{
                        sx: {
                            mt: 10, height: 600, width: 500, borderRadius: 4, overflow: 'hidden'
                        } // Köşeleri yuvarla ve taşmayı engelle
                    }}
                >
                    {previewDoc && (
                        <Box>
                            {/* 1. Header (Mor Alan) */}
                            <Box sx={{
                                bgcolor: '#5D1089FF',
                                px: 3, py: 2,
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                color: 'white'
                            }}>
                                <Typography
                                    sx={{
                                        fontSize: 24,
                                        fontWeight: 600,    // Çok kalın değil (Medium)
                                        letterSpacing: 1.5,   // Doğal akışında
                                        fontFamily: "'Poppins', sans-serif", // Yuvarlak hatlı bir font ailesi
                                        color: 'white'
                                    }}
                                >
                                    File Preview
                                </Typography>
                                <IconButton onClick={() => setPreviewDoc(null)} sx={{ color: 'white' }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>

                            {/* 2. Hero Section (Dosya İkonu ve Adı) */}
                            <Box sx={{
                                textAlign: 'center',
                                py: 4,
                                bgcolor: '#FFFFFFFF',
                                borderBottom: '1px solid #FFFFFFFF',
                                display: 'flex', flexDirection: 'column', alignItems: 'center'
                            }}>

                                <InsertDriveFileIcon sx={{ fontSize: 60, mb: 3, color: '#630081FF' }} />

                                <Typography variant="h6" sx={{ px: 4, mb: 1, fontWeight: 700, wordBreak: 'break-word', fontSize: 22, color: '#333' }}>
                                    {previewDoc.name}
                                </Typography>
                                <Chip
                                    label={previewDoc.type.toUpperCase()}
                                    size="small"
                                    sx={{ mt: 1, fontWeight: 'bold', minWidth: 70, bgcolor: '#870B9DFF', color: '#FFFFFFFF' }}
                                />
                            </Box>

                            {/* 3. Details Grid (Bilgiler) - PROFESYONEL TASARIM */}
                            {/* 3. Details Grid (Bilgiler) - DÜZELTİLMİŞ TASARIM */}
                            <DialogContent sx={{ p: 3 }}>
                                <Grid container spacing={2}>
                                    {/* Helper Function: Map ile verileri dönüyoruz */}
                                    {[
                                        { label: "FOLDER", value: previewDoc.folder, icon: <FolderIcon sx={{ color: '#9c27b0' }} /> },
                                        { label: "FILE SIZE", value: previewDoc.size, icon: <InsertDriveFileIcon sx={{ color: '#9c27b0' }} /> },
                                        { label: "UPLOADED BY", value: previewDoc.uploaded_by, icon: <PersonIcon sx={{ color: '#9c27b0' }} /> },
                                        {
                                            label: "UPLOAD DATE",
                                            value: previewDoc.date ? new Date(previewDoc.date).toLocaleDateString() : 'N/A',
                                            icon: <AccessTimeIcon sx={{ color: '#9c27b0' }} />
                                        }
                                    ].map((item, index) => (
                                        <Grid item xs={6} key={index}>
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    width: 180,
                                                    alignItems: 'center',
                                                    p: 2,
                                                    border: '1px solid #e0e0e0', // İnce gri çerçeve
                                                    borderRadius: 3, // Yumuşak köşeler
                                                    bgcolor: '#fafafa', // Çok hafif gri arka plan (beyazdan ayrışması için)
                                                    transition: 'all 0.2s',
                                                    '&:hover': {
                                                        bgcolor: '#fff',
                                                        borderColor: '#C782F5FF',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                                                    }
                                                }}
                                            >
                                                {/* İkon Alanı */}
                                                <Box sx={{
                                                    minWidth: 44, width: 44, height: 44,
                                                    borderRadius: '50%', // Tam daire
                                                    bgcolor: '#FCFCFCFF',
                                                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                    mr: 2
                                                }}>
                                                    {React.cloneElement(item.icon, { fontSize: 'medium' })}
                                                </Box>

                                                {/* Metin Alanı */}
                                                <Box sx={{ overflow: 'hidden' }}>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            color: '#757575',
                                                            fontWeight: 700,
                                                            letterSpacing: 0.8,
                                                            fontSize: '0.7rem',
                                                            display: 'block',
                                                            mb: 0.3
                                                        }}
                                                    >
                                                        {item.label}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#2c3e50',
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis' // Uzun yazılar taşmasın diye ... koyar
                                                        }}
                                                    >
                                                        {item.value}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>

                                <Divider sx={{ my: 3, opacity: 0.6 }} />

                                {/* 4. Actions (Butonlar) */}
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between', // Butonları iki uca yaslar
                                    alignItems: 'center',
                                    gap: 2
                                }}>
                                    {/* Delete Butonu: Sade, kırmızı outline */}
                                    <Button
                                        variant="text"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => {
                                            if (window.confirm("Delete this file?")) {
                                                handleDelete(previewDoc.id);
                                            }
                                        }}
                                        sx={{
                                            height: 40,
                                            px: 3,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            borderColor: '#ef5350',
                                            color: '#ef5350',
                                            '&:hover': {
                                                borderColor: '#d32f2f',
                                                bgcolor: '#ffebee'
                                            }
                                        }}
                                    >
                                        Delete File
                                    </Button>

                                    {/* Download Butonu: Belirgin, dolu renk */}
                                    <Button
                                        variant="contained"
                                        startIcon={<DownloadIcon />}
                                        onClick={() => handleDownload(previewDoc)}
                                        sx={{
                                            height: 40,
                                            px: 4,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            borderRadius: 2,
                                            bgcolor: '#319AF5FF', // Uygulama ana rengi (Mor)
                                            boxShadow: '0 4px 12px rgba(107, 18, 166, 0.2)',
                                            '&:hover': {
                                                bgcolor: '#A9C7FFFF',
                                                boxShadow: '0 6px 16px rgba(107, 18, 166, 0.3)'
                                            }
                                        }}
                                    >
                                        Download
                                    </Button>
                                </Box>
                            </DialogContent>
                        </Box>
                    )}
                </Dialog>

            </Box>
        </Box>
    );
}