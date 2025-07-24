// components/AssetCard.jsx
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";

export default function AssetCard({ asset, onClick }) {
  return (
    <Card
      className="w-80 cursor-pointer hover:shadow-xl transition duration-300 rounded-2xl  bg-white"
      onClick={() => onClick(asset)}
    >
      <CardHeader shadow={false} floated={false} className="h-56 rounded-t-2xl overflow-hidden">
        <img
          src={asset.gambar || "https://via.placeholder.com/400x250?text=No+Image"}
          alt={asset.nama}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </CardHeader>

      <CardBody className="px-5 py-4">
        <div className="mb-2 flex items-center justify-between">
          <Typography color="blue-gray" className="text-lg font-semibold">
            {asset.nama}
          </Typography>
          <span className="text-xs bg-blue-gray-100 text-blue-gray-800 px-2 py-1 rounded-md">
            {asset.kategori?.name || "Tanpa Kategori"}
          </span>
        </div>

        <Typography
          variant="small"
          color="gray"
          className="text-sm text-gray-600 line-clamp-2"
        >
          {asset.keterangan || "Tidak ada keterangan tersedia."}
        </Typography>

        <Typography
          variant="small"
          color="blue-gray"
          className="mt-3 text-sm font-medium"
        >
          <span className="text-blue-600">Tersedia:</span> {asset.jumlah}
        </Typography>
      </CardBody>

      <CardFooter className="pt-0 px-5 pb-4">
        <Button
          ripple={false}
          fullWidth={true}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold text-sm rounded-lg shadow hover:from-blue-700 hover:to-blue-900 hover:shadow-md transition-all"
        >
          Pinjam Aset
        </Button>
      </CardFooter>
    </Card>
  );
}
