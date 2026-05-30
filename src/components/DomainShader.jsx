import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_intensity;

#define PI 3.14159265359

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 complexPow(vec2 z, float n) {
  float r = length(z);
  float theta = atan(z.y, z.x);
  float rn = pow(r, n);
  return vec2(rn * cos(n * theta), rn * sin(n * theta));
}

vec2 customFunction(vec2 z) {
  return (z - vec2(1.0, 0.0)) / (z + vec2(1.0, 0.0));
}

void main() {
  vec2 p = (vUv * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);
  
  // Mouse interaction
  vec2 mouseOffset = (u_mouse - 0.5) * 0.3;
  p += mouseOffset * 0.1;
  
  // Time animation
  p += sin(u_time * 0.3) * 0.1;
  
  // Domain coloring
  vec2 z = customFunction(complexPow(p, 2.0));
  
  float theta = atan(z.y, z.x);
  float r = length(z);
  
  // Hue from angle
  float hue = (theta + PI) / (2.0 * PI) + sin(u_time * 0.2) * 0.1;
  
  // Convert to color
  vec3 col = hsv2rgb(vec3(hue, 0.8 + 0.2 * sin(r * 3.0 + u_time), 0.9));
  
  // Vignette
  float vignette = 1.0 - smoothstep(0.5, 1.5, length(p));
  
  // Mix with dark background
  vec3 finalColor = mix(vec3(0.02, 0.02, 0.05), col, vignette * 0.85 + 0.15);
  
  // Apply intensity
  finalColor *= u_intensity;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
`;

const DomainShader = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_intensity: { value: 0.8 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const clock = new THREE.Clock();

    const animate = () => {
      uniforms.u_time.value = clock.getElapsedTime();

      // Smooth mouse lerp
      uniforms.u_mouse.value.x += (mouseRef.current.x - uniforms.u_mouse.value.x) * 0.05;
      uniforms.u_mouse.value.y += (mouseRef.current.y - uniforms.u_mouse.value.y) * 0.05;

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    const onMouseMove = (e) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight;
    };

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
};

export default DomainShader;
