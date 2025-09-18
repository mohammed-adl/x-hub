import * as icons from "../../assets/icons";
import styles from "./PostTweet.module.css";
import { useRef } from "react";

function OptionsBox({ onFileSelect }) {
  const mediaRef = useRef();

  const handleMediaRef = () => {
    mediaRef.current.click();
  };

  const handleSelectFile = (e) => {
    const files = Array.from(e.target.files);
    onFileSelect(files);
  };
  return (
    <div className={styles.optionsBox}>
      <button className={styles.optionButton} onClick={handleMediaRef}>
        <img src={icons.media} alt="media" className={styles.optionIcon} />
      </button>
      <input
        type="file"
        className={styles.fileInput}
        ref={mediaRef}
        style={{ display: "none" }}
        name="image"
        onChange={handleSelectFile}
        accept="image/*"
        multiple={true}
      />
    </div>
  );
}

export default OptionsBox;
