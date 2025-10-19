// Three.js Scene Setup
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;

function init() {
    // Scene
    scene = new THREE.Scene();
    
    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 300;
    
    // Renderer với nền trong suốt để thấy background image
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        preserveDrawingBuffer: true
    });
    
    // Set size - không scale trên mobile nữa
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    renderer.setClearColor(0x000000, 0);  // Alpha = 0 để trong suốt
    document.getElementById('container').appendChild(renderer.domElement);
    
    // Create Heart Particles
    createHeartParticles();
    
    // Initialize Audio
    initAudio();
    
    // Initialize Floating Button
    initFloatingButton();
    
    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Start Animation
    animate();
}

function createHeartParticles() {
    // ========================================
    // CẤU HÌNH: Thêm đường dẫn hình ảnh của bạn ở đây
    // ========================================
    const imageUrls = [
        'images/heart1.JPG',   // Hình 1
        'images/heart2.JPG',   // Hình 2
        'images/heart3.jpg',   // Hình 3
        'images/heart4.jpeg',  // Hình 4
        'images/heart5.jpeg',  // Hình 5
    ];
    
    const particleCount = 300; // Khôi phục về 300 particles
    const positions = new Float32Array(particleCount * 3);
    const textureIndices = new Float32Array(particleCount);
    
    // Heart shape function - KHÔI PHỤC kích thước như cũ
    function heartShape(t, scale = 1) {
        const x = 16 * Math.pow(Math.sin(t), 3) * scale;
        const y = (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale;
        const z = (Math.sin(t) * Math.cos(t)) * scale * 5;
        return { x, y, z };
    }
    
    // Generate particles in heart shape - KHÔI PHỤC kích thước như cũ
    for (let i = 0; i < particleCount; i++) {
        const t = (i / particleCount) * Math.PI * 2;
        const radius = Math.random() * 0.6 + 0.6; // Khôi phục về 0.6
        const { x, y, z } = heartShape(t, 8 * radius); // Khôi phục về 8
        
        positions[i * 3] = x + (Math.random() - 0.5) * 2; // Khôi phục về 2
        positions[i * 3 + 1] = y + (Math.random() - 0.5) * 2;
        positions[i * 3 + 2] = z + (Math.random() - 0.5) * 8; // Khôi phục về 8
        
        // Random texture index cho mỗi particle
        textureIndices[i] = Math.floor(Math.random() * imageUrls.length);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Load tất cả 3 textures
    const textureLoader = new THREE.TextureLoader();
    let loadedCount = 0;
    const textures = [];
    
    imageUrls.forEach((url, index) => {
        textureLoader.load(
            url,
            function(texture) {
                textures[index] = texture;
                loadedCount++;
                
                // Khi đã load xong cả 3 hình
                if (loadedCount === imageUrls.length) {
                    createParticlesWithMultipleTextures(geometry, textures, textureIndices);
                }
            },
            undefined,
            function(error) {
                console.warn(`Không load được ${url}:`, error);
                loadedCount++;
                
                if (loadedCount === imageUrls.length) {
                    createParticlesWithMultipleTextures(geometry, textures, textureIndices);
                }
            }
        );
    });
}

function createParticlesWithMultipleTextures(geometry, textures, textureIndices) {
    // Tạo nhiều sprite sheets hoặc dùng instancing
    // Vì Three.js PointsMaterial không hỗ trợ nhiều texture,
    // ta sẽ tạo 3 Point systems riêng biệt
    
    const validTextures = textures.filter(t => t !== undefined);
    
    if (validTextures.length === 0) {
        // Fallback nếu không có texture nào load được
        const material = new THREE.PointsMaterial({
            size: 25, // Khôi phục về size như cũ
            color: 0xff0000,
            transparent: true,
            opacity: 1.0,
            blending: THREE.NormalBlending
        });
        
        particles = new THREE.Points(geometry, material);
        particles.position.y = 0; // Đưa xuống giữa màn hình
        particles.scale.set(1.0, 1.0, 1.0); // Không scale thêm
        scene.add(particles);
        return;
    }
    
    // Tạo 3 groups riêng cho mỗi texture
    const positions = geometry.attributes.position.array;
    const particleCount = positions.length / 3;
    
    validTextures.forEach((texture, texIndex) => {
        const particlePositions = [];
        
        for (let i = 0; i < particleCount; i++) {
            if (textureIndices[i] === texIndex) {
                particlePositions.push(positions[i * 3]);
                particlePositions.push(positions[i * 3 + 1]);
                particlePositions.push(positions[i * 3 + 2]);
            }
        }
        
        if (particlePositions.length > 0) {
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(particlePositions), 3));
            
            const material = new THREE.PointsMaterial({
                size: 25, // Khôi phục về size như cũ
                map: texture,
                transparent: true,
                opacity: 1.0,
                blending: THREE.NormalBlending,
                depthWrite: false,
                color: 0xffffff
            });
            
            const points = new THREE.Points(geo, material);
            points.position.y = 0; // Đưa xuống giữa màn hình
            points.scale.set(1.0, 1.0, 1.0); // Không scale thêm
            scene.add(points);
            
            // Store reference để animate (lưu vào array)
            if (!particles) particles = [];
            particles.push(points);
        }
    });
}

