import { useState, useEffect, useRef } from 'react'
import profileImg from "/src/assets/images/profile.png"
import Header from "./components/Header"
import { Box, Typography } from "@mui/material"
import ContactForm from "./components/ContactForm"
import "./App.css"
import SocialIcons from './components/socialIcons'
import pythonLogo from "/src/assets/images/python.png"
import flutterLogo from "/src/assets/images/flutter.png"
import reactLogo from "/src/assets/images/react.svg"
import javascriptLogo from "/src/assets/images/Javascript.svg"
import htmlLogo from "/src/assets/images/HTML5.svg"
import cssLogo from "/src/assets/images/CSS3.svg"
import phpLogo from "/src/assets/images/PHP-logo.svg"
import mysqlLogo from "/src/assets/images/mysql.svg"
import rapidProtoImg from "/src/assets/images/RapidProto.svg"
import bluecodeImg from "/src/assets/images/Screenshot-from-2022-12-10-18-34-15.png"
import venturesImg from "/src/assets/images/Screenshot-from-2022-12-10-18-37-39.png"
import itRecruitmentImg from "/src/assets/images/Screenshot-from-2022-12-10-18-43-06.png"
import hireplekImg from "/src/assets/images/hireplek.png"
import hrvenduranceImg from "/src/assets/images/hrvendurance.png"
import logoUA from "/src/assets/images/logo-ua.jpg"
import logoEPS from "/src/assets/images/cabecera.jpg"
import logoCAFD from "/src/assets/images/55fc0e333859ae0799cb2dcb709aaf59_400x400.jpeg"

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
            <Box className="div-block-3">
              <Typography variant="h1" className="heading mainname">
                Miguel Gisbert Osuna
              </Typography>
              <Typography variant="h1" className="heading positionname">
                Fullstack Web Developer
              </Typography>
            </Box>
            <Typography variant="h1" className="heading initialsname">
              mgo
            </Typography>

            <SocialIcons format = "main" />

          </Box>
        </Box>
      </Box>
      <Box id="expertise" className="expertise wf-section">
        <Box className="expertise-container">
          <Typography variant="h1" className="heading-2">
            Expertise
          </Typography>
          <Box className="expertise-logos-block">
            <a
              title="Python"
              href="https://python.org/"
              target="_blank"
              className="link-block-4 w-inline-block"
            >
              <img
                src={pythonLogo}
                loading="lazy"
                alt="Python logo"
                className="image-13"
              />
            </a>
            <a
              title="Flutter"
              href="https://flutter.dev/"
              target="_blank"
              className="link-block-5 w-inline-block"
            >
              <img
                src={flutterLogo}
                loading="lazy"
                alt="Flutter logo"
                className="image-13"
              />
            </a>
            <a
              title="React"
              href="https://react.dev/"
              target="_blank"
              className="link-block-8 w-inline-block"
            >
              <img
                src={reactLogo}
                loading="lazy"
                alt="React logo"
                className="image-14"
              />
            </a>
            <a
              title="Javascript"
              href="https://en.wikipedia.org/wiki/JavaScript"
              target="_blank"
              className="link-block-8 w-inline-block"
            >
              <img
                src={javascriptLogo}
                loading="lazy"
                alt="Javascript logo"
                className="image-8"
              />
            </a>
            <a
              title="html"
              href="https://en.wikipedia.org/wiki/HTML"
              target="_blank"
              className="link-block-6 w-inline-block"
            >
              <img
                src={htmlLogo}
                loading="lazy"
                alt="Html logo"
                className="image-11"
              />
            </a>
            <a
              title="css"
              href="https://en.wikipedia.org/wiki/CSS"
              target="_blank"
              className="link-block-7 w-inline-block"
            >
              <img
                src={cssLogo}
                loading="lazy"
                alt="Css logo"
                className="image-7"
              />
            </a>
            <a
              title="php"
              href="https://php.net"
              target="_blank"
              className="link-block-9 w-inline-block"
            >
              <img
                src={phpLogo}
                loading="lazy"
                alt="Php logo"
                className="image-4"
              />
            </a>
            <a
              title="MySql"
              href="https://www.mysql.com/"
              target="_blank"
              className="link-block-10 w-inline-block"
            >
              <img
                src={mysqlLogo}
                loading="lazy"
                alt="MySql logo"
                className="image-5"
              />
            </a>
          </Box>
        </Box>
      </Box>
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
          <Box className="webflowblock">
            <a
              href="https://www.ua.es/en/"
              target="_blank"
              className="uadiv w-inline-block"
            >
              <img
                src={logoUA}
                loading="lazy"
                alt="University of Alicante logo"
                className="image-20"
              />
            </a>
          </Box>
          <Box className="educationblock">
            <a
              href="https://eps.ua.es/en/"
              target="_blank"
              className="link-block-2 w-inline-block"
            >
              <img
                src={logoEPS}
                loading="lazy"
                alt="Polytechnic School logo"
                className="image-18"
              />
              <Typography variant="h2" className="heading-3">
                Computer Science Engineer
              </Typography>
            </a>
            <a
              href="https://educacio.ua.es/en/estudios-de-la-facultad-de-educacion/grado-cafd/grado-en-ciencias-de-la-actividad-fisica-y-el-deporte.html"
              target="_blank"
              className="link-block w-inline-block"
            >
              <img
                src={logoCAFD}
                loading="lazy"
                alt="Sport Science logo"
                className="image-17"
              />
              <Typography variant="h2" className="heading-4">
                Sport Science
              </Typography>
            </a>
          </Box>
        </Box>
      </Box>
      <ContactForm />
    </>
  )
}

export default App
