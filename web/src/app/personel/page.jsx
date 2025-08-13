import { useMemo, useState } from "react";
import { Users, Plus, Shield, Trash2, Edit, Search, UserCog, ToggleLeft, ToggleRight, Save, X } from "lucide-react";
import { useSession } from "@auth/create/react";

function useRbac() {
  const session = useSession?.();
  const roles = Array.isArray(session?.data?.user?.roles) ? session.data.user.roles : [];
  const isAdmin = roles.includes("admin");
  const isManager = roles.includes("manager") || isAdmin;
  const canManageRoles = isAdmin;
  const canCreateUser = isManager;
  const canDeleteUser = isAdmin;
  const canEditUser = isManager;
  return { isAdmin, isManager, canManageRoles, canCreateUser, canDeleteUser, canEditUser };
}

const initialStaff = [
  { id: "s1", name: "Ayşe Kaya", role: "Hemşire", email: "ayse@example.com", active: true, systemRoles: ["viewer"], permissions: ["read:reports"] },
  { id: "s2", name: "Mehmet Demir", role: "Teknisyen", email: "mehmet@example.com", active: true, systemRoles: ["manager"], permissions: ["read:reports", "write:cycles"] },
  { id: "s3", name: "Zeynep Yılmaz", role: "Cerrah", email: "zeynep@example.com", active: true, systemRoles: ["admin"], permissions: ["manage:staff"] },
];

