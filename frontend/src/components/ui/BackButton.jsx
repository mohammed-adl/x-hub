import { useNavigate } from "react-router-dom";
import back from "../../assets/icons/back.svg";

function BackButton({ onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleClick}>
      <img src={back} alt="Back" style={{ width: "18px", height: "18px" }} />
    </button>
  );
}

export default BackButton;
