import React, { useRef } from "react";
import { useFrame, useThree, extend } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import * as THREE from "three";

import Particles from "./Particles";
import { CONFIG } from "../data/siteConstants";

const ImageFadeMaterial = shaderMaterial(
  {
    uTexture1: null,
    uTexture2: null,
    uDisp: null,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uAspect: 1.0,
    uTextureAspect: 1.0,
    uHover: 0.0,
    uTime: 0.0,
  },
  `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  `
    uniform float uHover; uniform float uTime; uniform vec2 uMouse; uniform float uAspect; uniform float uTextureAspect;
    uniform sampler2D uTexture1; uniform sampler2D uTexture2; uniform sampler2D uDisp; varying vec2 vUv;
    void main() {
      vec2 ratio = vec2(min(uAspect / uTextureAspect, 1.0), min(uTextureAspect / uAspect, 1.0));
      vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
      vec2 aspect = vec2(uAspect, 1.0); vec2 mousePos = uMouse * aspect; vec2 uvPos = vUv * aspect;
      float noise = texture2D(uDisp, uv * 0.5 + uTime * 0.02).r;
      float detailNoise = texture2D(uDisp, uv * 2.0 - uTime * 0.05).g;
      float radius = 0.14 + sin(uTime * 1.5) * 0.01; float softness = 0.25; float dist = distance(uvPos, mousePos);
      float distort = (noise * 0.1) + (detailNoise * 0.05);
      float mask = 1.0 - smoothstep(radius, radius + softness, dist - distort); float finalMask = clamp(mask * uHover, 0.0, 1.0);
      vec4 t1 = texture2D(uTexture1, uv); vec2 portalUV = uv + (noise * 0.02 * finalMask);
      float r = texture2D(uTexture2, portalUV + vec2(0.005 * finalMask, 0.0)).r;
      float g = texture2D(uTexture2, portalUV).g;
      float b = texture2D(uTexture2, portalUV - vec2(0.005 * finalMask, 0.0)).b;
      vec4 t2 = vec4(r, g, b, 1.0);
      float edge = smoothstep(0.4, 0.5, finalMask) * (1.0 - smoothstep(0.5, 0.6, finalMask));
      vec3 edgeColor = vec3(0.8, 0.1, 0.0) * edge * (noise + 0.5);
      gl_FragColor = mix(t1, t2, finalMask) + vec4(edgeColor, 0.0);
    }
  `,
);
extend({ ImageFadeMaterial });

const PortalEffect = ({
  isActive,
  isPortalView,
  isUpsideDown,
  isCodeRed,
  isEleven,
}) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport } = useThree();
  const textures = useTexture([
    CONFIG.textures.front,
    CONFIG.textures.back,
    CONFIG.textures.displacement,
  ]);

  useFrame((state, delta) => {
    if (!materialRef.current) return;

    // 1. Calculate the physics states based on your secret codes
    const speedMultiplier = isCodeRed ? 10 : 1;
    const timeSpeed = isEleven ? 0 : 1;

    const targetMouseX = (state.pointer.x + 1) / 2;
    const targetMouseY = (state.pointer.y + 1) / 2;

    materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.x,
      targetMouseX,
      0.1,
    );
    materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uMouse.value.y,
      targetMouseY,
      0.1,
    );

    // 2. APPLY THE PHYSICS TO THE SHADER TIME!
    // Now the liquid portal will boil 10x faster on Code Red, and freeze on Eleven!
    materialRef.current.uniforms.uTime.value +=
      delta * speedMultiplier * timeSpeed;

    materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
      materialRef.current.uniforms.uHover.value,
      isActive && isPortalView ? 1 : 0,
      delta * CONFIG.hoverSpeed,
    );

    materialRef.current.uniforms.uTexture1.value = isUpsideDown
      ? textures[1]
      : textures[0];
    materialRef.current.uniforms.uTexture2.value = isUpsideDown
      ? textures[0]
      : textures[1];

    materialRef.current.uniforms.uAspect.value =
      viewport.width / viewport.height;
    materialRef.current.uniforms.uTextureAspect.value = CONFIG.textureAspect;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <imageFadeMaterial
          ref={materialRef}
          uDisp={textures[2]}
          toneMapped={false}
        />
      </mesh>

      {/* 3. Pass the states down to your actual Particles component! */}
      <Particles isCodeRed={isCodeRed} isEleven={isEleven} />
    </group>
  );
};

export default PortalEffect;

// import React, { useRef } from "react";
// import { useFrame, useThree, extend } from "@react-three/fiber";
// import { useTexture, shaderMaterial } from "@react-three/drei";
// import * as THREE from "three";
// import Particles from "./Particles";
// import { CONFIG } from "../data/Constants";

// const ImageFadeMaterial = shaderMaterial(
//   {
//     uTexture1: null,
//     uTexture2: null,
//     uDisp: null,
//     uMouse: new THREE.Vector2(0.5, 0.5),
//     uAspect: 1.0,
//     uTextureAspect: 1.0,
//     uHover: 0.0,
//     uTime: 0.0,
//   },
//   `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
//   `
//     uniform float uHover; uniform float uTime; uniform vec2 uMouse; uniform float uAspect; uniform float uTextureAspect;
//     uniform sampler2D uTexture1; uniform sampler2D uTexture2; uniform sampler2D uDisp; varying vec2 vUv;
//     void main() {
//       vec2 ratio = vec2(min(uAspect / uTextureAspect, 1.0), min(uTextureAspect / uAspect, 1.0));
//       vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
//       vec2 aspect = vec2(uAspect, 1.0); vec2 mousePos = uMouse * aspect; vec2 uvPos = vUv * aspect;
//       float noise = texture2D(uDisp, uv * 0.5 + uTime * 0.02).r;
//       float detailNoise = texture2D(uDisp, uv * 2.0 - uTime * 0.05).g;
//       float radius = 0.14 + sin(uTime * 1.5) * 0.01; float softness = 0.25; float dist = distance(uvPos, mousePos);
//       float distort = (noise * 0.1) + (detailNoise * 0.05);
//       float mask = 1.0 - smoothstep(radius, radius + softness, dist - distort); float finalMask = clamp(mask * uHover, 0.0, 1.0);
//       vec4 t1 = texture2D(uTexture1, uv); vec2 portalUV = uv + (noise * 0.02 * finalMask);
//       float r = texture2D(uTexture2, portalUV + vec2(0.005 * finalMask, 0.0)).r;
//       float g = texture2D(uTexture2, portalUV).g;
//       float b = texture2D(uTexture2, portalUV - vec2(0.005 * finalMask, 0.0)).b;
//       vec4 t2 = vec4(r, g, b, 1.0);
//       float edge = smoothstep(0.4, 0.5, finalMask) * (1.0 - smoothstep(0.5, 0.6, finalMask));
//       vec3 edgeColor = vec3(0.8, 0.1, 0.0) * edge * (noise + 0.5);
//       gl_FragColor = mix(t1, t2, finalMask) + vec4(edgeColor, 0.0);
//     }
//   `,
// );
// extend({ ImageFadeMaterial });

// const PortalEffect = ({ isActive, isPortalView }) => {
//   const meshRef = useRef();
//   const materialRef = useRef();
//   const { viewport } = useThree();
//   const textures = useTexture([
//     CONFIG.textures.front,
//     CONFIG.textures.back,
//     CONFIG.textures.displacement,
//   ]);

//   useFrame((state, delta) => {
//     if (!materialRef.current) return;
//     const targetMouseX = (state.pointer.x + 1) / 2;
//     const targetMouseY = (state.pointer.y + 1) / 2;
//     materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
//       materialRef.current.uniforms.uMouse.value.x,
//       targetMouseX,
//       0.1,
//     );
//     materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
//       materialRef.current.uniforms.uMouse.value.y,
//       targetMouseY,
//       0.1,
//     );
//     materialRef.current.uniforms.uTime.value += delta;

//     materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
//       materialRef.current.uniforms.uHover.value,
//       isActive && isPortalView ? 1 : 0,
//       delta * CONFIG.hoverSpeed,
//     );
//     materialRef.current.uniforms.uAspect.value =
//       viewport.width / viewport.height;
//     materialRef.current.uniforms.uTextureAspect.value = CONFIG.textureAspect;
//     // if (meshRef.current) {
//     //   meshRef.current.rotation.y = THREE.MathUtils.lerp(
//     //     meshRef.current.rotation.y,
//     //     state.pointer.x * 0.08,
//     //     0.05,
//     //   );
//     //   meshRef.current.rotation.x = THREE.MathUtils.lerp(
//     //     meshRef.current.rotation.x,
//     //     -state.pointer.y * 0.08,
//     //     0.05,
//     //   );
//     // }
//   });

//   return (
//     <group>
//       <mesh ref={meshRef}>
//         <planeGeometry args={[viewport.width, viewport.height, 32, 32]} />
//         <imageFadeMaterial
//           ref={materialRef}
//           uTexture1={textures[0]}
//           uTexture2={textures[1]}
//           uDisp={textures[2]}
//           toneMapped={false}
//         />
//       </mesh>
//       <Particles />
//     </group>
//   );
// };

// export default PortalEffect;
