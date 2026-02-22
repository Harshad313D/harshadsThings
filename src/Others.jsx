// import React, { useRef, useState, useEffect } from "react";
// import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
// import { useTexture, shaderMaterial } from "@react-three/drei";
// import * as THREE from "three";
// import {
//   ArrowRight,
//   Menu,
//   Github,
//   Twitter,
//   Instagram,
//   MousePointer2,
//   Zap,
// } from "lucide-react";

// // --- 1. Shader Definition (Cinematic Void Transition) ---

// const ImageFadeMaterial = shaderMaterial(
//   {
//     uTexture1: null,
//     uTexture2: null,
//     uDisp: null,
//     uMouse: new THREE.Vector2(0.5, 0.5),
//     uAspect: 1.0,
//     uHover: 0.0,
//     uTime: 0.0,
//   },
//   `
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   `
//     uniform float uHover;
//     uniform float uTime;
//     uniform vec2 uMouse;
//     uniform float uAspect;
//     uniform sampler2D uTexture1;
//     uniform sampler2D uTexture2;
//     uniform sampler2D uDisp;
//     varying vec2 vUv;

//     // Helper for random flickering (official horror vibe)
//     float flicker(float t) {
//         return sin(t * 10.0) * sin(t * 7.0) * sin(t * 5.0);
//     }

//     void main() {
//       vec2 aspect = vec2(uAspect, 1.0);
//       vec2 mousePos = uMouse * aspect;
//       vec2 uvPos = vUv * aspect;

//       // 1. Organic Noise & Distortion
//       // Using uDisp as a growth map for the "vine-like" edges
//       float noise = texture2D(uDisp, vUv * 0.5 + uTime * 0.02).r;
//       float detailNoise = texture2D(uDisp, vUv * 2.0 - uTime * 0.05).g;

//       // 2. Animated Radius (Breathing)
//       float radius = 0.18 + sin(uTime * 1.5) * 0.01;
//       float softness = 0.25; // Softer falloff for a more cinematic look

//       // 3. Distance with "Vine" Distortion
//       // We perturb the distance field with layered noise
//       float dist = distance(uvPos, mousePos);
//       float distort = (noise * 0.1) + (detailNoise * 0.05);

//       // 4. Reveal Mask with Sharp Transition Edge
//       // smoothstep is used for the base, but we multiply it by uHover for a smooth fade-in
//       float mask = 1.0 - smoothstep(radius, radius + softness, dist - distort);

//       // Add a subtle flicker to the "behind" image area
//       float glitch = flicker(uTime) * 0.02 * uHover;
//       float finalMask = clamp(mask * uHover, 0.0, 1.0);

//       // 5. Texture Sampling
//       // Front Image (Vecna)
//       vec4 t1 = texture2D(uTexture1, vUv);

//       // Back Image (Henry) with Chromatic Aberration & Heat Haze
//       // We offset the UVs slightly based on the mask to create a "portal" refraction effect
//       vec2 portalUV = vUv + (noise * 0.02 * finalMask);
//       float r = texture2D(uTexture2, portalUV + vec2(0.005 * finalMask, 0.0)).r;
//       float g = texture2D(uTexture2, portalUV).g;
//       float b = texture2D(uTexture2, portalUV - vec2(0.005 * finalMask, 0.0)).b;
//       vec4 t2 = vec4(r, g, b, 1.0);

//       // Add a slight red "ember" tint to the edge of the reveal
//       float edge = smoothstep(0.4, 0.5, finalMask) * (1.0 - smoothstep(0.5, 0.6, finalMask));
//       vec3 edgeColor = vec3(0.8, 0.1, 0.0) * edge * (noise + 0.5);

//       gl_FragColor = mix(t1, t2, finalMask) + vec4(edgeColor, 0.0);
//     }
//   `
// );

// extend({ ImageFadeMaterial });

// // --- 2. 3D Scene Component ---

