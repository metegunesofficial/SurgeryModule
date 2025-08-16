import { useEffect, useState } from 'react';

export default function HospitalHome() {
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean)[0] : null;

  useEffect(() => {
    let isMounted = true;
    async function fetchTenant() {
      try {
        const res = await fetch(`/api/tenants?slug=${encodeURIComponent(slug)}`);
        const data = await res.json();
        if (isMounted) setTenant(data);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (slug) fetchTenant();
    return () => { isMounted = false; };
  }, [slug]);

  if (loading) return <div className="p-6">Yükleniyor...</div>;
  if (!tenant) return <div className="p-6">Klinik/Hastane bulunamadı.</div>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold text-gray-900">{tenant.name}</h1>
      <div className="text-sm text-gray-600">Tip: {tenant.is_demo ? 'Demo' : 'Live'}</div>
      <div className="text-sm text-gray-600">Slug: {tenant.slug}</div>
      <section className="mt-6">
        <a className="text-blue-600 underline" href={`/${tenant.slug}/ameliyat-planlama`}>Ameliyat Planlama</a>
      </section>
    </main>
  );
}


