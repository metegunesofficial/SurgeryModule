import { useEffect, useState } from "react";

export default function PasswordResetConfirmPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      const t = url.searchParams.get('token');
      setToken(t || "");
    }
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!token) {
      setError('Geçersiz bağlantı.');
      return;
    }
    if (password.length < 12 || password !== confirm) {
      setError('Parola kurallarına uymuyor.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || 'İşlem başarısız.');
        return;
      }
      setMessage('Parolanız güncellendi. Giriş sayfasına dönebilirsiniz.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Parolayı Sıfırla</h1>
      <form onSubmit={onSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Yeni Parola</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <p className="text-xs text-gray-500 mt-1">En az 12 karakter olmalı.</p>
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">Yeni Parola (Tekrar)</label>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        {message && <p className="text-sm text-green-700" role="status">{message}</p>}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-50">
          {loading ? 'Güncelleniyor...' : 'Parolayı Güncelle'}
        </button>
      </form>
    </main>
  );
}


