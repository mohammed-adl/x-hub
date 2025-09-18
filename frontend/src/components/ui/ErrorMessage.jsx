export default function ErrorMessage({ message }) {
  return (
    <div
      style={{
        color: "red",
        padding: "1rem",
      }}
    >
      {message || "Something went wrong"}
    </div>
  );
}
