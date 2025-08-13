import { useEffect } from "react";
import useAuth from "@/utils/useAuth.js";

export default function LogoutPage() {
  const { signOut } = useAuth();
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, [signOut]);
  return (
    <main className="max-w-md mx-auto">
      <p className="text-gray-600">Çıkış yapılıyor…</p>
    </main>
  );
}