// const RevealImage = () => {
//   const meshRef = useRef();
//   const materialRef = useRef();
//   const [hovered, setHovered] = useState(false);
//   const { viewport } = useThree();

//   const [texture1, texture2, dispTexture] = useTexture([
//     "https://cdnb.artstation.com/p/assets/images/images/051/749/083/large/lawy-vecnapiece4k.jpg?1658089328",
//     "https://fwmedia.fandomwire.com/wp-content/uploads/2025/12/06100101/stranger-things-season-5-vecna-henry-creel-backstory.jpg?width=1600&height=900&fit=crop&format=auto&quality=70",
//     "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/disturb.jpg",
//   ]);

//   const onPointerMove = (e) => {
//     if (materialRef.current && e.uv) {
//       materialRef.current.uniforms.uMouse.value.x = e.uv.x;
//       materialRef.current.uniforms.uMouse.value.y = e.uv.y;
//     }
//   };

//   useFrame((state, delta) => {
//     if (!materialRef.current) return;

//     materialRef.current.uniforms.uTime.value += delta;

//     // Smooth entry/exit transition
//     const targetHover = hovered ? 1 : 0;
//     materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
//       materialRef.current.uniforms.uHover.value,
//       targetHover,
//       delta * 3.5
//     );

//     materialRef.current.uniforms.uAspect.value =
//       viewport.width / viewport.height;

//     // Cinematic tilt
//     if (meshRef.current) {
//       const mX = materialRef.current.uniforms.uMouse.value.x - 0.5;
//       const mY = materialRef.current.uniforms.uMouse.value.y - 0.5;
//       meshRef.current.rotation.y = THREE.MathUtils.lerp(
//         meshRef.current.rotation.y,
//         mX * 0.08,
//         0.05
//       );
//       meshRef.current.rotation.x = THREE.MathUtils.lerp(
//         meshRef.current.rotation.x,
//         -mY * 0.08,
//         0.05
//       );
//       // Slight Z-depth movement on hover
//       meshRef.current.position.z = THREE.MathUtils.lerp(
//         meshRef.current.position.z,
//         hovered ? 0.2 : 0,
//         0.05
//       );
//     }
//   });

//   return (
//     <mesh
//       ref={meshRef}
//       onPointerEnter={() => setHovered(true)}
//       onPointerLeave={() => setHovered(false)}
//       onPointerMove={onPointerMove}
//     >
//       <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
//       <imageFadeMaterial
//         ref={materialRef}
//         uTexture1={texture1}
//         uTexture2={texture2}
//         uDisp={dispTexture}
//         uMouse={new THREE.Vector2(0.5, 0.5)}
//         uAspect={viewport.width / viewport.height}
//         uHover={0}
//         uTime={0}
//         toneMapped={false}
//       />
//     </mesh>
//   );
// };

// // --- 3. UI Overlay Component ---

// const Overlay = () => {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoaded(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const getTransitionClass = (delayClass) =>
//     `transition-all duration-1000 ease-out transform ${
//       loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//     } ${delayClass}`;

//   return (
//     <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10 text-white font-mono">
//       <nav
//         className={`flex justify-between items-center pointer-events-auto ${getTransitionClass(
//           "delay-0"
//         )}`}
//       >
//         <div className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
//           <div className="relative">
//             <Zap className="fill-red-600 text-red-600 w-6 h-6 animate-pulse" />
//             <div className="absolute inset-0 blur-md bg-red-600/50 scale-150 rounded-full animate-pulse"></div>
//           </div>
//           <span className="relative">VOID_ARCHIVE // 001</span>
//         </div>
//         <div className="hidden md:flex gap-10 text-[9px] font-bold tracking-[0.4em] uppercase">
//           <a
//             href="#"
//             className="hover:text-red-500 transition-colors relative group"
//           >
//             Origins
//             <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-600 group-hover:w-full transition-all"></span>
//           </a>
//           <a
//             href="#"
//             className="hover:text-red-500 transition-colors relative group"
//           >
//             Records
//             <span className="absolute -bottom-1 left-0 w-0 h-px bg-red-600 group-hover:w-full transition-all"></span>
//           </a>
//           <a href="#" className="text-red-600 animate-pulse">
//             Live_Signal
//           </a>
//         </div>
//         <button className="md:hidden">
//           <Menu className="w-6 h-6" />
//         </button>
//       </nav>

