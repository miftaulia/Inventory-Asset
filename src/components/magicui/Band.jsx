// components/magicui/Band.jsx
import { useEffect, useRef, useState } from "react";
import { useGLTF, useTexture } from "@react-three/drei";
import { BallCollider, CuboidCollider, RigidBody, useRopeJoint, useSphericalJoint } from "@react-three/rapier";
import * as THREE from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { extend, useFrame } from "@react-three/fiber";

import cardGLB from "../../assets/card.glb";

extend({ MeshLineGeometry, MeshLineMaterial });

export default function Band({ cardImage, lanyardTexture, position = [0, 4, 0] }) {
  const gltf = useGLTF(cardGLB);
  const texture = useTexture(lanyardTexture);
  const cardTex = useTexture(cardImage || "");

  const { nodes, materials } = gltf || {};

  const band = useRef(), fixed = useRef(), j1 = useRef(), j2 = useRef(), j3 = useRef(), card = useRef();
  const vec = new THREE.Vector3(), ang = new THREE.Vector3(), rot = new THREE.Vector3(), dir = new THREE.Vector3();

  const [curve] = useState(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()
  ]));

  const segmentProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const [dragged, setDragged] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.rotation = Math.PI / 2;
      texture.center.set(0.5, 0.5);
      texture.repeat.set(2, 6); // ulang ke atas
      texture.needsUpdate = true;
    }

    if (cardTex) {
      cardTex.flipY = false;
      cardTex.anisotropy = 16;
      cardTex.needsUpdate = true;
    }
  }, [texture, cardTex]);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 2]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [[0, 0, 0], [0, 2.4, 0]]);

  useEffect(() => {
    document.body.style.cursor = hovered ? (dragged ? 'grabbing' : 'grab') : 'auto';
  }, [hovered, dragged]);

  useFrame((state) => {
    if (dragged) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }

    if (fixed.current) {
      // Buat tali lurus dari atas ke bawah
      const top = fixed.current.translation();
      const bottom = j3.current.translation();

      for (let i = 0; i < 4; i++) {
        curve.points[i].lerpVectors(top, bottom, i / 3);
      }

      band.current.geometry.setPoints(curve.getPoints(32));

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
    }
  });

  return (
    <>
      <group position={position}>
        {/* Titik-titik sambungan vertikal */}
        <RigidBody ref={fixed} {...segmentProps} type="fixed" position={[0, 3, 0]} />
        <RigidBody ref={j1} {...segmentProps} position={[0, 2, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j2} {...segmentProps} position={[0, 1, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody ref={j3} {...segmentProps} position={[0, 0, 0]}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
          position={[0, -1.5, 0]}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={3}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={(e) => {
              e.target.setPointerCapture(e.pointerId);
              setDragged(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
            onPointerUp={(e) => {
              e.target.releasePointerCapture(e.pointerId);
              setDragged(false);
            }}
          >
            {nodes?.card && (
              <mesh geometry={nodes.card.geometry}>
                <meshPhysicalMaterial
                  map={cardImage && cardTex?.image ? cardTex : materials?.base?.map}
                  clearcoat={1}
                  clearcoatRoughness={0.15}
                  roughness={0.9}
                  metalness={0.8}
                />
              </mesh>
            )}
            {nodes?.clip && (
              <mesh geometry={nodes.clip.geometry} material={materials?.metal} />
            )}
            {nodes?.clamp && (
              <mesh geometry={nodes.clamp.geometry} material={materials?.metal} />
            )}
          </group>
        </RigidBody>
      </group>

      {/* Tali */}
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[1000, 1000]}
          useMap
          map={texture}
          repeat={[3, 1]}
          offset={[0, 0]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