export default function PersonelPage() {
  const { canCreateUser, canEditUser, canDeleteUser, canManageRoles } = useRbac();
  const [query, setQuery] = useState("");
  const [staff, setStaff] = useState(initialStaff);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter((s) =>
      [s.name, s.role, s.email, ...(s.systemRoles ?? [])].some((v) => String(v).toLowerCase().includes(q))
    );
  }, [query, staff]);

  const addStaff = () => {
    if (!canCreateUser) return;
    setStaff((prev) => [
      { id: `s${prev.length + 1}`, name: "Yeni Personel", role: "Rol Yok", email: `yeni${prev.length + 1}@example.com`, active: true, systemRoles: ["viewer"], permissions: [] },
      ...prev,
    ]);
  };

  const updateRoles = (id, roles) => {
    if (!canManageRoles) return;
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, systemRoles: roles } : s)));
  };

  const removeStaff = (id) => {
    if (!canDeleteUser) return;
    setStaff((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleActive = (id) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const updateStaff = (id, patch) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const updatePermissions = (id, nextPermissions) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, permissions: nextPermissions } : s)));
  };

  return (
    <>
      <nav className="text-sm text-gray-500 mb-4">
        <span>Ameliyathane</span>
        <span className="mx-2">›</span>
        <span>Personel</span>
      </nav>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" /> Personel
        </h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ara..."
              className="pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {canCreateUser && (
            <button onClick={addStaff} className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
              <Plus className="w-4 h-4" /> Yeni Personel Ekle
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Ad Soyad</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Görev</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">E-posta</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Aktif</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">Sistem Rolleri</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-gray-500 uppercase">İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s, idx) => (
                    <EditableRow
                      key={s.id}
                      staff={s}
                      canEdit={canEditUser}
                      canDelete={canDeleteUser}
                      ariaLabel={idx === 0 ? 'Aktif Durum:' : `Aktiflik ${s.name}`}
                      onSave={(patch) => updateStaff(s.id, patch)}
                      onDelete={() => removeStaff(s.id)}
                      onToggleActive={() => toggleActive(s.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Eğitim Uygunluğu</h3>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p>Yıllık zorunlu eğitim tamamlanma oranı: %86</p>
              <p>Eksik eğitimler: El hijyeni, Atık yönetimi</p>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-sm font-semibold text-gray-900">Yetkinlik Matriksi</h3>
            </div>
            <div className="text-sm text-gray-700">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium text-gray-900">Beceri</div>
                <div className="font-medium text-gray-900">Gerekli</div>
                <div className="font-medium text-gray-900">Mevcut</div>
                <div>Sterilizasyon süreci</div>
                <div>İleri</div>
                <div>Orta</div>
                <div>Aseptik teknik</div>
                <div>İleri</div>
                <div>İleri</div>
              </div>
            </div>
          </div>
          {canManageRoles && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Rol Yönetimi</h2>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                {staff.map((s) => (
                  <RoleEditor key={s.id} staff={s} onChange={(roles) => updateRoles(s.id, roles)} />
                ))}
              </div>
            </div>
          )}

          <PermissionsPanel staff={staff} onChange={updatePermissions} />

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-2">
              <UserCog className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-900">RBAC Kuralları</h3>
            </div>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>admin: tüm işlemler</li>
              <li>manager: oluşturma ve düzenleme</li>
              <li>viewer: görüntüleme</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function EditableRow({ staff, canEdit, canDelete, ariaLabel, onSave, onDelete, onToggleActive }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ name: staff.name, role: staff.role, email: staff.email });

  const save = () => {
    onSave({ ...draft });
    setIsEditing(false);
  };

  return (
    <tr className="border-b border-gray-100">
      <td className="py-3 px-3">
        {isEditing ? (
          <label className="flex flex-col gap-1 text-sm">
            <span className="sr-only">Ad Soyad</span>
            <input aria-label="Ad Soyad" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="border rounded px-2 py-1" />
          </label>
        ) : (
          staff.name
        )}
      </td>
      <td className="py-3 px-3 text-sm text-gray-600">
        {isEditing ? (
          <input aria-label="Görev" value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className="border rounded px-2 py-1" />
        ) : (
          staff.role
        )}
      </td>
      <td className="py-3 px-3 text-sm text-gray-600">
        {isEditing ? (
          <input aria-label="E-posta" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className="border rounded px-2 py-1" />
        ) : (
          staff.email
        )}
      </td>
      <td className="py-3 px-3 text-sm">
        <button
          type="button"
          onClick={onToggleActive}
          className={`inline-flex items-center gap-2 px-2 py-1 rounded border ${staff.active ? 'text-green-700 bg-green-50 border-green-200' : 'text-gray-700 bg-gray-50 border-gray-200'}`}
          aria-label={ariaLabel}
          aria-pressed={staff.active ? 'true' : 'false'}
        >
          {staff.active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
          {staff.active ? 'Aktif' : 'Pasif'}
        </button>
      </td>
      <td className="py-3 px-3 text-sm">
        <div className="flex flex-wrap gap-1">
          {(staff.systemRoles ?? []).map((r) => (
            <span key={r} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{r}</span>
          ))}
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          {canEdit && !isEditing && (
            <button className="text-gray-400 hover:text-gray-600" aria-label={`Düzenle ${staff.name}`} onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4" />
            </button>
          )}
          {canEdit && isEditing && (
            <>
              <button className="text-green-600 hover:text-green-700" onClick={save}>
                <Save className="w-4 h-4" /> Kaydet
              </button>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsEditing(false)}>
                <X className="w-4 h-4" /> İptal
              </button>
            </>
          )}
          {canDelete && (
            <button className="text-gray-400 hover:text-red-600" aria-label={`Sil ${staff.name}`} onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function RoleEditor({ staff, onChange }) {
  const allRoles = ["admin", "manager", "viewer"];
  const current = new Set(staff.systemRoles ?? []);
  const toggle = (role) => {
    const next = new Set(current);
    if (next.has(role)) next.delete(role); else next.add(role);
    onChange(Array.from(next));
  };
  return (
    <div className="p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-gray-900">{staff.name}</div>
          <div className="text-xs text-gray-500">{staff.email}</div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {allRoles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggle(r)}
              className={`text-xs px-2 py-1 rounded-full border ${current.has(r) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}
              aria-pressed={current.has(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PermissionsPanel({ staff, onChange }) {
  const knownPermissions = ['read:reports', 'write:cycles', 'manage:staff'];
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-5 h-5 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">İzinler</h3>
      </div>
      <div className="space-y-3">
        {staff.map((s) => (
          <div key={s.id} className="p-3 border border-gray-200 rounded-lg">
            <div className="mb-2 text-sm font-medium text-gray-900">{s.name}</div>
            <div className="flex gap-2 flex-wrap">
              {knownPermissions.map((perm) => {
                const has = new Set(s.permissions ?? []).has(perm);
                return (
                  <button
                    key={perm}
                    type="button"
                    aria-label={`izin: ${perm}`}
                    aria-pressed={has ? 'true' : 'false'}
                    onClick={() => {
                      const current = new Set(s.permissions ?? []);
                      if (current.has(perm)) current.delete(perm); else current.add(perm);
                      onChange(s.id, Array.from(current));
                    }}
                    className={`text-xs px-2 py-1 rounded-full border ${has ? 'bg-purple-50 text-purple-700 border-purple-200' : 'text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                  >
                    {perm}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