//       <div className="flex flex-col md:flex-row items-end md:items-center justify-between w-full h-full pb-12">
//         <div className="flex flex-col gap-1 max-w-2xl">
//           <div
//             className={`flex items-center gap-3 text-red-600 font-bold tracking-widest uppercase text-[10px] ${getTransitionClass(
//               "delay-200"
//             )}`}
//           >
//             <span className="h-[1px] w-8 bg-red-600"></span>
//             DATA STREAM: SUBJECT_HENRY_CREEL
//           </div>
//           <h1
//             className={`text-6xl md:text-9xl font-black leading-none tracking-tighter ${getTransitionClass(
//               "delay-300"
//             )}`}
//           >
//             <span className="text-white">UNMASK</span> <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-700 via-red-500 to-black">
//               THE VOID
//             </span>
//           </h1>
//           <p
//             className={`text-[10px] font-medium tracking-[0.25em] uppercase opacity-60 mt-8 max-w-md leading-relaxed border-l border-red-900/50 pl-6 ${getTransitionClass(
//               "delay-500"
//             )}`}
//           >
//             Biological signature detected. Scan the localized distortion to
//             reveal the host's original physiology. Warning: Psychic interference
//             is high.
//           </p>

//           <div
//             className={`pointer-events-auto mt-12 ${getTransitionClass(
//               "delay-700"
//             )}`}
//           >
//             <button className="group relative flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.5em] px-12 py-6 overflow-hidden bg-red-600/5 hover:bg-red-600/10 transition-all">
//               <span className="absolute inset-0 border border-red-900/30 group-hover:border-red-600/50 transition-colors"></span>
//               <span className="relative z-10">Initiate Breach</span>
//               <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-3 transition-transform text-red-600" />
//               <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-red-600 group-hover:w-full transition-all duration-700"></div>
//             </button>
//           </div>
//         </div>

//         <div
//           className={`hidden md:flex flex-col gap-12 pointer-events-auto ${getTransitionClass(
//             "delay-1000"
//           )}`}
//         >
//           <div className="flex flex-col gap-2 items-center">
//             <span className="h-20 w-[1px] bg-gradient-to-b from-transparent via-red-900 to-transparent"></span>
//             <a
//               href="#"
//               className="hover:text-red-600 -rotate-90 transition-all uppercase text-[8px] tracking-[0.5em] font-bold mb-4"
//             >
//               Twitter
//             </a>
//             <a
//               href="#"
//               className="hover:text-red-600 -rotate-90 transition-all uppercase text-[8px] tracking-[0.5em] font-bold mb-4"
//             >
//               Database
//             </a>
//             <a
//               href="#"
//               className="hover:text-red-600 -rotate-90 transition-all uppercase text-[8px] tracking-[0.5em] font-bold"
//             >
//               Encrypted
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <div className="w-full h-screen bg-black relative overflow-hidden">
//       {/* Background scanline effect */}
//       <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

//       <Overlay />

//       <div className="absolute inset-0 z-0 scale-105">
//         <Canvas camera={{ position: [0, 0, 5], fov: 40 }}>
//           <React.Suspense fallback={null}>
//             <RevealImage />
//           </React.Suspense>
//         </Canvas>
//       </div>

//       {/* Decorative HUD elements */}
//       <div className="absolute top-1/2 right-8 -translate-y-1/2 flex flex-col gap-4 pointer-events-none z-10">
//         {[...Array(8)].map((_, i) => (
//           <div
//             key={i}
//             className={`w-1 h-1 bg-red-900/40 rounded-full ${
//               i % 3 === 0 ? "animate-pulse bg-red-600" : ""
//             }`}
//           ></div>
//         ))}
//       </div>

