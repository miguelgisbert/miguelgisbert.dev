import { Box, IconButton } from "@mui/material"

interface SocialIconsFormat {
    format: "header" | "main" | "mobile"
}

const SocialIcons = ({ format }: SocialIconsFormat) => {
    return (
        <Box style = {{ marginBottom: format === "header" ? "20px" : "0" }}>
            <IconButton
                href = "https://www.linkedin.com/in/miguel-gisbert-osuna/"
                target = "_blank"
                className = { format === "main" ? "main-linkedin-icon" : "" }
                aria-label = "LinkedIn"
                >
                <svg className="linkedInBtnSVG"  x="0px" y="0px" style={{ width: '30px', height: '30px' }} viewBox="0 0 438.536 438.536" >
                    <g>
                    <path fill="currentcolor" d="M414.41,24.123C398.333,8.042,378.963,0,356.315,0H82.228C59.58,0,40.21,8.042,24.126,24.123   C8.045,40.207,0.003,59.576,0.003,82.225v274.084c0,22.647,8.042,42.018,24.123,58.102c16.084,16.084,35.454,24.126,58.102,24.126   h274.084c22.648,0,42.018-8.042,58.095-24.126c16.084-16.084,24.126-35.454,24.126-58.102V82.225   C438.532,59.576,430.49,40.204,414.41,24.123z M133.618,367.157H67.666V169.016h65.952V367.157z M127.626,132.332   c-6.851,6.567-15.893,9.851-27.124,9.851h-0.288c-10.848,0-19.648-3.284-26.407-9.851c-6.76-6.567-10.138-14.703-10.138-24.41   c0-9.897,3.476-18.083,10.421-24.556c6.95-6.471,15.942-9.708,26.98-9.708c11.039,0,19.89,3.237,26.553,9.708   c6.661,6.473,10.088,14.659,10.277,24.556C137.899,117.625,134.477,125.761,127.626,132.332z M370.873,367.157h-65.952v-105.92   c0-29.879-11.036-44.823-33.116-44.823c-8.374,0-15.42,2.331-21.128,6.995c-5.715,4.661-9.996,10.324-12.847,16.991   c-1.335,3.422-1.999,8.75-1.999,15.981v110.775h-65.952c0.571-119.529,0.571-185.579,0-198.142h65.952v27.974   c13.867-21.681,33.558-32.544,59.101-32.544c22.84,0,41.21,7.52,55.104,22.554c13.895,15.037,20.841,37.214,20.841,66.519v113.64   H370.873z"></path>
                    </g>
                </svg>
            </IconButton>
            <IconButton
                href = "https://github.com/miguelgisbert/"
                target = "_blank"
                className = { format === "main" ? "main-github-icon" : "" }
                aria-label = "GitHub"
                >
                <svg xmlns = "http://www.w3.org/2000/svg" className="githubBtnSVG" style={{ width: '30px', height: '30px' }} viewBox="0 0 1024 1024" fill="none" >
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" transform="scale(64)" fill="currentcolor"/>
                </svg>
            </IconButton>
            <IconButton
                href = "https://www.npmjs.com/~miguelgisbert"
                target = "_blank"
                className = { format === "main" ? "main-npm-icon" : "" }
                aria-label = "NPM"
                >
                <svg className="npmBtnSVG" x="0px" y="0px" style={{ width: '30px', height: '30px' }} viewBox="0 0 18 7" >
                    <path fill="none" d="M0,0h18v6H9v1H5V6H0V0z M1,5h2V2h1v3h1V1H1V5z M6,1v5h2V5h2V1H6z M8,2h1v2H8V2z M11,1v4h2V2h1v3h1V2h1v3h1V1H11z"/>
                    <polygon fill="currentcolor" points="1,5 3,5 3,2 4,2 4,5 5,5 5,1 1,1 "/>
                    <path fill="currentcolor" d="M6,1v5h2V5h2V1H6z M9,4H8V2h1V4z"/>
                    <polygon fill="currentcolor" points="11,1 11,5 13,5 13,2 14,2 14,5 15,5 15,2 16,2 16,5 17,5 17,1 "/>
                </svg>
            </IconButton>
        </Box>
    )
}

export default SocialIcons