import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Paper,
    Link,
    IconButton,
    InputAdornment,
    CircularProgress,
    Alert,
    Collapse
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export default function Login() {
    const navigate = useNavigate();

    // State Yönetimi
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Giriş Fonksiyonu (Simülasyon)
    const handleLogin = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basit validasyon
        if (!email || !password) {
            setLoading(false);
            setError('Lütfen tüm alanları doldurunuz.');
            return;
        }

        // Backend'e istek atıyormuş gibi 1.5 saniye bekle
        setTimeout(() => {
            // Başarılı giriş simülasyonu
            setLoading(false);
            navigate('/home'); // Ana sayfaya yönlendir
        }, 1500);
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>

            {/* --- SOL TARAF (GÖRSEL ALANI) --- */}
            <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: (t) =>
                        t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                }}
            >
                {/* Görsel Üzeri Mor Filtre ve Yazı */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(104, 28, 217, 0.6)', // Marka rengin (#681CD9) ile transparan örtü
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        px: 4,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h2" fontWeight={700} sx={{ letterSpacing: 2, mb: 2 }}>
                        Hoş Geldiniz
                    </Typography>
                    <Typography variant="h5" fontWeight={300}>
                        Kurumsal Yönetim Paneli
                    </Typography>
                </Box>
            </Grid>

            {/* --- SAĞ TARAF (FORM ALANI) --- */}
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                <Box
                    sx={{
                        my: 8,
                        mx: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '80%'
                    }}
                >
                    {/* Logo veya İkon */}
                    <Box sx={{
                        m: 1,
                        bgcolor: '#f3e5f5',
                        p: 2,
                        borderRadius: '50%',
                        mb: 3
                    }}>
                        <LoginIcon sx={{ fontSize: 40, color: '#681CD9' }} />
                    </Box>

                    <Typography component="h1" variant="h4" fontWeight={700} sx={{ color: '#333', mb: 1 }}>
                        Giriş Yap
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                        Devam etmek için hesabınıza giriş yapın.
                    </Typography>

                    {/* Hata Mesajı */}
                    <Collapse in={!!error}>
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    </Collapse>

                    <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, width: '100%', maxWidth: 400 }}>

                        {/* Email Input */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Adresi"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: '#681CD9' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#681CD9' },
                                },
                                '& label.Mui-focused': { color: '#681CD9' }
                            }}
                        />

                        {/* Şifre Input */}
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Şifre"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: '#681CD9' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setShowPassword(!showPassword)}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': { borderColor: '#681CD9' },
                                },
                                '& label.Mui-focused': { color: '#681CD9' }
                            }}
                        />

                        {/* Beni Hatırla & Şifremi Unuttum */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                            <FormControlLabel
                                control={<Checkbox value="remember" sx={{ color: '#681CD9', '&.Mui-checked': { color: '#681CD9' } }} />}
                                label={<Typography fontSize={14}>Beni Hatırla</Typography>}
                            />
                            <Link href="#" variant="body2" sx={{ color: '#681CD9', textDecoration: 'none', fontWeight: 600 }}>
                                Şifremi Unuttum?
                            </Link>
                        </Box>

                        {/* Giriş Butonu */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                mt: 4,
                                mb: 2,
                                py: 1.5,
                                bgcolor: '#681CD9',
                                fontSize: 16,
                                fontWeight: 700,
                                borderRadius: 2,
                                boxShadow: '0 4px 12px rgba(104, 28, 217, 0.3)',
                                '&:hover': {
                                    bgcolor: '#5412b0',
                                    boxShadow: '0 6px 16px rgba(104, 28, 217, 0.4)',
                                }
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "GİRİŞ YAP"}
                        </Button>

                        {/* Kayıt Ol Linki */}
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Typography variant="body2" color="text.secondary">
                                    Hesabınız yok mu?{' '}
                                    <Link href="#" variant="body2" sx={{ color: '#681CD9', fontWeight: 700, textDecoration: 'none' }}>
                                        Kayıt Ol
                                    </Link>
                                </Typography>
                            </Grid>
                        </Grid>

                        <Box mt={5} textAlign="center">
                            <Typography variant="caption" color="text.secondary">
                                © 2025 Company Name. All rights reserved.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
}