//       <div className="absolute bottom-6 left-12 flex items-center gap-4 text-[8px] text-white/20 pointer-events-none uppercase tracking-[0.6em] font-bold z-10">
//         <div className="w-2 h-2 bg-red-600/40 rounded-full"></div>
//         System Status: Nominal // Hawkins_Grid_Active
//       </div>
//     </div>
//   );
// };

// export default App;

// import React, { useRef, useState, useEffect } from "react";
// import { Canvas, useFrame, useThree, extend } from "@react-three/fiber";
// import { useTexture, shaderMaterial } from "@react-three/drei";
// import * as THREE from "three";
// import {
//   ArrowRight,
//   Menu,
//   Github,
//   Twitter,
//   Instagram,
//   MousePointer2,
//   Zap,
// } from "lucide-react";

// // --- 1. Shader Definition (Liquid Glitch Reveal) ---

// const ImageFadeMaterial = shaderMaterial(
//   {
//     uTexture1: null,
//     uTexture2: null,
//     uDisp: null,
//     uMouse: new THREE.Vector2(0.5, 0.5),
//     uAspect: 1.0,
//     uHover: 0.0,
//     uTime: 0.0,
//   },
//   `
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   `
//     uniform float uHover;
//     uniform float uTime;
//     uniform vec2 uMouse;
//     uniform float uAspect;
//     uniform sampler2D uTexture1;
//     uniform sampler2D uTexture2;
//     uniform sampler2D uDisp;
//     varying vec2 vUv;

//     void main() {
//       vec2 aspect = vec2(uAspect, 1.0);
//       vec2 mousePos = uMouse * aspect;
//       vec2 uvPos = vUv * aspect;

//       // Create a pulsating radius based on time
//       float pulse = sin(uTime * 2.0) * 0.02;
//       float radius = 0.15 + pulse;
//       float softness = 0.12;

//       // Distance with a liquid distortion effect
//       float noise = texture2D(uDisp, vUv + uTime * 0.05).r;
//       float dist = distance(uvPos, mousePos);

//       // The reveal mask logic
//       float mask = 1.0 - smoothstep(radius, radius + softness, dist - (noise * 0.08));
//       float finalMask = mask * uHover;

//       // Chromatic Aberration logic for the reveal edges
//       float shift = finalMask * 0.01;
//       vec4 t1 = texture2D(uTexture1, vUv);

//       // Sample t2 with an RGB shift for a cool glitchy reveal
//       float r = texture2D(uTexture2, vUv + vec2(shift, 0.0)).r;
//       float g = texture2D(uTexture2, vUv).g;
//       float b = texture2D(uTexture2, vUv - vec2(shift, 0.0)).b;
//       vec4 t2 = vec4(r, g, b, 1.0);

//       gl_FragColor = mix(t1, t2, finalMask);
//     }
//   `
// );

// extend({ ImageFadeMaterial });

// // --- 2. 3D Scene Component ---

// const RevealImage = () => {
//   const meshRef = useRef();
//   const materialRef = useRef();
//   const [hovered, setHovered] = useState(false);
//   const { viewport } = useThree();

//   const [texture1, texture2, dispTexture] = useTexture([
//     "https://fwmedia.fandomwire.com/wp-content/uploads/2025/12/06100101/stranger-things-season-5-vecna-henry-creel-backstory.jpg?width=1600&height=900&fit=crop&format=auto&quality=70",
//     "https://cdnb.artstation.com/p/assets/images/images/051/749/083/large/lawy-vecnapiece4k.jpg?1658089328",
//     "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/disturb.jpg",
//   ]);

