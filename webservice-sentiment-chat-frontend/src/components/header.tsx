import {AppBar, Toolbar, Typography, Avatar} from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const Header = () => {
    return (
        <AppBar position="fixed" color="transparent"
                sx={{ backgroundColor: '#00695c', color: '#fff' }}>
            <Toolbar>
                <Avatar
                    src="react.svg"
                    alt="Logo"
                    sx={{ marginRight: 2 }}
                >
                    <ChatIcon fontSize="small" />
                </Avatar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Chat app
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

export default Header;