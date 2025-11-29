import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, IconButton,
    TextField, InputAdornment, MenuItem, Select, Chip, Dialog,
    DialogTitle, DialogContent, Stack, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';

export default function Documents() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [docs, setDocs] = useState([]); // Veritabanından gelecek
    const [loading, setLoading] = useState(true);

    // Filtreler
    const [query, setQuery] = useState('');
    const [folderFilter, setFolderFilter] = useState('All');

    const [previewDoc, setPreviewDoc] = useState(null);
    const fileInputRef = useRef(null);

    // 1. Verileri Çekme (GET)
    const fetchDocs = () => {
        fetch('http://localhost:5001/api/documents') // Port 5001
            .then(res => res.json())
            .then(data => {
                console.log("Dokümanlar:", data);
                setDocs(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Hata:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchDocs();
    }, []);

    // Unique folders
    const folders = useMemo(() => ["All", ...Array.from(new Set(docs.map(d => d.folder)))], [docs]);

    const filtered = docs.filter(d => {
        const q = query.trim().toLowerCase();
        if (folderFilter !== 'All' && d.folder !== folderFilter) return false;
        if (!q) return true;
        return d.name.toLowerCase().includes(q) || d.uploaded_by.toLowerCase().includes(q);
    });

    // 2. Dosya Yükleme Simülasyonu (POST)
    const handleFiles = (files) => {
        Array.from(files).forEach((file) => {
            const ext = (file.name.split('.').pop() || '').toLowerCase();
            const sizeStr = `${(file.size / 1024 / 1024) >= 1 ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : Math.round(file.size / 1024) + ' KB'}`;

            const newDocData = {
                name: file.name,
                size: sizeStr,
                type: ext,
                folder: 'Unsorted', // Varsayılan klasör
                uploaded_by: 'You' // Gerçek auth olmadığı için 'You'
            };

            // Backend'e kaydet
            fetch('http://localhost:5001/api/documents', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDocData)
            })
                .then(res => res.json())
                .then(savedDoc => {
                    setDocs(prev => [savedDoc, ...prev]); // Listeye ekle
                })
                .catch(err => console.error("Yükleme hatası:", err));
        });
    };

    const onFileChange = (e) => {
        handleFiles(e.target.files);
        e.target.value = null;
    };

    // 3. Dosya Silme (DELETE)
    const handleDelete = (id) => {
        if (!window.confirm("Bu dosyayı silmek istediğine emin misin?")) return;

        fetch(`http://localhost:5001/api/documents/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.ok) {
                    setDocs(prev => prev.filter(d => d.id !== id));
                }
            })
            .catch(err => console.error("Silme hatası:", err));
    };

    // Fake Download
    const handleDownload = (doc) => {
        alert(`${doc.name} indiriliyor... (Demo)`);
    };

    return (
        <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Documents" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{ paddingTop: '90px', paddingX: { xs: 2, sm: 4, md: 6 }, pb: 6 }}>

                {/* Header: search + filters + upload */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap', mb: 3 }}>
                    <TextField
                        size="small"
                        variant='standard'
                        placeholder="Search documents or uploader..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        sx={{ ml: 2, mb: 3, mt: 4, width: { xs: '100%', sm: 300 } }}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>)
                        }}
                    />

                    <Select
                        size="small"
                        value={folderFilter}
                        onChange={(e) => setFolderFilter(e.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        {folders.map(f => <MenuItem key={f} value={f}>{f}</MenuItem>)}
                    </Select>

                    <Box sx={{ flex: 1, mt: 4, }} />

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
                        sx={{ width: 140, whiteSpace: 'nowrap', bgcolor: '#6B12A6FF', '&:hover': { bgcolor: '#E0B1FFFF', mb: 3, mt: 4 } }}
                    >
                        Upload
                    </Button>
                </Box>

                {loading && <Box display="flex" justifyContent="center"><CircularProgress /></Box>}

                {/* Documents grid */}
                <Grid container spacing={3}>
                    {!loading && filtered.length === 0 ? (
                        <Grid item xs={12}>
                            <Card sx={{ p: 4, textAlign: 'center' }}>
                                <Typography sx={{ color: '#777' }}>No documents found.</Typography>
                            </Card>
                        </Grid>
                    ) : filtered.map(doc => (
                        <Grid item xs={12} sm={6} md={4} key={doc.id}>
                            <Card sx={{
                                borderRadius: 3,
                                boxShadow: '0px 8px 20px rgba(0,0,0,0.06)',
                                height: '100%',
                                width: 360,
                                ml: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                mt: 2,
                            }}>
                                <CardContent>
                                    <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                                        <InsertDriveFileIcon sx={{ ml: 2, fontSize: 36, color: '#6727B7FF' }} />
                                        <Box>
                                            <Typography sx={{ fontWeight: 700, mt: 2 }}>{doc.name}</Typography>
                                            <Typography sx={{ color: '#666', fontSize: 13 }}>
                                                {doc.size} • {doc.date ? doc.date.slice(0, 10) : ''} • {doc.uploaded_by}
                                            </Typography>
                                            <Stack direction="row" spacing={1} mt={1}>
                                                <Chip label={doc.type} size="small" />
                                                <Chip label={doc.folder} size="small" icon={<FolderIcon />} />
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </CardContent>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', p: 2, pt: 0 }}>
                                    <Box>
                                        <Button size="medium" onClick={() => setPreviewDoc(doc)} startIcon={<VisibilityIcon />}></Button>
                                        <Button size="medium" onClick={() => handleDownload(doc)} startIcon={<DownloadIcon />}></Button>
                                    </Box>
                                    <IconButton color="error" onClick={() => handleDelete(doc.id)}><DeleteIcon /></IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Preview Dialog */}
                <Dialog open={!!previewDoc} onClose={() => setPreviewDoc(null)}>
                    <DialogTitle>{previewDoc?.name}</DialogTitle>
                    <DialogContent>
                        <Typography>Bu sadece bir demo önizlemesidir.</Typography>
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
}