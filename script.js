function toggleMenu() {
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');
    menu.classList.toggle('open');
    icon.classList.toggle('open');
}

// ----------------------------------------------------
// 3D Background - Three.js
// ----------------------------------------------------
const canvas = document.querySelector('#bg');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

// Torus Knot Art Piece
const geometry = new THREE.TorusKnotGeometry(12, 3, 120, 20);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x4dabf7, 
    wireframe: true,
    transparent: true,
    opacity: 0.15
});
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCnt = 2500; 
const posArray = new Float32Array(particlesCnt * 3);

for(let i = 0; i < particlesCnt * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 150;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0xff6b6b,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1.5);
pointLight.position.set(20, 20, 20);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(pointLight, ambientLight);

// Interactivity & Animation Look
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
    targetX = (event.clientX / window.innerWidth - 0.5) * 2;
    targetY = (event.clientY / window.innerHeight - 0.5) * 2;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

function animate() {
    requestAnimationFrame(animate);

    torusKnot.rotation.x += 0.003;
    torusKnot.rotation.y += 0.005;
    
    particlesMesh.rotation.y += 0.0005;

    // Parallax effect
    scene.position.x += (targetX * 2 - scene.position.x) * 0.05;
    scene.position.y += (-targetY * 2 - scene.position.y) * 0.05;

    renderer.render(scene, camera);
}
animate();

// ----------------------------------------------------
// Scroll Animations & Initial Load (GSAP)
// ----------------------------------------------------
gsap.registerPlugin(ScrollTrigger);

// Load Animation for New UI Layout Hero Section
const heroContent = document.querySelector(".hero-content");
const heroImageWrapper = document.querySelector(".hero-image-wrapper");

if(heroContent && heroImageWrapper) {
    gsap.from(heroContent, {
        x: -50,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.2
    });

    gsap.from(heroImageWrapper, {
        scale: 0.5,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.5)",
        delay: 0.5
    });
}

function handleScroll() {
    const top = document.documentElement.scrollTop;
    
    camera.position.z = 30 + top * -0.01;
    camera.position.x = top * -0.002;
    camera.position.y = top * -0.002;
    
    camera.rotation.y = top * -0.0002;
}
document.addEventListener('scroll', handleScroll);
handleScroll();

// Fade in sections smoothly
gsap.utils.toArray('section').forEach((section) => {
    // Avoid re-animating hero section on scroll
    if(section.id !== 'profile') {
        gsap.from(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 85%", 
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 40,
            duration: 1.2,
            ease: "power3.out"
        });
    }
});

// ----------------------------------------------------
// Vanilla Tilt on Cards
// ----------------------------------------------------
VanillaTilt.init(document.querySelectorAll(".details-container"), {
    max: 12,        
    speed: 400,     
    glare: true,    
    "max-glare": 0.15 
});
