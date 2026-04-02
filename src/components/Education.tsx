import { Box, Typography } from "@mui/material";
import logoCAFD from "/src/assets/images/55fc0e333859ae0799cb2dcb709aaf59_400x400.jpeg";
import logoEPS from "/src/assets/images/logo-eps.jpg";
import logoInefc from "/src/assets/images/inefc.png";
import logoUV from "/src/assets/images/logo-uv.png";

const Education = () => {
  return (
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
  );
};

export default Education;
