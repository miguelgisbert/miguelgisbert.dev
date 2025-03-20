import { useState, useEffect, useRef } from 'react'
import profileImg from "/src/assets/images/profile.png"
import Header from "./components/Header"
import Expertise from './components/Expertise'
import Tools from './components/Tools'
import { Box, Typography, Grid } from "@mui/material"
import ContactForm from "./components/ContactForm"
import Footer from "./components/Footer"
import "./App.css"
import SocialIcons from './components/socialIcons'
import rapidProtoImg from "/src/assets/images/RapidProto.svg"
import bluecodeImg from "/src/assets/images/Screenshot-from-2022-12-10-18-34-15.png"
import venturesImg from "/src/assets/images/Screenshot-from-2022-12-10-18-37-39.png"
import itRecruitmentImg from "/src/assets/images/Screenshot-from-2022-12-10-18-43-06.png"
import hireplekImg from "/src/assets/images/hireplek.png"
import hrvenduranceImg from "/src/assets/images/hrvendurance.png"
import logoInefc from "/src/assets/images/inefc.png"
import logoEPS from "/src/assets/images/logo-eps.jpg"
import logoCAFD from "/src/assets/images/55fc0e333859ae0799cb2dcb709aaf59_400x400.jpeg"
import logoUV from "/src/assets/images/logo-uv.png"

function App() {

  const [headerOpacity, setHeaderOpacity] = useState<number>(0)
  const [boxOpacity, setBoxOpacity] = useState<number>(1)
  const boxRef = useRef<HTMLDivElement>(null)
  const profileImgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {

    const handleScroll = () => {
      const scrollPosition = window.scrollY

      // Header transition
      const newHeaderOpacity = Math.min(scrollPosition / 300, 1) // Visible at 300px scroll
      setHeaderOpacity(newHeaderOpacity)

      // Main Box transition
      const newBoxOpacity = Math.max(1 - scrollPosition / 300, 0) // Transparent at 300px scroll
      setBoxOpacity(newBoxOpacity)

    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <Header opacity={headerOpacity}/>
      <Box id="main" className="section">
        <Box className="container" 
            ref={boxRef}
            style={{
              opacity: boxOpacity,
              transition: 'opacity 0.5s, width 0.5s'
            }}>
          <Box className="div-block nameblock" style = {{ position: 'relative' }}>
            <img
                src = {profileImg}
                ref = {profileImgRef}
                className = "profileImage"
                loading = "lazy"
                sizes = "(max-width: 479px) 48vw, 218px"
                alt = "Miguel Gisbert profile picture"
                style = {{
                  position: 'absolute',
                  bottom: '0',
                  left: '-18px',
                  width: '200px',
                  height: '400px',
                  objectFit: 'cover',
                  objectPosition: 'top',
                  transition: 'transform 0.5s ease, top 0.5s ease, left 0.5s ease'
                }}
            />
            <Box className="names-block">
              <Typography variant="h1" className="heading mainname">
                Miguel Gisbert Osuna
              </Typography>
              <Box className="positions-names-block">
                <Typography variant="h1" className="heading position-name">
                  Software Engineer
                </Typography>
                <Typography variant="h2" className="heading secondary-position-name">
                  React Frontend Development
                </Typography>
              </Box>
            </Box>
            <Typography variant="h1" className="heading initialsname">
              mgo
            </Typography>

            <SocialIcons format = "main" />

          </Box>
        </Box>
      </Box>
      
      <Expertise />

      <Tools />

      <Box id="portfolio" className="section-2 portfolio portfolio wf-section">
        <Box className="container-2 w-container">
          <Typography variant="h1" className="heading-2">
            Portfolio
          </Typography>
          <Box className="portfolioblock">
            <a
              href="https://wearebluecode.com/rapid-prototyping/"
              target="_blank"
              className="link-block-11 w-inline-block"
            >
              <img
                src={rapidProtoImg}
                loading="lazy"
                width="200"
                alt="Rapid prototyping preview"
                className="image-2 div-block rapidprotoimage"
              />
            </a>
            <a
              href="https://wearebluecode.com/"
              target="_blank"
              className="link-block-12 w-inline-block"
            >
              <img
                src={bluecodeImg}
                loading="lazy"
                width="200"
                sizes="(max-width: 479px) 280px, 300px"
                alt="wearebluecode preview"
                className="image-2 div-block bcpicture"
              />
            </a>
            <a
              href="https://wearebluecode.com/ventures/"
              target="_blank"
              className="link-block-13 w-inline-block"
            >
              <img
                src={venturesImg}
                loading="lazy"
                width="200"
                sizes="(max-width: 479px) 280px, 300px"
                alt="Ventures development preview"
                className="venturespicture"
              />
            </a>
            <a
              href="https://wearebluecode.com/talent/ITRecruitment/"
              target="_blank"
              className="link-block-14 w-inline-block"
            >
              <img
                src={itRecruitmentImg}
                loading="lazy"
                width="200"
                alt="IT talent recruitment preview"
                className="talentpicture"
              />
            </a>
            <a
              href="https://hireplek.com/"
              target="_blank"
              className="link-block-15 w-inline-block"
            >
              <img
                src={hireplekImg}
                loading="lazy"
                width="200"
                alt="Hireplek"
                className="royaltypicture"
              />
            </a>
            <a
              href="https://hrvendurance.com/"
              target="_blank"
              className="link-block-15 w-inline-block"
            >
              <img
                src={hrvenduranceImg}
                loading="lazy"
                width="200"
                alt="HRV Endurance"
                className="royaltypicture"
              />
            </a>
          </Box>
        </Box>
      </Box>
      <Box id="education" className="education wf-section">
        <Box className="container-2 educationcontainer w-container">
          <Typography variant="h1" className="heading-2">
            Education
          </Typography>
          <Box className="educationblock">
            <a
              href="https://educacio.ua.es/en/estudios-de-la-facultad-de-educacion/grado-cafd/grado-en-ciencias-de-la-actividad-fisica-y-el-deporte.html"
              target="_blank"
              className="link-block w-inline-block"
            >
              <img
                src={logoCAFD}
                loading="lazy"
                alt="Sport Science logo"
                className="logo-cafd"
              />
              <Typography variant="h2" className="heading-4">
                Sport Science
              </Typography>
            </a>
            <a
              href="https://eps.ua.es/en/"
              target="_blank"
              className="link-block-2 w-inline-block"
            >
              <img
                src={logoEPS}
                loading="lazy"
                alt="Polytechnic School logo"
                className="logo-eps"
              />
              <Typography variant="h2" className="heading-3">
                Computer Science Engineer
              </Typography>
            </a>
            
            <a
              href="https://il3.ub.edu/master-tecnologia-deporte"
              target="_blank"
              className="link-block w-inline-block"
            >
              <img
                src={logoInefc}
                loading="lazy"
                alt="Sport Science logo"
                className="logo-inefc"
              />
              <Typography variant="h2" className="heading-4">
                Sports Technology Master's
              </Typography>
            </a>

            <a
              href="https://www.uv.es/uvweb/universidad/es/estudios-postgrado/titulos-propios-postgrado/oferta-titulos-propios/titulo-propio-uv-1286006703791.html?p5=24113370"
              target="_blank"
              className="link-block w-inline-block"
            >
              <img
                src={logoUV}
                loading="lazy"
                alt="Sport Science logo"
                className="logo-inefc"
              />
              <Typography variant="h2" className="heading-4">
                Startup Management Postgraduate
              </Typography>
            </a>
          </Box>
        </Box>
      </Box>
      <ContactForm />
      <Footer />
    </>
  )
}

export default App
