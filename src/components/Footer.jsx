import "./Footer.css";
import githubLogo from "../assets/github.png";


const Footer = () => {
  return (
    <footer className="footer">
      <a href="https://github.com/jaypopat/Project">
      <img id = "logo" src={githubLogo} alt="GitHub" />
      </a>
    </footer>
  );
};

export default Footer;
