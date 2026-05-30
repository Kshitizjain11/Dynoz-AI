import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Physics constants
const TABLE_WIDTH = 2.1;
const TABLE_DEPTH = 1.1;
const BALL_RADIUS = 0.03;
const BALL_SPEED = 1.2;
const PHYSICS_TICK = 1 / 120;
const BOUNDARY_X = TABLE_WIDTH / 2 + 0.1;

// Shared vectors to avoid allocation
const _physicsBall = new THREE.Vector3(0, 0.05, 0);
const _velocityBall = new THREE.Vector3(-0.5, 0, 0.5).normalize().multiplyScalar(BALL_SPEED);
const _ballRotationAxis = new THREE.Vector3(0, 0, 1);
const _prevPhysicsBall = new THREE.Vector3();
const _axis = new THREE.Vector3(0, 1, 0);
const _forward = new THREE.Vector3(1, 0, 0);

// Trail system
const trailSystem = {
  lastSpawnTime: 0,
};

const calculateBallPosition = (dt) => {
  _physicsBall.addScaledVector(_velocityBall, dt);

  const speed = _velocityBall.length();

  // Spin
  const spinAmount = speed * dt * 3.5;
  _ballRotationAxis.applyAxisAngle(_axis, spinAmount);

  // Depth bounce
  if ((_physicsBall.z > TABLE_DEPTH / 2 && _velocityBall.z > 0) ||
      (_physicsBall.z < -TABLE_DEPTH / 2 && _velocityBall.z < 0)) {
    _velocityBall.z *= -1;
  }

  // Width bounce
  const w = TABLE_WIDTH / 2 - BALL_RADIUS;
  if ((_physicsBall.x > w && _velocityBall.x > 0) || (_physicsBall.x < -w && _velocityBall.x < 0)) {
    _velocityBall.x *= -1;
  }

  // Re-normalize
  _velocityBall.normalize().multiplyScalar(speed);
};

const spawnTrailPoint = (scene, pos, tableGroup) => {
  const geometry = new THREE.SphereGeometry(0.02, 8, 8);
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.8,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.copy(pos);
  mesh.userData.life = 0;
  tableGroup.add(mesh);
};

const updateTrails = (dt, tableGroup) => {
  for (let i = tableGroup.children.length - 1; i >= 0; i--) {
    const c = tableGroup.children[i];
    if (!c.userData || c.userData.life === undefined) continue;
    c.userData.life += dt;
    if (c.userData.life > 1.0) {
      tableGroup.remove(c);
      c.geometry.dispose();
      c.material.dispose();
    } else {
      c.material.opacity = 1.0 - c.userData.life;
    }
  }
};

const leftPaddleTarget = { value: 0 };

const movePaddle = (dt, time, tableGroup, paddle, isAI, ballPos, ballVel) => {
  if (isAI) {
    const z = ballPos.z + (ballVel.z / (ballVel.x + 0.001)) * (paddle.position.x - ballPos.x);
    leftPaddleTarget.value += (z - leftPaddleTarget.value) * 0.1;
    leftPaddleTarget.value = Math.max(
      -TABLE_DEPTH / 2 + 0.1,
      Math.min(TABLE_DEPTH / 2 - 0.1, leftPaddleTarget.value)
    );
    paddle.position.z += (leftPaddleTarget.value - paddle.position.z) * dt * 5;
  } else {
    const autoZ = Math.sin(time * 2) * TABLE_DEPTH * 0.4;
    paddle.position.z += (autoZ - paddle.position.z) * dt * 3;
  }

  // Tilt
  const worldPos = new THREE.Vector3();
  paddle.getWorldPosition(worldPos);
  const rotationZ = worldPos.z * 0.3;
  const rotationY = isAI ? 0.1 : -0.1;

  if (!paddle.userData.targetRotation) {
    paddle.userData.targetRotation = new THREE.Vector3();
  }
  paddle.userData.targetRotation.lerp(
    new THREE.Vector3(0, rotationY, rotationZ),
    dt * 10
  );
  paddle.rotation.set(
    paddle.userData.targetRotation.x,
    paddle.userData.targetRotation.y,
    paddle.userData.targetRotation.z
  );
};

