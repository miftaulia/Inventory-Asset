import { useEffect, useState } from "react";
import supabase from "../../../supabaseClient";
import HeaderGuest from "../../guest/HeaderGuest.jsx";
import AssetCard from "./AssetCard.jsx";
import AssetDetail from "./AssetDetail.jsx";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Import icons

export default function PeminjamanAset() {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase
        .from("assets")
        .select("*, kategori: kategori_id(name)");
      if (!error) setAssets(data);
      setLoading(false);
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredAssets = assets.filter((asset) =>
    asset.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <HeaderGuest
        title="📦 Peminjaman Aset"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="container mx-auto px-4 py-8">
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6 text-center shadow-md"
            role="alert"
          >
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : paginatedAssets.length === 0 ? (
            <p className="text-center text-gray-500 text-lg py-10">
              Tidak ada aset ditemukan.
            </p>
          ) : (
            <>
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
                {paginatedAssets.map((asset) => (
                  <AssetCard
                    key={asset.id}
                    asset={asset}
                    onClick={() => setSelectedAsset(asset)}
                    className="transition-transform transform hover:scale-105"
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-center items-center mt-10 space-x-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className={`flex items-center px-5 py-2 rounded-lg transition-all duration-300 ease-in-out
                    ${
                      currentPage === 1
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-900 hover:bg-orange-600 text-white shadow-md"
                    }`}
                >
                  <FaChevronLeft className="mr-2" />
                  Previous
                </button>
                <span className="text-md text-gray-700 font-medium">
                  Page {currentPage} from {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className={`flex items-center px-5 py-2 rounded-lg transition-all duration-300 ease-in-out
                    ${
                      currentPage === totalPages
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-blue-900 hover:bg-orange-600 text-white shadow-md"
                    }`}
                >
                  Next
                  <FaChevronRight className="ml-2" />
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {selectedAsset && (
        <AssetDetail
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSuccess={() => setSuccessMessage("✅ Peminjaman berhasil diajukan.")}
        />
      )}
    </div>
  );
}
