export default function HeaderGuest({
  title = "Halaman",
  searchTerm,
  setSearchTerm,
  message,
  children,
}) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-3">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>

        {/* Opsional Search */}
        {searchTerm !== undefined && setSearchTerm && (
          <input
            type="text"
            placeholder="🔍 Cari..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm w-full md:w-1/3"
          />
        )}
      </div>

      {/* Opsional Message */}


      {/* Slot tambahan filter atau tombol */}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
