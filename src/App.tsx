import { useState, useEffect } from "react";
import Header from "./components/Header";
import Expertise from "./components/Expertise";
import Tools from "./components/Tools";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";
import "./App.css";
import Main from "./components/Main";
import Portfolio from "./components/Portfolio";
import Education from "./components/Education";

function App() {
  const [headerOpacity, setHeaderOpacity] = useState<number>(0);
  const [boxOpacity, setBoxOpacity] = useState<number>(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;

      // Header transition
      const newHeaderOpacity = Math.min(scrollPosition / 300, 1); // Visible at 300px scroll
      setHeaderOpacity(newHeaderOpacity);

      // Main Box transition
      const newBoxOpacity = Math.max(1 - scrollPosition / 300, 0); // Transparent at 300px scroll
      setBoxOpacity(newBoxOpacity);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Header opacity={headerOpacity} />
      <Main boxOpacity={boxOpacity} />
      {/* <CVButton /> */}
      <Expertise />
      <Tools />
      <Portfolio />
      <Education />
      <ContactForm />
      <Footer />
    </>
  );
}

export default App;
