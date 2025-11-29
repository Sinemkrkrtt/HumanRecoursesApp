// DocumentsPage.jsx
import React, { useState, useRef } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, Button, IconButton,
    TextField, InputAdornment, MenuItem, Select, Chip, Dialog,
    DialogTitle, DialogContent, Avatar, Stack
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FolderIcon from '@mui/icons-material/Folder';
import DescriptionIcon from '@mui/icons-material/Description';
import CustomAppBar from './CustomAppBar';
import DrawerComponent from './DrawerComponent';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

/*
  Basit client-side Documents page.
  Gerçek projede upload/download backend ile entegre edilir.
*/

const initialDocs = [
    { id: 1, name: "Çalışan_Elkitabı.pdf", size: "1.2 MB", type: "pdf", folder: "HR", tags: ["policy"], uploadedBy: "Ayşe", date: "2025-11-10" },
    { id: 2, name: "Sözleşme_Mesai.docx", size: "240 KB", type: "docx", folder: "Legal", tags: ["contract"], uploadedBy: "Mehmet", date: "2025-10-03" },
    { id: 3, name: "Maaş_Bordro_2025_11.pdf", size: "320 KB", type: "pdf", folder: "Payroll", tags: ["payroll", "private"], uploadedBy: "İK", date: "2025-11-25" },
    { id: 4, name: "Eğitim_Sunum.pptx", size: "3.6 MB", type: "pptx", folder: "Training", tags: ["presentation"], uploadedBy: "Burak", date: "2025-09-15" },
];

export default function Documents() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [docs, setDocs] = useState(initialDocs);
    const [query, setQuery] = useState('');
    const [folderFilter, setFolderFilter] = useState('All');
    const [tagFilter, setTagFilter] = useState('All');
    const [previewDoc, setPreviewDoc] = useState(null);
    const fileInputRef = useRef(null);

    // Unique folders and tags from data
    const folders = ["All", ...Array.from(new Set(docs.map(d => d.folder)))];
    const tags = ["All", ...Array.from(new Set(docs.flatMap(d => d.tags)))];

    const filtered = docs.filter(d => {
        const q = query.trim().toLowerCase();
        if (folderFilter !== 'All' && d.folder !== folderFilter) return false;
        if (tagFilter !== 'All' && !d.tags.includes(tagFilter)) return false;
        if (!q) return true;
        return d.name.toLowerCase().includes(q) || d.uploadedBy.toLowerCase().includes(q);
    });

    // Simüle edilmiş upload: sadece meta ekler (gerçek dosya backend gerektirir)
    const handleFiles = (files) => {
        const next = [...docs];
        Array.from(files).forEach((file, idx) => {
            const ext = (file.name.split('.').pop() || '').toLowerCase();
            const id = Date.now() + Math.random();
            next.unshift({
                id,
                name: file.name,
                size: `${(file.size / 1024 / 1024) >= 1 ? (file.size / 1024 / 1024).toFixed(2) + ' MB' : Math.round(file.size / 1024) + ' KB'}`,
                type: ext,
                folder: 'Unsorted',
                tags: [],
                uploadedBy: 'You',
                date: new Date().toISOString().slice(0, 10),
                // optionally keep a blob for preview/download:
                blob: file
            });
        });
        setDocs(next);
    };

    const onFileChange = (e) => {
        handleFiles(e.target.files);
        e.target.value = null;
    };

    // simple download using blob if present or create fake file:
    const handleDownload = (doc) => {
        if (doc.blob) {
            const url = URL.createObjectURL(doc.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } else {
            // create a tiny text blob to simulate download
            const blob = new Blob([`Downloaded: ${doc.name}`], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = doc.name.replace(/\.\w+$/, '.txt');
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        }
    };

    const handleDelete = (id) => {
        setDocs(prev => prev.filter(d => d.id !== id));
    };

    // drop handling
    const handleDrop = (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
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
                        sx={{ width: { xs: '100%', sm: 300, ml: 5 } }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
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

                    <Select
                        size="small"
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                        sx={{ minWidth: 160 }}
                    >
                        {tags.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
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
                        sx={{ whiteSpace: 'nowrap', bgcolor: '#6B12A6FF', '&:hover': { bgcolor: '#E0B1FFFF' } }}
                    >
                        Upload
                    </Button>
                </Box>

                {/* Drag area */}
                <Box
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    sx={{
                        border: '2px dashed rgba(0,0,0,0.08)',
                        borderRadius: 2,
                        p: 3,
                        mb: 5,
                        mt: 4,
                        bgcolor: '#fff',
                        display: 'flex',
                        gap: 2,
                        height: 80,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <FolderIcon sx={{ fontSize: 36, color: '#946FD7FF' }} />
                    <Box>
                        <Typography sx={{ fontWeight: 600 }}>Drag & drop files here</Typography>
                        <Typography sx={{ color: '#666', fontSize: 13 }}>or click Upload to select files. Files are stored locally in this demo.</Typography>
                    </Box>
                </Box>

                {/* Documents grid */}
                <Grid container spacing={3}>
                    {filtered.length === 0 ? (
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
                                width: 350,
                                ml: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between'
                            }}>
                                <CardContent>
                                    <Stack direction="row" spacing={2} alignItems="center" mb={1}>

                                        < InsertDriveFileIcon sx={{ ml: 7, fontSize: 36, color: '#6727B7FF' }} />

                                        <Box>
                                            <Typography sx={{ fontWeight: 700, mt: 2 }}>{doc.name}</Typography>
                                            <Typography sx={{ color: '#666', fontSize: 13 }}>{doc.size} • {doc.date} • {doc.uploadedBy}</Typography>
                                            <Stack direction="row" spacing={1} mt={1}>
                                                {doc.tags.map(t => <Chip key={t} label={t} size="small" />)}
                                                <Chip label={doc.folder} size="small" icon={<FolderIcon />} />
                                            </Stack>
                                        </Box>
                                    </Stack>

                                </CardContent>

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', p: 2, pt: 0 }}>
                                    <Box>
                                        <Button size="medıum" onClick={() => setPreviewDoc(doc)} startIcon={<VisibilityIcon />}></Button>
                                        <Button size="medıum" onClick={() => handleDownload(doc)} startIcon={<DownloadIcon />}></Button>
                                    </Box>

                                    <IconButton color="error" onClick={() => handleDelete(doc.id)}><DeleteIcon /></IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Preview dialog */}
                <Dialog open={!!previewDoc} onClose={() => setPreviewDoc(null)} maxWidth="lg" fullWidth>
                    <DialogTitle>{previewDoc?.name}</DialogTitle>
                    <DialogContent>
                        {previewDoc ? (
                            previewDoc.type === 'pdf' && previewDoc.blob ? (
                                // show embedded pdf if blob
                                <iframe
                                    title="pdf-preview"
                                    src={URL.createObjectURL(previewDoc.blob)}
                                    style={{ width: '100%', height: '70vh', border: 0 }}
                                />
                            ) : (
                                <Typography sx={{ color: '#666' }}>Preview not available for this file type in demo. You can download it.</Typography>
                            )
                        ) : null}
                    </DialogContent>
                </Dialog>
            </Box>
        </Box>
    );
}

