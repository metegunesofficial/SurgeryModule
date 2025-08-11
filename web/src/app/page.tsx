import Link from "next/link";

export default function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Ameliyathane & Sterilizasyon Sistemi</h1>
      <p className="text-sm text-black/70 mb-4">Hızlı erişim:</p>
      <div className="flex gap-3">
        <Link className="rounded border px-3 py-2 hover:bg-black/5" href="/dashboard">Dashboard</Link>
        <Link className="rounded border px-3 py-2 hover:bg-black/5" href="/surgeries">Ameliyathane</Link>
        <Link className="rounded border px-3 py-2 hover:bg-black/5" href="/sterilization">Sterilizasyon</Link>
      </div>
    </div>
  );
}
