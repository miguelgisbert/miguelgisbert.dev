import { Box, Typography } from "@mui/material";
import pythonLogo from "/src/assets/images/python.png"
import reactNativeLogo from "/src/assets/images/reactNative.png"
import reactLogo from "/src/assets/images/react.svg"
import javascriptLogo from "/src/assets/images/Unofficial_JavaScript_logo_2.svg"
import typescriptLogo from "/src/assets/images/Typescript_logo_2020.svg"
import cssLogo from "/src/assets/images/Official_CSS_Logo.svg"
import phpLogo from "/src/assets/images/PHP-logo.svg"

function Expertise() {
  return (
    <Box id="expertise" className="expertise wf-section">
        <Box className="expertise-container">
            <Typography variant="h1" className="heading-2">
                Expertise
            </Typography>
            <Box className="expertise-logos-block">
                <div className="logos-left">
                    <a
                        title="Python"
                        href="https://en.wikipedia.org/wiki/Python_(programming_language)"
                        target="_blank"
                        className="link-block-8 w-inline-block"
                    >
                        <img
                            src={pythonLogo}
                            loading="lazy"
                            alt="Python logo"
                            className="python-logo"
                        />
                    </a>
                    <a
                        title="React Native"
                        href="https://reactnative.dev/"
                        target="_blank"
                        className="link-block-8 w-inline-block"
                    >
                        <img
                            src={reactNativeLogo}
                            loading="lazy"
                            alt="React Native"
                            className="react-native-logo"
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
                            className="javascript-logo"
                        />
                    </a>
                </div>
                <div className="react-logo-container">
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
                            className="react-logo"
                        />
                    </a>
                </div>
                <div className="logos-right">
                    <a
                        title="typescript"
                        href="https://www.typescriptlang.org/"
                        target="_blank"
                        className="link-block-6 w-inline-block"
                    >
                        <img
                            src={typescriptLogo}
                            loading="lazy"
                            alt="Typescript logo"
                            className="typescript-logo"
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
                            className="css-logo"
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
                            className="php-logo"
                        />
                    </a>
                </div>
            </Box>
        </Box>
    </Box>
  );
}

export default Expertise;