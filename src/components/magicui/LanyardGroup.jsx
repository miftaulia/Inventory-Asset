import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { Environment, Lightformer, Html, useProgress, Preload } from "@react-three/drei";
import Band from "./Band";

function Loader() {
  const { progress } = useProgress();
  return <Html center>{Math.floor(progress)}%</Html>;
}

export default function LanyardGroup({ items }) {
  return (
    <div className="relative w-full h-[600px]">
      <Canvas camera={{ position: [0, 0, 20], fov: 25 }}>
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={<Loader />}>
          <Physics gravity={[0, -100, 0]}>
            {items.map((item, i) => (
              <Band
                key={i}
                cardImage={item.cardImage}
                lanyardTexture={item.lanyardTexture}
                position={item.position}
              />
            ))}
          </Physics>
        </Suspense>
        <Environment blur={0.8}>
          <Lightformer intensity={10} position={[0, 5, 10]} scale={[20, 1, 1]} />
        </Environment>
        <Preload all />
      </Canvas>
    </div>
  );
}
