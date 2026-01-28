export default function Button({
  children,
  type = "button",
  variant = "primary",
  loading = false,
  ...props
}) {
  const base =
    "px-4 py-2 rounded-lg font-medium transition disabled:opacity-60";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  return (
    <button
      type={type}
      disabled={loading}
      className={`${base} ${variants[variant]}`}
      {...props}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
