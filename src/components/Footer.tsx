const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>&copy; {year} Miguel Gisbert</span>
        <div className="footer__links">
          <a href="mailto:info@miguelgisbert.dev">info@miguelgisbert.dev</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
