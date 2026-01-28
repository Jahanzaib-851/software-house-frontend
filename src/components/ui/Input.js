export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium">{label}</label>}
      <input
        className="border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        {...props}
      />
    </div>
  );
}
