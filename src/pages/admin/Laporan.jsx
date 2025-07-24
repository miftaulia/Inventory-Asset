import { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { format } from "date-fns";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Format tanggal ke DD-MM-YYYY
const formatTanggal = (tanggal) => {
  return tanggal ? format(new Date(tanggal), "dd-MM-yyyy") : "-";
};

export default function Laporan() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("peminjaman")
      .select(`
        id,
        jumlah,
        status,
        tanggal_pinjam,
        tanggal_kembali,
        assets ( nama, kategori: kategori_id ( name ) ),
        pengguna: id_pengguna ( nama, email )
      `);

    if (error) {
      console.error("Gagal mengambil data:", error.message);
    } else {
      setData(data);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Laporan Peminjaman");

    worksheet.mergeCells("A1:I1");
    const titleCell = worksheet.getCell("A1");
    titleCell.value = "Laporan Peminjaman Aset";
    titleCell.font = { size: 16, bold: true };
    titleCell.alignment = { vertical: "middle", horizontal: "center" };

    const headers = [
      "No",
      "Nama Aset",
      "Kategori",
      "Nama Peminjam",
      "Email Peminjam",
      "Jumlah",
      "Status",
      "Tanggal Pinjam",
      "Tanggal Kembali",
    ];
    worksheet.addRow(headers);

    const headerRow = worksheet.getRow(2);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF003F7D" },
    };
    headerRow.alignment = { horizontal: "center", vertical: "middle" };

    data.forEach((item, index) => {
      worksheet.addRow([
        index + 1,
        item.assets?.nama || "-",
        item.assets?.kategori?.name || "-",
        item.pengguna?.nama || "-",
        item.pengguna?.email || "-",
        item.jumlah,
        item.status,
        formatTanggal(item.tanggal_pinjam),
        formatTanggal(item.tanggal_kembali),
      ]);
    });

    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 10;
        if (length > maxLength) maxLength = length;
      });
      column.width = maxLength < 15 ? 15 : maxLength;
    });

    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, "laporan_peminjaman.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl text-black font-bold mb-4">📄 Laporan Peminjaman Aset</h1>

      <button
        onClick={exportToExcel}
        className="mb-4 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded"
      >
        Export ke Excel
      </button>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 text-sm">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="border px-3 py-2">No</th>
              <th className="border px-3 py-2">Nama Aset</th>
              <th className="border px-3 py-2">Kategori</th>
              <th className="border px-3 py-2">Nama Peminjam</th>
              <th className="border px-3 py-2">Email Peminjam</th>
              <th className="border px-3 py-2">Jumlah</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Tanggal Pinjam</th>
              <th className="border px-3 py-2">Tanggal Kembali</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-100 text-black transition duration-200">
                  <td className="border-b border-gray-200 px-4 py-2 text-center">{index + 1}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.assets?.nama || "-"}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.assets?.kategori?.name || "-"}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.pengguna?.nama || "-"}</td>
                  <td className="border-b border-gray-200 px-4 py-2">{item.pengguna?.email || "-"}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-center">{item.jumlah}</td>
                  <td className="border-b border-gray-200 px-4 py-2 text-center">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        item.status === "menunggu"
                          ? "bg-yellow-100 text-yellow-800"
                          : item.status === "disetujui"
                          ? "bg-blue-100 text-blue-800"
                          : item.status === "pengembalian"
                          ? "bg-purple-100 text-purple-800"
                          : item.status === "ditolak"
                          ? "bg-red-100 text-red-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {formatTanggal(item.tanggal_pinjam)}
                  </td>
                  <td className="border-b border-gray-200 px-4 py-2">
                    {formatTanggal(item.tanggal_kembali)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
