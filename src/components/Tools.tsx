import { Box, Typography } from "@mui/material";
import gitLogo from "/src/assets/images/Git_icon.svg"
import githubLogo from "/src/assets/images/github.svg"

function Tools() {
  return (
    <Box id="tools" className="tools wf-section">
        <Box className="tools-container">
            <Typography variant="h1" className="heading-2">
                Tools
            </Typography>
            <Box className="tools-logos-block">
                <a
                title="Git"
                href="https://git-scm.com/"
                target="_blank"
                className="link-block-4 w-inline-block"
                >
                    <img
                        src={gitLogo}
                        loading="lazy"
                        alt="Git logo"
                        className="git-logo"
                    />
                </a>
                <a
                title="GitHub"
                href="https://github.com/miguelgisbert/"
                target="_blank"
                className="link-block-4 w-inline-block"
                >
                    <img
                        src={githubLogo}
                        loading="lazy"
                        alt="GitHub logo"
                        className="github-logo"
                    />
                </a>
            </Box>
        </Box>
    </Box>
  );
}

export default Tools;