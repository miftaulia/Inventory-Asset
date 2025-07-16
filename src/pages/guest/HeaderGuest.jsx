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
      {message && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-300 text-blue-800 px-4 py-2 rounded-lg text-sm mb-3">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 1010 10A10 10 0 0012 2z"
            />
          </svg>
          <span>{message}</span>
        </div>
      )}

      {/* Slot tambahan filter atau tombol */}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}
