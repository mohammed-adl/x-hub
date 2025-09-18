export default function Spinner({ size = 18, border = 2, speed = 0.6 }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          border: `${border}px solid rgba(0,0,0,0.1)`,
          borderTopColor: "#1d9bf0",
          borderRadius: "50%",
          animation: `spin ${speed}s linear infinite`,
        }}
      />
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
