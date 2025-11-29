import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar() {
    const [query, setQuery] = useState("");

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    return (
        <TextField
            variant="standard"
            placeholder="Search..."
            value={query}
            onChange={handleChange}
            size="medium" // yüksekliği küçültür
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
