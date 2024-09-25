import { Grid, Box } from '@mui/material'
import profileImg from "/src/assets/images/profile.png"
import SocialIcons from './socialIcons'
import { Height } from '@mui/icons-material'

const Header = ({ opacity }: { opacity: number }) => {

    return (
        <Grid container component="header" zIndex="1000" height="130px" width="100vw" padding="20px 50px"
            style={{
                opacity: opacity,
                transition: 'opacity 0.5s',
            }}
            sx={{
                position: 'fixed',
                display: 'flex',
                justifyContent: 'space-between',
                top: 0,
                left: 0,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url(/src/assets/images/PathForward-scaled-p-2000.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 1, 
                    zIndex: -1, 
                },
            }}>
               <Box
                    sx={{
                        position: 'relative',
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        border: '3px solid #E6A26AFF',
                        zIndex: 2,
                    }}
                    >
                    <img
                        src={profileImg}
                        loading="lazy"
                        sizes="(max-width: 479px) 48vw, 218px"
                        alt="Miguel Gisbert profile picture"
                        style={{
                        position: 'absolute',
                        top: '0',
                        left: '-18px',
                        width: '200px',
                        height: '200px',
                        objectFit: 'cover',
                        objectPosition: 'top',
                        }}
                    />
                </Box>
                <SocialIcons format = "header" />
        </Grid>
    )
}

export default Header


