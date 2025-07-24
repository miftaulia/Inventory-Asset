import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import supabase from "../../../supabaseClient";

export default function HapusBarang() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ID yang mau dihapus:", id); // Debug

    const deleteBarang = async () => {
      const { error } = await supabase
        .from("assets")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Gagal menghapus barang: " + error.message);
      } else {
        alert("Barang berhasil dihapus.");
        navigate("/admin/assets");
      }
    };

    const confirmDelete = window.confirm("Yakin ingin menghapus barang ini?");
    if (confirmDelete) {
      deleteBarang();
    } else {
      navigate("/admin/assets");
    }
  }, [id, navigate]);

  return <div className="p-6 text-black">Menghapus data...</div>;
}