//   const onPointerMove = (e) => {
//     if (materialRef.current && e.uv) {
//       materialRef.current.uniforms.uMouse.value.x = e.uv.x;
//       materialRef.current.uniforms.uMouse.value.y = e.uv.y;
//     }
//   };

//   useFrame((state, delta) => {
//     if (!materialRef.current) return;

//     // Time for liquid animations
//     materialRef.current.uniforms.uTime.value += delta;

//     // Smooth entry/exit
//     const targetHover = hovered ? 1 : 0;
//     materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
//       materialRef.current.uniforms.uHover.value,
//       targetHover,
//       delta * 4
//     );

//     materialRef.current.uniforms.uAspect.value =
//       viewport.width / viewport.height;

//     // Subtle parallax rotation
//     if (meshRef.current) {
//       const mX = materialRef.current.uniforms.uMouse.value.x - 0.5;
//       const mY = materialRef.current.uniforms.uMouse.value.y - 0.5;
//       meshRef.current.rotation.y = THREE.MathUtils.lerp(
//         meshRef.current.rotation.y,
//         mX * 0.05,
//         0.1
//       );
//       meshRef.current.rotation.x = THREE.MathUtils.lerp(
//         meshRef.current.rotation.x,
//         -mY * 0.05,
//         0.1
//       );
//     }
//   });

//   return (
//     <mesh
//       ref={meshRef}
//       onPointerEnter={() => setHovered(true)}
//       onPointerLeave={() => setHovered(false)}
//       onPointerMove={onPointerMove}
//     >
//       <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
//       <imageFadeMaterial
//         ref={materialRef}
//         uTexture1={texture1}
//         uTexture2={texture2}
//         uDisp={dispTexture}
//         uMouse={new THREE.Vector2(0.5, 0.5)}
//         uAspect={viewport.width / viewport.height}
//         uHover={0}
//         uTime={0}
//         toneMapped={false}
//       />
//     </mesh>
//   );
// };

// // --- 3. UI Overlay Component ---

// const Overlay = () => {
//   const [loaded, setLoaded] = useState(false);

//   useEffect(() => {
//     const timer = setTimeout(() => setLoaded(true), 100);
//     return () => clearTimeout(timer);
//   }, []);

//   const getTransitionClass = (delayClass) =>
//     `transition-all duration-1000 ease-out transform ${
//       loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//     } ${delayClass}`;

//   return (
//     <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10 text-white">
//       <nav
//         className={`flex justify-between items-center pointer-events-auto ${getTransitionClass(
//           "delay-0"
//         )}`}
//       >
//         <div className="text-2xl font-black tracking-tighter uppercase flex items-center gap-2">
//           <Zap className="fill-red-600 text-red-600 w-6 h-6" />
//           VOID_ARCHIVE
//         </div>
//         <div className="hidden md:flex gap-8 text-[10px] font-bold tracking-[0.3em] uppercase">
//           <a href="#" className="hover:text-red-500 transition-colors">
//             Fragment_01
//           </a>
//           <a href="#" className="hover:text-red-500 transition-colors">
//             Fragment_02
//           </a>
//           <a href="#" className="hover:text-red-500 transition-colors">
//             Terminate
//           </a>
//         </div>
//         <button className="md:hidden">
//           <Menu className="w-6 h-6" />
//         </button>
//       </nav>

//       <div className="flex flex-col md:flex-row items-end md:items-center justify-between w-full h-full pb-12">
//         <div className="flex flex-col gap-2 max-w-2xl">
//           <div
//             className={`flex items-center gap-2 text-red-500 font-bold tracking-widest uppercase text-[10px] ${getTransitionClass(
//               "delay-200"
//             )}`}
//           >
//             STATUS: SCANNING_HOST
//           </div>
//           <h1
//             className={`text-6xl md:text-9xl font-black leading-none tracking-tighter ${getTransitionClass(
//               "delay-300"
//             )}`}
//           >
//             BEYOND <br />
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">
//               SIGHT
//             </span>
//           </h1>
//           <p
//             className={`text-[11px] font-medium tracking-[0.2em] uppercase opacity-70 mt-6 max-w-sm leading-relaxed ${getTransitionClass(
//               "delay-500"
//             )}`}
//           >
//             The digital veil is thin. Use your cursor to scan the distortion and
//             identify the original biological signature.
//           </p>

