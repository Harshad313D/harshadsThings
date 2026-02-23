import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CONFIG } from "../data/siteConstants";

const Particles = () => {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(
    () =>
      Array.from({ length: CONFIG.particleCount }, () => ({
        t: Math.random() * 100,
        factor: 20 + Math.random() * 100,
        speed: 0.01 + Math.random() / 200,
        xFactor: -5 + Math.random() * 10,
        yFactor: -5 + Math.random() * 10,
        zFactor: -5 + Math.random() * 10,
        mx: 0,
        my: 0,
      })),
    [],
  );

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      p.t += p.speed / 2;
      const a = Math.cos(p.t) + Math.sin(p.t * 1) / 10;
      const b = Math.sin(p.t) + Math.cos(p.t * 2) / 10;
      const s = Math.cos(p.t);
      dummy.position.set(
        (p.mx / 10) * a +
          p.xFactor +
          Math.cos((p.t / 10) * p.factor) +
          (Math.sin(p.t * 1) * p.factor) / 10,
        (p.my / 10) * b +
          p.yFactor +
          Math.sin((p.t / 10) * p.factor) +
          (Math.cos(p.t * 2) * p.factor) / 10,
        (p.my / 10) * b +
          p.zFactor +
          Math.cos((p.t / 10) * p.factor) +
          (Math.sin(p.t * 3) * p.factor) / 10,
      );
      dummy.scale.set(s * 0.02, s * 0.02, s * 0.02);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, CONFIG.particleCount]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ff2200" transparent opacity={0.6} />
    </instancedMesh>
  );
};

export default Particles;
