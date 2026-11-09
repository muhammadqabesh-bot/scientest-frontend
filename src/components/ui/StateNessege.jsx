const toneClasses = {
  muted: "text-text-muted",
  danger: "text-danger",
};

export default function StateMessage({ tone = "muted", children }) {
  return (
    <p
      className={`py-6 text-center text-sm ${toneClasses[tone] ?? toneClasses.muted}`}
    >
      {children}
    </p>
  );
}
