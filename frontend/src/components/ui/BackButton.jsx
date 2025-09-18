import { useNavigate } from "react-router-dom";
import back from "../../assets/icons/back.svg";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)}>
      <img src={back} alt="Back" style={{ width: "18px", height: "18px" }} />
    </button>
  );
}

export default BackButton;
