import { Grid } from '@mui/material'

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <Grid container component="footer" height="100px" width="100%" padding="20px 50px"
            sx={{
                display: 'block',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'black',
                bottom: 0,
                left: 0,
                zIndex: 1000,
            }}>
            <p>© {currentYear} Miguel Gisbert Osuna</p>
            <a href="mailto:info@miguelgisbert.dev" target="_blank">info@miguelgisbert.dev</a>
        </Grid>
    )
}

export default Footer