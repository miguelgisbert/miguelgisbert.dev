import { FC } from 'react'
import { Grid, Box } from '@mui/material'
import profileImg from "../assets/images/profile.png"




const Header: FC = () => {

    // const [mainLogoBGopacity, setMainLogoBGopacity] = useState<number>(1)
    
    // const group1Ref = useRef<HTMLImageElement>(null)
    // const group2Ref = useRef<HTMLImageElement>(null)
    // useEffect(() => {
    //     const handleScroll = () => {  
    //       const scrollY = window.scrollY
    //       const maxScroll = 500
    //       const initialTop = (window.innerHeight * 0.5 + 100)
    //       const initialLeft1 = window.innerWidth * 0.2
    //       const initialLeft2 = window.innerWidth * 0.2
    //       const finalTop1 = 30
    //       const finalTop2 = 25
    //       const finalLeft1 = 50
    //       const finalLeft2 = 190
    //       const initialSize = 235
    //       const finalSize1 = initialSize / 2
    //       const finalSize2 = initialSize / 1.7
    //       const size1 = Math.max(finalSize1, initialSize - (scrollY / maxScroll) * initialSize)
    //       const size2 = Math.max(finalSize2, initialSize - (scrollY / maxScroll) * initialSize)
    //       const top1 = scrollY >= maxScroll ? finalTop1 : initialTop - (scrollY / maxScroll) * (initialTop - finalTop1)
    //       const top2 = scrollY >= maxScroll ? finalTop2 : initialTop - (scrollY / maxScroll) * (initialTop - finalTop2)
    //       const left1 = scrollY >= maxScroll ? finalLeft1 : initialLeft1 - (scrollY / maxScroll) * (initialLeft1 - finalLeft1)
    //       const left2 = scrollY >= maxScroll ? finalLeft2 : initialLeft2 - (scrollY / maxScroll) * (initialLeft2 - finalLeft2)
    //       const transformValue = Math.max(0, 100 - (scrollY / maxScroll) * 100)
    //       const BGopacity = Math.max(0, 1 -(scrollY / maxScroll))
    //       if(group1Ref.current && group2Ref.current) {
    //         group1Ref.current.style.top = `${top1}px`
    //         group1Ref.current.style.left = `${left1}px`
    //         group1Ref.current.style.width = `${size1}px`
    //         group1Ref.current.style.transform = `translate(0, calc(-${transformValue}% - 14px))`
    //         group2Ref.current.style.top = `${top2}px`
    //         group2Ref.current.style.left = `${left2}px`
    //         group2Ref.current.style.width = `${size2}px`
    //       }
    //       setMainLogoBGopacity(BGopacity)
    //     }
    //     window.addEventListener('scroll', handleScroll)
    //     return () => window.removeEventListener('scroll', handleScroll)
    //   }, [])

    return (
        <Grid container component="header" zIndex="1000" height="130px" width="100vw" padding="20px 50px"
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: 'url(/miguelgisbert.dev/src/assets/images/PathForward-scaled-p-2000.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                opacity: 0.7, // Ajusta l'opacitat aquí (0.0 a 1.0)
                zIndex: -1, // Assegura't que estigui darrere del contingut
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
            {/* <Grid container item xs={12} md={4} alignItems="center" justifyContent="start">
                <Box component="img" src={logoPart2} ref={group2Ref} sx={{ width:"235px", position:"fixed", zIndex:"10", top:"calc(50% + 100px)", left:"20%" }} />
                <Box component="img" src={logoPart1} ref={group1Ref} sx={{ width:"235px", position:"fixed", zIndex:"10", top:"calc(50% + 100px)", left:"20%", transform: "translate(0, calc(-100% - 14px))" }} />
                {theme.palette.mode !== "dark" && (
                  <Card sx={{ opacity: mainLogoBGopacity, width:"350px", height:"350px", position:"fixed", top: "calc(50% + 100px)", left: "20%", zIndex: 1, transform: "translate(-18%, -58%)", backgroundColor: theme => theme.palette.secondary.main}}></Card>
                )}
            </Grid> */}
        </Grid>
    )
}

export default Header


