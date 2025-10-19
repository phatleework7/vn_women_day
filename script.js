// Three.js Scene Setup
let scene, camera, renderer, particles, stars;
let mouseX = 0, mouseY = 0;

function init() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    document.getElementById('container').appendChild(renderer.domElement);
    
    // Create Heart Particles
    createHeartParticles();
    
    // Create Stars
    createStars();
    
    // Create Circular Text
    createCircularText();
    
    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Start Animation
    animate();
}

function createHeartParticles() {
    const particleCount = 5000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    // Heart shape function
    function heartShape(t, scale = 1) {
        const x = 16 * Math.pow(Math.sin(t), 3) * scale;
        const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
        const z = (Math.sin(t) * Math.cos(t)) * scale * 5;
        return { x, y, z };
    }
    
    // Generate particles in heart shape
    for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2;
        const radius = Math.random() * 0.6 + 0.6;
        const { x, y, z } = heartShape(t, 8 * radius);
        
        positions[i * 3] = x + (Math.random() - 0.5) * 4;
        positions[i * 3 + 1] = y + (Math.random() - 0.5) * 4;
        positions[i * 3 + 2] = z + (Math.random() - 0.5) * 15;
        
        // Pure red color
        const colorVariation = Math.random() * 0.15;
        colors[i * 3] = 1.0; // R (full red)
        colors[i * 3 + 1] = 0.0 + colorVariation; // G (minimal green)
        colors[i * 3 + 2] = 0.0 + colorVariation; // B (minimal blue)
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const material = new THREE.PointsMaterial({
        size: 3.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(geometry, material);
    particles.position.y = 50;
    particles.scale.set(1.5, 1.5, 1.5);
    scene.add(particles);
}

function createStars() {
    const starCount = 1000;
    const positions = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 1000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 500 - 100;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        size: 1.5,
        color: 0xffffff,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    
    stars = new THREE.Points(geometry, material);
    scene.add(stars);
}

function createCircularText() {
    const textElement = document.createElement('div');
    textElement.className = 'circular-text';
    textElement.innerHTML = `
        <svg viewBox="0 0 400 400">
            <defs>
                <path id="circlePath" d="M 200, 200 m -150, 0 a 150,150 0 1,1 300,0 a 150,150 0 1,1 -300,0" />
            </defs>
            <text>
                <textPath href="#circlePath" startOffset="0%">
                    Chúc Vy ngày 20.10 luôn xinh đẹp thật hạnh phúc ✨ 
                </textPath>
            </text>
            <text>
                <textPath href="#circlePath" startOffset="50%">
                    Chúc Vy ngày 20.10 luôn xinh đẹp thật hạnh phúc ✨ 
                </textPath>
            </text>
        </svg>
    `;
    document.body.appendChild(textElement);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate heart
    if (particles) {
        particles.rotation.y += 0.003;
        particles.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
        
        // Mouse interaction
        particles.rotation.x += mouseY * 0.01;
        particles.rotation.y += mouseX * 0.01;
        
        // Pulse effect
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.05;
        particles.scale.set(scale, scale, scale);
    }
    
    // Animate stars
    if (stars) {
        stars.rotation.y += 0.0002;
        stars.rotation.x += 0.0001;
    }
    
    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener('load', init);

