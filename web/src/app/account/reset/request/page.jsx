import { useState } from "react";

export default function PasswordResetRequestPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/password/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Parolayı Sıfırla</h1>
      {sent ? (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded p-4">
          Eğer kayıtlı bir hesabın varsa, kısa süre içinde parola sıfırlama bağlantısı e-posta adresine gönderildi.
        </div>
      ) : (
        <form onSubmit={onSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">E-posta</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
          </button>
        </form>
      )}
    </main>
  );
}


