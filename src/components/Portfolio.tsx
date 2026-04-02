import { Box, Typography } from "@mui/material";
import cragXchangeImg from "/src/assets/images/cragXchange.png";
import bluecodeImg from "/src/assets/images/Screenshot-from-2022-12-10-18-34-15.png";
import lifonetImg from "/src/assets/images/lifonet.png";
import laiaBobeImg from "/src/assets/images/laiabobe.png";

const Portfolio = () => {
  return (
    <Box id="portfolio" className="section-2 portfolio portfolio wf-section">
      <Box className="container-2 w-container">
        <Typography variant="h1" className="heading-2">
          Portfolio
        </Typography>
        <Box className="portfolioblock">
          <a
            href="https://cragxchange.com/"
            target="_blank"
            className="link-block-11 w-inline-block"
          >
            <img
              src={cragXchangeImg}
              loading="lazy"
              width="200"
              alt="CragXchange preview"
              className="venturespicture"
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
            href="https://lifonet.com/"
            target="_blank"
            className="link-block-13 w-inline-block"
          >
            <img
              src={lifonetImg}
              loading="lazy"
              width="200"
              sizes="(max-width: 479px) 280px, 300px"
              alt="Lifonet preview"
              className="venturespicture"
            />
          </a>
          <a
            href="https://laiabobe.com/"
            target="_blank"
            className="link-block-14 w-inline-block"
          >
            <img
              src={laiaBobeImg}
              loading="lazy"
              width="200"
              alt="LaiaBobé preview"
              className="talentpicture"
            />
          </a>
        </Box>
      </Box>
    </Box>
  );
};

export default Portfolio;
