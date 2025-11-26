import { AppBar, Toolbar, Typography } from "@mui/material";
import { Wifi } from "@mui/icons-material";

function App() {
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Wifi sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div">
                        WebSockets – Client
                    </Typography>
                </Toolbar>
            </AppBar>
        </>
    );
}

export default App;
