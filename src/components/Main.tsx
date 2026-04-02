import { Box, Typography } from "@mui/material";
import SocialIcons from "./socialIcons";
import profileImg from "/src/assets/images/profile.png";
import { useRef } from "react";

const Main = ({ boxOpacity }: { boxOpacity: number }) => {
  const profileImgRef = useRef<HTMLImageElement>(null);

  return (
    <Box id="main" className="section">
        <Box
            className="container"
            style={{
            opacity: boxOpacity,
            transition: "opacity 0.5s, width 0.5s",
            }}
        >
            <Box className="div-block nameblock" style={{ position: "relative" }}>
            <img
                src={profileImg}
                ref={profileImgRef}
                className="profileImage"
                loading="lazy"
                sizes="(max-width: 479px) 48vw, 218px"
                alt="Miguel Gisbert profile picture"
                style={{
                position: "absolute",
                bottom: "0",
                left: "-18px",
                width: "200px",
                height: "400px",
                objectFit: "cover",
                objectPosition: "top",
                transition: "transform 0.5s ease, top 0.5s ease, left 0.5s ease",
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
                <Typography
                    variant="h2"
                    className="heading secondary-position-name"
                >
                    React Frontend Development
                </Typography>
                </Box>
            </Box>
            <Typography variant="h1" className="heading initialsname">
                mgo
            </Typography>
            <SocialIcons format="main" />
            </Box>
        </Box>
    </Box>
  );
};

export default Main;
