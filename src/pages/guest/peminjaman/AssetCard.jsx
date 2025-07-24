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
      className="w-full cursor-pointer transition duration-300 rounded-xl bg-white shadow hover:shadow-lg hover:-translate-y-1"
      onClick={() => onClick(asset)}
    >
      <CardHeader shadow={false} floated={false} className="h-40 rounded-t-xl overflow-hidden">
        <img
          src={asset.gambar || "https://via.placeholder.com/400x250?text=No+Image"}
          alt={asset.nama}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </CardHeader>

      <CardBody className="px-4 py-3">
        <div className="mb-2 flex items-center justify-between">
          <Typography color="blue-gray" className="text-base font-semibold text-gray-800 line-clamp-1">
            {asset.nama}
          </Typography>
          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-xl font-medium">
            {asset.kategori?.name || "Tanpa Kategori"}
          </span>
        </div>

        <Typography
          variant="small"
          color="blue-gray"
          className="mt-2 text-sm font-medium"
        >
          <span className="text-[#003366] font-semibold">Tersedia:</span> {asset.jumlah}
        </Typography>
      </CardBody>

      <CardFooter className="pt-0 px-4 pb-4">
        <Button
          fullWidth
          className="bg-gradient-to-r from-[#FF8E00] to-[#FF5003] text-white font-semibold text-sm rounded-md shadow-md hover:brightness-110 transition-all"
        >
          Pinjam Aset
        </Button>
      </CardFooter>
    </Card>
  );
}
