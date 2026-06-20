document.addEventListener("DOMContentLoaded", () => {
    if (typeof THREE === 'undefined') {
        console.warn("Three.js is not loaded. Skipping hero centerpiece WebGL initialization.");
        return;
    }
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    // Dimensions matching style.css container specs
    const width = 460;
    const height = 460;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 5;

    // 2. Renderer (transparent background)
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Group to hold all 3D components
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 3. Create Particle Globe
    const particleCount = 450;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = [];

    const radius = 1.65;

    // Fibonacci lattice distribution on a sphere
    for (let i = 0; i < particleCount; i++) {
        const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        originalPositions.push({ x, y, z, phi, theta });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Cyan glowing particles
    const pMaterial = new THREE.PointsMaterial({
        color: 0x47d9ff,
        size: 0.05,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(geometry, pMaterial);
    mainGroup.add(particleSystem);

    // 4. Create Orbital Rings
    const ringCount = 2;
    const rings = [];

    const ringColors = [0xa855f7, 0x7cffb2];
    const ringRadii = [2.0, 2.35];
    const ringRotations = [
        { x: Math.PI / 3, y: Math.PI / 4, z: 0 },
        { x: -Math.PI / 4, y: -Math.PI / 6, z: Math.PI / 2 }
    ];

    for (let r = 0; r < ringCount; r++) {
        const ringGeo = new THREE.RingGeometry(ringRadii[r], ringRadii[r] + 0.02, 64);
        const ringMat = new THREE.MeshBasicMaterial({
            color: ringColors[r],
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.25,
            blending: THREE.AdditiveBlending
        });
        
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.set(ringRotations[r].x, ringRotations[r].y, ringRotations[r].z);
        mainGroup.add(ringMesh);
        rings.push(ringMesh);
    }

    // 5. Mouse Interaction Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;

    window.addEventListener("mousemove", (e) => {
        mouseX = (e.clientX - windowHalfX) / windowHalfX;
        mouseY = (e.clientY - windowHalfY) / windowHalfY;
    });

    // 6. Scroll Dynamics
    let scrollY = 0;
    window.addEventListener("scroll", () => {
        scrollY = window.scrollY;
    });

    // 7. Animation Frame Loop
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);

        const time = clock.getElapsedTime();

        // Base slow rotation
        mainGroup.rotation.y = time * 0.1;

        // Smooth mouse tracking interpolation
        targetX = mouseY * 0.4;
        targetY = mouseX * 0.4;
        mainGroup.rotation.x += (targetX - mainGroup.rotation.x) * 0.05;
        mainGroup.rotation.y += (targetY - mainGroup.rotation.y) * 0.05;

        // Wave undulation effect on vertices
        const posAttribute = geometry.attributes.position;
        for (let i = 0; i < particleCount; i++) {
            const orig = originalPositions[i];
            
            const wave = Math.sin(time * 1.5 + i * 0.2) * 0.06;
            const currentRadius = radius + wave;

            posAttribute.setX(i, currentRadius * Math.cos(orig.theta) * Math.sin(orig.phi));
            posAttribute.setY(i, currentRadius * Math.sin(orig.theta) * Math.sin(orig.phi));
            posAttribute.setZ(i, currentRadius * Math.cos(orig.phi));
        }
        posAttribute.needsUpdate = true;

        // Orbit rings rotation speed offsets
        rings.forEach((ring, idx) => {
            ring.rotation.z += 0.003 * (idx === 0 ? 1 : -1.5);
        });

        // Scroll fading behavior
        const fadeStart = 80;
        const fadeEnd = 500;
        if (scrollY > fadeStart) {
            const factor = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
            mainGroup.scale.set(factor, factor, factor);
            pMaterial.opacity = factor * 0.85;
            rings.forEach(ring => ring.material.opacity = factor * 0.25);
        } else {
            mainGroup.scale.set(1, 1, 1);
            pMaterial.opacity = 0.85;
            rings.forEach((ring, idx) => ring.material.opacity = 0.25);
        }

        renderer.render(scene, camera);
    };

    animate();

    // 8. Size Updates
    window.addEventListener("resize", () => {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    });
});
