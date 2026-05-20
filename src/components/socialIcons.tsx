import GitHub from '@mui/icons-material/GitHub'
import LinkedIn from '@mui/icons-material/LinkedIn'

interface SocialIconsFormat { format: "header" | "main" | "mobile" }

const SocialIcons = ({ format }: SocialIconsFormat) => {
  const iconSize = format === "header" ? 20 : 28
  const svgSize = format === "header" ? 20 : 28
  return (
    <div style={{ display: 'flex', gap: format === "header" ? 0 : 8, alignItems: 'center' }}>
      <a
        href="https://www.linkedin.com/in/miguel-gisbert-osuna/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
        className="social-link"
      >
        <LinkedIn sx={{ fontSize: iconSize }} />
      </a>
      <a
        href="https://github.com/miguelgisbert/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub"
        className="social-link"
      >
        <GitHub sx={{ fontSize: iconSize }} />
      </a>
      {format !== "main" && (
        <a
          href="https://www.npmjs.com/~miguelgisbert"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="npm"
          className="social-link"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: svgSize,
            height: svgSize,
            borderRadius: 4,
            background: 'currentColor',
            color: '#fafafa',
            fontFamily: 'Inter, monospace',
            fontSize: svgSize * 0.42,
            fontWeight: 700,
            lineHeight: 1,
            padding: '0 2px',
            letterSpacing: '-0.3px',
          }}>npm</span>
        </a>
      )}
    </div>
  )
}

export default SocialIcons
