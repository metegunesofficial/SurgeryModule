import { useState } from "react";
import useAuth from "@/utils/useAuth.js";

export default function SignInPage() {
  const { signInWithCredentials, signUpWithCredentials } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const action = mode === "signin" ? signInWithCredentials : signUpWithCredentials;
      await action({ email, password, callbackUrl: "/" });
    } catch (err) {
      setError("İşlem başarısız. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">
        {mode === "signin" ? "Giriş Yap" : "Kayıt Ol"}
      </h1>
      <form onSubmit={onSubmit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-gray-700 mb-1">Parola</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600" role="alert">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "İşleniyor..." : mode === "signin" ? "Giriş Yap" : "Kayıt Ol"}
        </button>
      </form>
      <div className="text-sm text-gray-600 mt-3 space-y-2">
        {mode === "signin" ? (
          <button className="underline" onClick={() => setMode("signup")}>Hesabın yok mu? Kayıt ol</button>
        ) : (
          <button className="underline" onClick={() => setMode("signin")}>Zaten hesabın var mı? Giriş yap</button>
        )}
        <div>
          <a className="underline" href="/account/reset/request">Parolanı mı unuttun?</a>
        </div>
      </div>
    </main>
  );
}