// Optimized code - removed unused functions

function initAudio() {
    const audio = document.getElementById('backgroundMusic');
    
    if (!audio) return;
    
    // Set initial volume (lower for background music)
    audio.volume = 0.3;
    audio.loop = true;
    
    // TỐI ƯU: Auto-play ngay lập tức (giảm delay)
    setTimeout(() => {
        audio.play().catch(e => console.log('Auto-play failed:', e));
    }, 500); // Giảm từ 1000ms xuống 500ms
    
    // Auto-play on any user interaction (backup)
    document.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(e => console.log('Auto-play failed:', e));
        }
    }, { once: true });
    
    // Auto-play on touch (mobile)
    document.addEventListener('touchstart', () => {
        if (audio.paused) {
            audio.play().catch(e => console.log('Auto-play failed:', e));
        }
    }, { once: true });
    
    // Auto-play on mouse move (desktop)
    document.addEventListener('mousemove', () => {
        if (audio.paused) {
            audio.play().catch(e => console.log('Auto-play failed:', e));
        }
    }, { once: true });
}

// Floating Button Functions
function initFloatingButton() {
    const floatingBtn = document.getElementById('floatingBtn');
    const messageModal = document.getElementById('messageModal');
    const closeModal = document.getElementById('closeModal');
    
    if (!floatingBtn || !messageModal || !closeModal) return;
    
    // Click button để hiện modal
    floatingBtn.addEventListener('click', () => {
        messageModal.style.display = 'flex';
        // Pause animation khi modal mở
        floatingBtn.style.animationPlayState = 'paused';
    });
    
    // Click close button để đóng modal
    closeModal.addEventListener('click', () => {
        messageModal.style.display = 'none';
        // Resume animation khi modal đóng
        floatingBtn.style.animationPlayState = 'running';
    });
    
    // Click outside modal để đóng
    messageModal.addEventListener('click', (e) => {
        if (e.target === messageModal) {
            messageModal.style.display = 'none';
            floatingBtn.style.animationPlayState = 'running';
        }
    });
    
    // Random thay đổi vị trí button mỗi 10 giây
    setInterval(() => {
        if (messageModal.style.display !== 'flex') {
            // Thay đổi animation duration để tạo hiệu ứng bất ngờ
            const durations = [12, 14, 16, 18];
            const randomDuration = durations[Math.floor(Math.random() * durations.length)];
            floatingBtn.style.animationDuration = randomDuration + 's';
        }
    }, 10000);
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onWindowResize() {
    // Không scale trên mobile nữa - full size
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate heart (hỗ trợ cả single và multiple particles)
    if (particles) {
        if (Array.isArray(particles)) {
            // Multiple particle systems (3 textures)
            particles.forEach(p => {
                p.rotation.y += 0.003;
                p.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
                
                // Mouse interaction
                p.rotation.x += mouseY * 0.01;
                p.rotation.y += mouseX * 0.01;
                
                // Pulse effect - KHÔI PHỤC scale như cũ
                const scale = 1.5 + Math.sin(Date.now() * 0.001) * 0.075; // Khôi phục về 1.5
                p.scale.set(scale, scale, scale);
            });
        } else {
            // Single particle system
            particles.rotation.y += 0.003;
            particles.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
            
            // Mouse interaction
            particles.rotation.x += mouseY * 0.01;
            particles.rotation.y += mouseX * 0.01;
            
            // Pulse effect - KHÔI PHỤC scale như cũ
            const scale = 1.5 + Math.sin(Date.now() * 0.001) * 0.075; // Khôi phục về 1.5
            particles.scale.set(scale, scale, scale);
        }
    }
    
    renderer.render(scene, camera);
}

// Initialize when page loads
window.addEventListener('load', init);

