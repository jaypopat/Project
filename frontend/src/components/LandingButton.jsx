import "./LandingButton.css";
// eslint-disable-next-line react/prop-types
const LandingButton = ({ buttonText, onClick }) => {
  return (
    <div id="wrapper">
      <button className="button" onClick={onClick}>
        <p>{buttonText}</p>
      </button>
    </div>
  );
};
export default LandingButton;