//           <div
//             className={`pointer-events-auto mt-10 ${getTransitionClass(
//               "delay-700"
//             )}`}
//           >
//             <button className="group relative flex items-center gap-6 text-[10px] font-bold uppercase tracking-[0.4em] px-10 py-5 overflow-hidden">
//               <span className="absolute inset-0 border border-white/20 group-hover:border-red-500/50 transition-colors"></span>
//               <span className="relative z-10">Initialize Scan</span>
//               <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-2 transition-transform text-red-500" />
//               <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-red-600 group-hover:w-full transition-all duration-500"></span>
//             </button>
//           </div>
//         </div>

//         <div
//           className={`hidden md:flex flex-col gap-8 pointer-events-auto ${getTransitionClass(
//             "delay-1000"
//           )}`}
//         >
//           <a
//             href="#"
//             className="hover:text-red-500 -rotate-90 transition-all uppercase text-[9px] tracking-widest font-bold"
//           >
//             Github
//           </a>
//           <a
//             href="#"
//             className="hover:text-red-500 -rotate-90 transition-all uppercase text-[9px] tracking-widest font-bold"
//           >
//             Twitter
//           </a>
//           <a
//             href="#"
//             className="hover:text-red-500 -rotate-90 transition-all uppercase text-[9px] tracking-widest font-bold"
//           >
//             Insta
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   return (
//     <div className="w-full h-screen bg-[#020202] relative overflow-hidden font-mono">
//       <Overlay />
//       <div className="absolute inset-0 z-0">
//         <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
//           <React.Suspense fallback={null}>
//             <RevealImage />
//           </React.Suspense>
//         </Canvas>
//       </div>
//       <div className="absolute top-1/2 left-8 -translate-y-1/2 flex flex-col gap-2 pointer-events-none">
//         {[...Array(5)].map((_, i) => (
//           <div key={i} className="w-1 h-1 bg-white/20 rounded-full"></div>
//         ))}
//       </div>
//       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-white/20 pointer-events-none uppercase tracking-[0.5em] font-bold">
//         Neural Link Established // ID: 001-HENRY
//       </div>
//     </div>
//   );
// };

// export default App;

// // import React, { useRef, useState, useEffect } from 'react';
// // import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
// // import { useTexture, shaderMaterial } from '@react-three/drei';
// // import * as THREE from 'three';
// // import { ArrowRight, Menu, Github, Twitter, Instagram, MousePointer2 } from 'lucide-react';

// // // --- 1. Shader Definition (Flashlight / Brush Reveal) ---

// // const ImageFadeMaterial = shaderMaterial(
// //   {
// //     uTexture1: null,
// //     uTexture2: null,
// //     uDisp: null,
// //     uMouse: new THREE.Vector2(0.5, 0.5), // Mouse UV position
// //     uAspect: 1.0,    // Screen aspect ratio for circular brush
// //     uHover: 0.0,     // 0 = cursor outside, 1 = cursor inside
// //   },
// //   // Vertex Shader
// //   `
// //     varying vec2 vUv;
// //     void main() {
// //       vUv = uv;
// //       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// //     }
// //   `,
// //   // Fragment Shader
// //   `
// //     uniform float uHover;
// //     uniform vec2 uMouse;
// //     uniform float uAspect;
// //     uniform sampler2D uTexture1;
// //     uniform sampler2D uTexture2;
// //     uniform sampler2D uDisp;
// //     varying vec2 vUv;

// //     void main() {
// //       // 1. Setup Aspect Ratio Correction
// //       vec2 aspect = vec2(uAspect, 1.0);
// //       vec2 mousePos = uMouse * aspect;
// //       vec2 uvPos = vUv * aspect;

// //       // 2. Calculate Distance from Mouse
// //       float dist = distance(uvPos, mousePos);

// //       // 3. Noise Texture for Organic Edges
// //       float noise = texture2D(uDisp, vUv * 1.5).r;

// //       // 4. Create the "Brush" Mask
// //       float radius = 0.25;
// //       float softness = 0.15;

// //       float brush = 1.0 - smoothstep(radius, radius + softness, dist - (noise * 0.05));

// //       // 5. Apply Global Hover Fade
// //       float finalMask = brush * uHover;

// //       // 6. Fetch Textures
// //       vec4 t1 = texture2D(uTexture1, vUv);
// //       vec4 t2 = texture2D(uTexture2, vUv);

// //       // 7. Mix them!
// //       gl_FragColor = mix(t1, t2, finalMask);
// //     }
// //   `
// // );

// // extend({ ImageFadeMaterial });

// // // --- 2. 3D Scene Component ---

// // const RevealImage = () => {
// //   const meshRef = useRef();
// //   const materialRef = useRef();
// //   const [hovered, setHovered] = useState(false);
// //   const { viewport } = useThree();

// //   // Load textures: Vecna (Front) -> Henry Creel (Back)
// //   // Replaced the broken cloud1.jpg URL with a reliable noise texture from Three.js examples
// //   const [texture1, texture2, dispTexture] = useTexture([
// //     "https://fwmedia.fandomwire.com/wp-content/uploads/2025/12/06100101/stranger-things-season-5-vecna-henry-creel-backstory.jpg?width=1600&height=900&fit=crop&format=auto&quality=70",
// //     "https://cdnb.artstation.com/p/assets/images/images/051/749/083/large/lawy-vecnapiece4k.jpg?1658089328",
// //     "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/disturb.jpg",
// //   ]);

// //   const onPointerMove = (e) => {
// //     if (materialRef.current) {
// //       if (e.uv) {
// //         materialRef.current.uniforms.uMouse.value.x = e.uv.x;
// //         materialRef.current.uniforms.uMouse.value.y = e.uv.y;
// //       }
// //     }
// //   };

// //   useFrame((state, delta) => {
// //     if (!materialRef.current) return;

// //     const targetHover = hovered ? 1 : 0;
// //     materialRef.current.uniforms.uHover.value = THREE.MathUtils.lerp(
// //       materialRef.current.uniforms.uHover.value,
// //       targetHover,
// //       delta * 3
// //     );

// //     materialRef.current.uniforms.uAspect.value = viewport.width / viewport.height;
// //   });

// //   return (
// //     <mesh
// //       ref={meshRef}
// //       onPointerEnter={() => setHovered(true)}
// //       onPointerLeave={() => setHovered(false)}
// //       onPointerMove={onPointerMove}
// //       position={[0, 0, 0]}
// //     >
// //       <planeGeometry args={[viewport.width, viewport.height, 64, 64]} />
// //       <imageFadeMaterial
// //         ref={materialRef}
// //         uTexture1={texture1}
// //         uTexture2={texture2}
// //         uDisp={dispTexture}
// //         uMouse={new THREE.Vector2(0.5, 0.5)}
// //         uAspect={viewport.width / viewport.height}
// //         uHover={0}
// //         toneMapped={false}
// //       />
// //     </mesh>
// //   );
// // };

// // // --- 3. UI Overlay Component ---

// // const Overlay = () => {
// //   const [loaded, setLoaded] = useState(false);

// //   useEffect(() => {
// //     const timer = setTimeout(() => setLoaded(true), 100);
// //     return () => clearTimeout(timer);
// //   }, []);

// //   const getTransitionClass = (delayClass) =>
// //     `transition-all duration-1000 ease-out transform ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${delayClass}`;

// //   return (
// //     <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10 text-white">
// //       {/* Navigation */}
// //       <nav className={`flex justify-between items-center pointer-events-auto ${getTransitionClass('delay-0')}`}>
// //         <div className="text-2xl font-bold tracking-tighter uppercase drop-shadow-lg">
// //           Hawkins Lab
// //         </div>
// //         <div className="hidden md:flex gap-8 text-sm font-medium tracking-widest uppercase drop-shadow-md">
// //           <a href="#" className="hover:text-red-500 transition-colors">Origins</a>
// //           <a href="#" className="hover:text-red-500 transition-colors">Subjects</a>
// //           <a href="#" className="hover:text-red-500 transition-colors">Contact</a>
// //         </div>
// //         <button className="md:hidden">
// //           <Menu className="w-6 h-6" />
// //         </button>
// //       </nav>

// //       {/* Hero Content */}
// //       <div className="flex flex-col md:flex-row items-end md:items-center justify-between w-full h-full pb-12">
// //         <div className="flex flex-col gap-4 max-w-2xl">
// //           <div className={`flex items-center gap-2 text-red-500 font-bold tracking-widest uppercase text-xs ${getTransitionClass('delay-200')}`}>
// //             <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
// //             Classified Archive
// //           </div>
// //           <h1 className={`text-6xl md:text-8xl font-black leading-none tracking-tighter drop-shadow-2xl ${getTransitionClass('delay-300')}`}>
// //             THE <br/>
// //             <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-purple-900">
// //               CREEL
// //             </span> FILE
// //           </h1>
// //           <p className={`text-sm md:text-base font-light tracking-widest uppercase opacity-90 mt-4 max-w-md drop-shadow-lg ${getTransitionClass('delay-500')}`}>
// //             <span className="text-red-400 font-bold">Instruction:</span> Move your cursor over the subject to reveal the original host. <br/>
// //             The truth lies beneath the scars.
// //           </p>

// //           <div className={`pointer-events-auto mt-8 ${getTransitionClass('delay-700')}`}>
// //             <button className="group flex items-center gap-4 text-sm uppercase tracking-widest border border-white/30 bg-black/20 backdrop-blur-sm px-8 py-4 rounded-none hover:bg-red-600 hover:border-red-600 transition-all duration-300">
// //               Access Database
// //               <MousePointer2 className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
// //             </button>
// //           </div>
// //         </div>

// //         {/* Social / Side info */}
// //         <div className={`hidden md:flex flex-col gap-6 pointer-events-auto ${getTransitionClass('delay-1000')}`}>
// //           <a href="#" className="hover:scale-110 hover:text-red-500 transition-all"><Github className="w-5 h-5" /></a>
// //           <a href="#" className="hover:scale-110 hover:text-red-500 transition-all"><Twitter className="w-5 h-5" /></a>
// //           <a href="#" className="hover:scale-110 hover:text-red-500 transition-all"><Instagram className="w-5 h-5" /></a>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // --- 4. Main App Component ---

// // const App = () => {
// //   return (
// //     <div className="w-full h-screen bg-[#050505] relative overflow-hidden font-sans">

// //       {/* UI Layer */}
// //       <Overlay />

// //       {/* 3D Canvas Layer */}
// //       <div className="absolute inset-0 z-0">
// //         <Canvas
// //           camera={{ position: [0, 0, 5], fov: 45 }}
// //           onCreated={({ gl }) => {
// //             gl.setClearColor(new THREE.Color('#000000'));
// //           }}
// //         >
// //           <ambientLight intensity={0.5} />
// //           <React.Suspense fallback={null}>
// //              <RevealImage />
// //           </React.Suspense>
// //         </Canvas>
// //       </div>

// //       <div className="absolute bottom-4 right-4 text-[10px] text-white/30 pointer-events-none uppercase tracking-widest">
// //         001 // SYSTEM READY
// //       </div>
// //     </div>
// //   );
// // };

// // export default App;