const PingPongGame = () => {
  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.3);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 1.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 1);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Table group
    const tableGroup = new THREE.Group();
    scene.add(tableGroup);

    // Table surface
    const tableGeom = new THREE.BoxGeometry(TABLE_WIDTH, 0.05, TABLE_DEPTH);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x0a1628,
      roughness: 0.3,
      metalness: 0.8,
    });
    const table = new THREE.Mesh(tableGeom, tableMat);
    table.position.y = -0.025;
    tableGroup.add(table);

    // Table grid lines
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x2E5CFF,
      transparent: true,
      opacity: 0.3,
    });

    // Center line
    const centerPoints = [
      new THREE.Vector3(0, 0.001, -TABLE_DEPTH / 2),
      new THREE.Vector3(0, 0.001, TABLE_DEPTH / 2),
    ];
    const centerGeom = new THREE.BufferGeometry().setFromPoints(centerPoints);
    tableGroup.add(new THREE.Line(centerGeom, lineMat));

    // Border lines
    const borderPoints = [
      new THREE.Vector3(-TABLE_WIDTH / 2, 0.001, -TABLE_DEPTH / 2),
      new THREE.Vector3(TABLE_WIDTH / 2, 0.001, -TABLE_DEPTH / 2),
      new THREE.Vector3(TABLE_WIDTH / 2, 0.001, TABLE_DEPTH / 2),
      new THREE.Vector3(-TABLE_WIDTH / 2, 0.001, TABLE_DEPTH / 2),
      new THREE.Vector3(-TABLE_WIDTH / 2, 0.001, -TABLE_DEPTH / 2),
    ];
    const borderGeom = new THREE.BufferGeometry().setFromPoints(borderPoints);
    tableGroup.add(new THREE.Line(borderGeom, lineMat));

    // Net
    const netGeom = new THREE.BoxGeometry(0.01, 0.1, TABLE_DEPTH);
    const netMat = new THREE.MeshStandardMaterial({
      color: 0xA1A19A,
      roughness: 0.8,
      transparent: true,
      opacity: 0.5,
    });
    const net = new THREE.Mesh(netGeom, netMat);
    net.position.y = 0.05;
    tableGroup.add(net);

    // Ball
    const ballGeom = new THREE.SphereGeometry(BALL_RADIUS, 32, 32);
    const ballMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const ballMesh = new THREE.Mesh(ballGeom, ballMat);
    ballMesh.position.copy(_physicsBall);
    tableGroup.add(ballMesh);

    // Ball glow
    const glowGeom = new THREE.SphereGeometry(BALL_RADIUS * 3, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x2E5CFF,
      transparent: true,
      opacity: 0.15,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowMat);
    ballMesh.add(glowMesh);

    // Paddles
    const paddleGeom = new THREE.BoxGeometry(0.08, 0.02, 0.15);
    const paddleMat = new THREE.MeshStandardMaterial({
      color: 0x2E5CFF,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x2E5CFF,
      emissiveIntensity: 0.3,
    });

    const paddleLeft = new THREE.Mesh(paddleGeom, paddleMat.clone());
    paddleLeft.position.set(-TABLE_WIDTH / 2 - 0.1, 0.02, 0);
    tableGroup.add(paddleLeft);

    const paddleRight = new THREE.Mesh(paddleGeom, paddleMat.clone());
    paddleRight.position.set(TABLE_WIDTH / 2 + 0.1, 0.02, 0);
    tableGroup.add(paddleRight);

    // Ambient particles
    const particlesGeom = new THREE.BufferGeometry();
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    particlesGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: 0x2E5CFF,
      size: 0.02,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particlesGeom, particlesMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x2E5CFF, 2, 10);
    pointLight1.position.set(-2, 3, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 10);
    pointLight2.position.set(2, 3, -2);
    scene.add(pointLight2);

    // Init physics
    let lastPhysicsTick = 0;
    _physicsBall.set(0, 0.05, 0);
    _velocityBall.set(-0.5, 0, 0.5).normalize().multiplyScalar(BALL_SPEED);
    _ballRotationAxis.set(0, 0, 1);
    _prevPhysicsBall.copy(_physicsBall);

    const clock = new THREE.Clock();

    const updateGame = () => {
      const time = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      const b = _physicsBall;
      const v = _velocityBall;
      const speed = v.length();

      // Physics loop
      while (lastPhysicsTick + PHYSICS_TICK <= time) {
        calculateBallPosition(PHYSICS_TICK);
        lastPhysicsTick += PHYSICS_TICK;

        // Out of bounds reset
        if (b.x > BOUNDARY_X || b.x < -BOUNDARY_X) {
          const newVel = new THREE.Vector3(
            (Math.random() - 0.5) * 0.4,
            0,
            (Math.random() - 0.5) * 0.2
          ).normalize().multiplyScalar(speed);
          _velocityBall.copy(newVel);
          b.set(0, 0.05, 0);
        }
      }

      // Interpolate ball position
      const interp = new THREE.Vector3().lerpVectors(
        _prevPhysicsBall,
        _physicsBall,
        (time - lastPhysicsTick) / PHYSICS_TICK
      );
      ballMesh.position.copy(interp);

      // Sync ball rotation
      ballMesh.quaternion.setFromUnitVectors(
        _forward,
        _ballRotationAxis.clone().normalize()
      );

      // Spawn trail
      if (time - trailSystem.lastSpawnTime > 0.05) {
        trailSystem.lastSpawnTime = time;
        const pos = new THREE.Vector3();
        ballMesh.getWorldPosition(pos);
        spawnTrailPoint(scene, pos, tableGroup);
      }

      // Update trails
      updateTrails(dt, tableGroup);

      // Store previous
      _prevPhysicsBall.copy(_physicsBall);

      // Move paddles
      const interpBall = ballMesh.position.clone();
      movePaddle(dt, time, tableGroup, paddleLeft, true, interpBall, _velocityBall);
      movePaddle(dt, time, tableGroup, paddleRight, false, interpBall, _velocityBall);

      // Animate particles
      const posArray = particles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        posArray[i * 3 + 1] += Math.sin(time * 0.5 + i) * 0.001;
      }
      particles.geometry.attributes.position.needsUpdate = true;
      particles.rotation.y = time * 0.05;

      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(updateGame);
    };

    frameRef.current = requestAnimationFrame(updateGame);

    // Handle resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
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
        zIndex: 1,
      }}
    />
  );
};

export default PingPongGame;
