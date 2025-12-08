import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

// value ve onChange prop'larını ekledik
function SearchBar({ value, onChange }) {
    return (
        <TextField
            variant="standard"
            placeholder="Search..."
            // Artık kendi state'ini değil, parent'tan gelen değeri kullanıyor
            value={value}
            onChange={onChange}
            size="medium"
            sx={{
                width: 220, margin: 1, marginTop: 4, marginBottom: 3,
                "& .MuiInput-underline:before": {
                    borderBottomColor: "#5D10A4FF", // normal durum
                },
                "& .MuiInput-underline:hover:before": {
                    borderBottomColor: "#600985FF", // hover durum
                },
                "& .MuiInput-underline:after": {
                    borderBottomColor: "#901AA5FF", // focus durum
                },
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start" sx={{ color: '#5A189A' }}>
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
}

export default SearchBar;