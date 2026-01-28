import Card from "../ui/Card";

export default function SimpleStat({ title, value }) {
  return (
    <Card>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  );
}
