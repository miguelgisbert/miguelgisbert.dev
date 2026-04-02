import { Button } from "@mui/material";

const CVButton = () => {
    return (
        <Button
            variant="contained"
            color="primary"
            href="/CVMiguelGisbert.pdf"
            target="_blank"
            rel="noopener noreferrer"
        >
            View/Download CV
        </Button>
    );
};

export default CVButton;