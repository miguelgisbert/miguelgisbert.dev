import { Box, Typography } from "@mui/material";
import gitLogo from "/src/assets/images/Git_icon.svg"
import githubLogo from "/src/assets/images/github.svg"
import gitlabLogo from "/src/assets/images/gitlab.png"
import npmLogo from "/src/assets/images/npm-logo.png"
import firebaseLogo from "/src/assets/images/firebase-logo.png"
import expoGoLogo from "/src/assets/images/expoGo-logo.png"
import vscodeLogo from "/src/assets/images/vscode.png"
import githubcopilotLogo from "/src/assets/images/github-copilot.png"

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
                <a
                    title="Gitlab"
                    href="https://about.gitlab.com/"
                    target="_blank"
                    className="link-block-4 w-inline-block"
                >
                    <img
                        src={gitlabLogo}
                        loading="lazy"
                        alt="Gitlab logo"
                        className="gitlab-logo"
                    />
                </a>
                <a
                    title="npm package manager"
                    href="https://www.npmjs.com/~miguelgisbert"
                    target="_blank"
                    className="link-block-4 w-inline-block"
                >
                    <img
                        src={npmLogo}
                        loading="lazy"
                        alt="npm logo"
                        className="npm-logo"
                    />
                </a>
                <a
                    title="Firebase"
                    href="https://firebase.google.com/"
                    target="_blank"
                    className="link-block-4 w-inline-block"
                >
                    <img
                        src={firebaseLogo}
                        loading="lazy"
                        alt="Firebase logo"
                        className="firebase-logo"
                    />
                </a>
                <a
                    title="Expo Go"
                    href="https://expo.dev/"
                    target="_blank"
                    className="link-block-4 w-inline-block"
                >
                    <img
                        src={expoGoLogo}
                        loading="lazy"
                        alt="Expo Go logo"
                        className="expogo-logo"
                    />
                </a>
                <a
                    title="Visual Studio Code"
                    href="https://code.visualstudio.com/"
                    target="_blank"
                    className="link-block-4 w-inline-block"
                >
                    <img
                        src={vscodeLogo}
                        loading="lazy"
                        alt="VS Code logo"
                        className="vscode-logo"
                    />
                </a>
                <a
                    title="GitHub Copilot"
                    href="https://github.com/features/copilot"
                    target="_blank"
                    className="link-block-4 w-inline-block"
                >
                    <img
                        src={githubcopilotLogo}
                        loading="lazy"
                        alt="Github Copilot"
                        className="gh-copilot-logo"
                    />
                </a>
            </Box>
        </Box>
    </Box>
  );
}

export default Tools;