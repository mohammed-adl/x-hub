import XLogo from "../../assets/XLogo.svg";
export default function SplashScreen() {
  return (
    <div
      id="splash"
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        display: "grid",
        placeItems: "center",
        zIndex: 9999,
      }}
    >
      <img src={XLogo} width={100} alt="Loading" />
    </div>
  );
}
