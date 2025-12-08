import React, { useState, useEffect } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    TextField,
    IconButton,
    Button,
    Divider,
    Switch,
    FormControlLabel,
    InputAdornment,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    CircularProgress
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import CheckIcon from "@mui/icons-material/Check";
import CustomAppBar from "./CustomAppBar";
import DrawerComponent from "./DrawerComponent";
import LockResetIcon from '@mui/icons-material/LockReset';

export default function Settings() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true); // Yükleniyor durumu

    // --- STATE'LER (Veritabanı ile eşleşecek) ---
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        position: "",
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
    });

    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState("tr");
    // ---------------------------------------------

    const [editingProfile, setEditingProfile] = useState(false);

    // Şifre State'leri
    const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
    const [showPw, setShowPw] = useState({ current: false, newPass: false, confirm: false });
    const [pwError, setPwError] = useState("");

    // API & Diğer State'ler
    const [apiKey, setApiKey] = useState("sk_live_51M3jK...");
    const [apiDialogOpen, setApiDialogOpen] = useState(false);
    const [twoFA, setTwoFA] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

    // 1. VERİLERİ BACKEND'DEN ÇEKME (GET)
    useEffect(() => {
        fetch('http://localhost:5001/api/settings') // Port 5001
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setProfile({
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        position: data.position
                    });
                    // Notifications null gelirse varsayılan obje kullan
                    setNotifications(data.notifications || { email: true, sms: false, push: true });
                    setDarkMode(data.dark_mode);
                    setLanguage(data.language);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Veri çekme hatası:", err);
                setLoading(false);
            });
    }, []);

    // 2. VERİLERİ BACKEND'E KAYDETME (PUT)
    const saveAllSettings = () => {
        const payload = {
            ...profile,
            notifications,
            dark_mode: darkMode,
            language
        };

        fetch('http://localhost:5001/api/settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(() => {
                setSnack({ open: true, message: "Tüm ayarlar başarıyla kaydedildi!", severity: "success" });
                setEditingProfile(false);
            })
            .catch(err => {
                console.error("Kaydetme hatası:", err);
                setSnack({ open: true, message: "Kaydetme başarısız.", severity: "error" });
            });
    };

    // --- HANDLERS (Orijinal Koddan) ---
    const handleProfileChange = (field) => (e) => {
        setProfile(prev => ({ ...prev, [field]: e.target.value }));
    };

    const toggleNotification = (field) => (e) => {
        setNotifications(prev => ({ ...prev, [field]: e.target.checked }));
    };

    const toggleShowPw = (field) => {
        setShowPw(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handlePasswordChange = (field) => (e) => {
        setPasswords(prev => ({ ...prev, [field]: e.target.value }));
    };

    const savePassword = () => {
        if (passwords.newPass !== passwords.confirm) {
            setPwError("New password and confirmation do not match.");
            return;
        }
        setPwError("");
        setSnack({ open: true, message: "Şifre değiştirildi (Demo).", severity: "success" });
        setPasswords({ current: "", newPass: "", confirm: "" });
    };

    const handleCopyApiKey = async () => {
        try {
            await navigator.clipboard.writeText(apiKey);
            setSnack({ open: true, message: "API anahtarı kopyalandı.", severity: "success" });
        } catch {
            setSnack({ open: true, message: "Kopyalama başarısız.", severity: "error" });
        }
    };

    const handleRotateApiKey = () => {
        const newKey = "sk_live_" + Math.random().toString(36).slice(2, 18);
        setApiKey(newKey);
        setSnack({ open: true, message: "Yeni API anahtarı oluşturuldu.", severity: "success" });
    };

    const handleDeleteAccount = () => {
        setConfirmDeleteOpen(false);
        setSnack({ open: true, message: "Hesap silme isteği alındı (demo).", severity: "info" });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: "#f5f5f5" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: "100vh",
            bgcolor: darkMode ? "#121217" : "#f5f5f5", // Dark Mode Veritabanından
            color: darkMode ? "#eaeaf0" : "inherit",
            pb: 6
        }}>
            <CustomAppBar onMenuClick={() => setDrawerOpen(true)} title="Settings" />
            <DrawerComponent open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <Box sx={{
                pt: "90px",
                px: { xs: 2, sm: 3, md: 6 }
            }}>
                <Grid container spacing={3}>

                    {/* Left column: Profile & Account */}
                    <Grid item xs={12} md={6}>
                        <Card sx={{ borderRadius: 3, width: 1350, height: 230, boxShadow: "0 8px 20px rgba(0,0,0,0.08)" }}>
                            <CardContent>
                                <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
                                    <Avatar sx={{ width: 72, height: 72, bgcolor: "#A265E7FF", fontSize: 24 }}>
                                        {profile.name ? profile.name.split(" ").map(n => n[0].toUpperCase()).join("") : "U"}
                                    </Avatar>

                                    <Box sx={{ flex: 1 }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{profile.name}</Typography>
                                        <Typography sx={{ color: darkMode ? "#bfc0c8" : "#666" }}>{profile.position} • {profile.email}</Typography>
                                    </Box>
                                    <IconButton onClick={() => setEditingProfile(true)} variant="outlined" title="Edit profile">
                                        <EditIcon sx={{ color: "#C64BF6FF" }} />
                                    </IconButton>
                                </Box>
                                <Divider sx={{ my: 2, mb: 5 }} />

                                {/* Profile Edit Form */}
                                <Grid container spacing={2} >
                                    <Grid item xs={12} sm={6} sx={{ mr: 4, ml: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Full Name"
                                            size="small"
                                            value={profile.name}
                                            onChange={handleProfileChange("name")}
                                            disabled={!editingProfile}
                                            sx={{ width: 250 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{ mr: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            size="small"
                                            value={profile.email}
                                            onChange={handleProfileChange("email")}
                                            disabled={!editingProfile}
                                            sx={{ width: 250 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{ mr: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Phone"
                                            size="small"
                                            value={profile.phone}
                                            onChange={handleProfileChange("phone")}
                                            disabled={!editingProfile}
                                            sx={{ width: 250 }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} sx={{ mr: 4 }}>
                                        <TextField
                                            fullWidth
                                            label="Position"
                                            size="small"
                                            value={profile.position}
                                            onChange={handleProfileChange("position")}
                                            disabled={!editingProfile}
                                            sx={{ width: 250 }}
                                        />
                                    </Grid>
                                </Grid>

                                {editingProfile && (
                                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 3 }}>
                                        <Button startIcon={<CancelIcon />} color="inherit" variant="outlined" onClick={() => setEditingProfile(false)}>Cancel</Button>
                                        {/* Save Sadece Profili değil her şeyi kaydeder */}
                                        <Button startIcon={<SaveIcon />} variant="contained" onClick={saveAllSettings}>Save</Button>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>

                        <Grid container spacing={3}>

                            {/* Left column: Change Password */}
                            <Grid item xs={12} md={6} sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                                <Card sx={{ width: 450, height: 350, borderRadius: 3, boxShadow: "0 8px 20px rgba(0,0,0,0.08)", p: 3 }}>
                                    <CardContent>
                                        <Typography sx={{ fontWeight: 700, mb: 4, fontSize: "1.2rem" }}>Change Password</Typography>

                                        <Grid container spacing={3} direction="column">
                                            <Grid item>
                                                <TextField
                                                    fullWidth
                                                    label="Current Password"
                                                    type={showPw.current ? "text" : "password"}
                                                    size="small"
                                                    variant="standard"
                                                    value={passwords.current}
                                                    onChange={handlePasswordChange("current")}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockIcon sx={{ fontSize: 20 }} />
                                                            </InputAdornment>
                                                        ),
                                                        endAdornment: (
                                                            <IconButton onClick={() => toggleShowPw("current")}>
                                                                {showPw.current ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        )
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item>
                                                <TextField
                                                    fullWidth
                                                    label="New Password"
                                                    type={showPw.newPass ? "text" : "password"}
                                                    size="small"
                                                    variant="standard"
                                                    value={passwords.newPass}
                                                    onChange={handlePasswordChange("newPass")}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockResetIcon sx={{ fontSize: 20 }} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>

                                            <Grid item>
                                                <TextField
                                                    fullWidth
                                                    label="Confirm Password"
                                                    type={showPw.confirm ? "text" : "password"}
                                                    size="small"
                                                    variant="standard"
                                                    value={passwords.confirm}
                                                    onChange={handlePasswordChange("confirm")}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LockResetIcon sx={{ fontSize: 20 }} />
                                                            </InputAdornment>
                                                        )
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>

                                        {pwError && (
                                            <Typography sx={{ color: "error.main", mt: 2, fontSize: "0.9rem" }}>
                                                {pwError}
                                            </Typography>
                                        )}

                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4 }}>
                                            <Button sx={{ fontSize: 12, color: "#6E00D5FF", borderColor: "#731CCFFF" }} variant="outlined" onClick={() => setPasswords({ current: "", newPass: "", confirm: "" })}>Reset</Button>
                                            <Button sx={{ fontSize: 12, backgroundColor: "#BD5BE4FF" }} variant="contained" onClick={savePassword}>Update Password</Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Right column: Notifications + Appearance */}
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={3} direction="column">

                                    {/* Notifications */}
                                    <Grid item>
                                        <Card sx={{ width: 800, height: 130, mt: 4, borderRadius: 3, boxShadow: "0 8px 20px rgba(0,0,0,0.06)", p: 2 }}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 19, fontWeight: 700, mb: 2 }}>Notifications</Typography>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={notifications.email}
                                                            onChange={toggleNotification("email")}
                                                            sx={{
                                                                '& .MuiSwitch-switchBase.Mui-checked': {
                                                                    color: '#51035FFF', // thumb rengi
                                                                },
                                                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                                    backgroundColor: '#F09CFFFF', // track rengi
                                                                },
                                                            }}
                                                        />
                                                    }
                                                    label="Email notifications"
                                                />

                                                <FormControlLabel
                                                    sx={{ mt: 1, ml: 3 }}
                                                    control={<Switch checked={notifications.sms} onChange={toggleNotification("sms")} sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#51035FFF', // thumb rengi
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#F09CFFFF', // track rengi
                                                        },
                                                    }} />}
                                                    label="SMS notifications"
                                                />
                                                <FormControlLabel
                                                    sx={{ mt: 1, ml: 3 }}
                                                    control={<Switch checked={notifications.push} onChange={toggleNotification("push")} sx={{
                                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                                            color: '#51035FFF', // thumb rengi
                                                        },
                                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                            backgroundColor: '#F09CFFFF', // track rengi
                                                        },
                                                    }} />}
                                                    label="App push notifications"
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>


                                    {/* Integrations / API */}
                                    <Card sx={{ borderRadius: 3, boxShadow: "0 8px 20px rgba(0,0,0,0.06)", mt: 2, height: 195 }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 19, fontWeight: 700, mb: 2 }}>Integrations & API</Typography>
                                            <Typography sx={{ fontSize: 13, color: darkMode ? "#bfc0c8" : "#666", mb: 1 }}>
                                                Use this API key to integrate your HR system.
                                            </Typography>
                                            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={apiKey}
                                                    InputProps={{ readOnly: true }}
                                                />
                                                <Tooltip title="Copy to clipboard">
                                                    <IconButton sx={{ color: "#952EF5FF" }} onClick={handleCopyApiKey}><FileCopyIcon /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="Rotate API key">
                                                    <IconButton sx={{ color: "#888888FF" }} onClick={handleRotateApiKey}><RefreshIcon /></IconButton>
                                                </Tooltip>
                                            </Box>

                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mr: 12 }}>
                                                <Button
                                                    sx={{ fontSize: 10, backgroundColor: "#743F7FFF" }}
                                                    variant="contained"
                                                    onClick={() => setApiDialogOpen(true)}
                                                >
                                                    Manage integrations
                                                </Button>
                                            </Box>

                                        </CardContent>
                                    </Card>

                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Privacy & Security */}
                        <Card sx={{ height: 350, borderRadius: 3, boxShadow: "0 8px 20px rgba(0,0,0,0.06)", mt: 3 }}>
                            <CardContent>
                                <Typography sx={{ fontSize: 19, fontWeight: 700, mb: 2 }}>Privacy & Security</Typography>
                                <FormControlLabel
                                    control={<Switch checked={twoFA} onChange={() => setTwoFA(prev => !prev)} sx={{
                                        '& .MuiSwitch-switchBase.Mui-checked': {
                                            color: '#51035FFF', // thumb rengi
                                        },
                                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                            backgroundColor: '#F09CFFFF', // track rengi
                                        },
                                    }} />}
                                    label="Two-factor authentication (2FA)"
                                />
                                <Typography sx={{ fontSize: 13, color: darkMode ? "#bfc0c8" : "#666", mt: 1, mb: 6 }}>
                                    Enabling 2FA increases account security. You will receive codes via authenticator app.
                                </Typography>

                                <Divider sx={{ my: 2 }} />

                                <Typography sx={{ fontSize: 19, fontWeight: 700, mb: 2 }}>Danger zone</Typography>
                                <Typography sx={{ fontSize: 13, color: "#a33", mb: 3 }}>
                                    Deleting your account is irreversible. All data will be removed.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteForeverIcon />}
                                    onClick={() => setConfirmDeleteOpen(true)}
                                >
                                    Delete account
                                </Button>
                            </CardContent>
                        </Card>

                    </Grid>
                </Grid>

                {/* Action row: Save all */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 4, mb: 10 }}>
                    <Button sx={{ width: 140, height: 50, ml: 3, mt: 1, fontSize: 13, color: '#E66464FF' }} startIcon={<CancelIcon />} variant="text" onClick={() => window.location.reload()}>
                        Cancel
                    </Button>
                    {/* Bu buton da veritabanına kayıt yapar */}
                    <Button sx={{ width: 140, height: 50, mr: 2, backgroundColor: '#6B21F3FF', fontSize: 13 }} startIcon={<SaveIcon />} variant="contained" onClick={saveAllSettings}>
                        Save all
                    </Button>
                </Box>
            </Box>

            {/* API Dialog */}
            <Dialog open={apiDialogOpen} onClose={() => setApiDialogOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Manage Integrations</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2 }}>Here you can connect external apps (example only).</Typography>
                    <Button variant="outlined" sx={{ mr: 1 }}>Connect Slack</Button>
                    <Button variant="outlined">Connect Google</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setApiDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete */}
            <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
                <DialogTitle>Delete account?</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to permanently delete your account? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                    <Button color="error" variant="contained" onClick={handleDeleteAccount}>Yes, delete</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar */}
            <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack(prev => ({ ...prev, open: false }))}>
                <Alert onClose={() => setSnack(prev => ({ ...prev, open: false }))} severity={snack.severity} sx={{ width: '100%' }}>
                    {snack.message}
                </Alert>
            </Snackbar>
        </Box >
    );
}