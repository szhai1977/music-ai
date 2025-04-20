let scene, camera, renderer;
let audioElement;
let isPlaying = false;
let bars = [];
const barCount = 64; // 方块数量
const barWidth = 0.3;
const barDepth = 0.3;
const barSpacing = 0.2;
const maxBarHeight = 8;

// 初始化Three.js场景
function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('container').appendChild(renderer.domElement);

    // 设置相机位置
    camera.position.z = 20;
    camera.position.y = 10;
    camera.lookAt(0, 0, 0);

    // 创建方块阵列
    const geometry = new THREE.BoxGeometry(barWidth, 1, barDepth);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 100,
        specular: 0x444444
    });

    // 计算总宽度以居中显示
    const totalWidth = (barCount * (barWidth + barSpacing)) - barSpacing;
    const startX = -totalWidth / 2;

    for (let i = 0; i < barCount; i++) {
        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = startX + (i * (barWidth + barSpacing));
        bar.position.y = 0;
        bar.castShadow = true;
        bar.receiveShadow = true;
        scene.add(bar);
        bars.push(bar);
    }

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // 添加点光源
    const pointLight1 = new THREE.PointLight(0xffffff, 1);
    pointLight1.position.set(10, 10, 10);
    pointLight1.castShadow = true;
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // 添加地面
    const groundGeometry = new THREE.PlaneGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x111111,
        shininess: 0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2;
    ground.receiveShadow = true;
    scene.add(ground);
}

// 加载背景音乐
function loadBackgroundMusic() {
    audioElement = new Audio('audio/my.mp3');
    audioElement.loop = true;
    document.body.appendChild(audioElement);
}

// 播放/暂停控制
document.getElementById('play-button').addEventListener('click', function() {
    if (!audioElement) return;
    
    if (isPlaying) {
        audioElement.pause();
        isPlaying = false;
    } else {
        audioElement.play();
        isPlaying = true;
    }
});

// 动画循环
function animate() {
    requestAnimationFrame(animate);

    if (isPlaying) {
        const time = audioElement.currentTime;
        
        // 更新方块高度和旋转
        for (let i = 0; i < bars.length; i++) {
            // 创建更复杂的动画效果
            const baseFrequency = Math.sin(time * 2 + i * 0.1) * 0.5 + 0.5;
            const secondaryFrequency = Math.cos(time * 3 + i * 0.05) * 0.3;
            const targetHeight = (baseFrequency + secondaryFrequency) * maxBarHeight;
            
            // 平滑过渡到目标高度
            bars[i].scale.y = THREE.MathUtils.lerp(
                bars[i].scale.y,
                targetHeight,
                0.2
            );
            
            // 更新方块位置
            bars[i].position.y = bars[i].scale.y / 2;
            
            // 添加旋转效果
            bars[i].rotation.x = Math.sin(time + i * 0.1) * 0.1;
            bars[i].rotation.z = Math.cos(time + i * 0.1) * 0.1;
            
            // 根据高度改变颜色
            const hue = (i / barCount) + (time * 0.1);
            bars[i].material.color.setHSL(hue % 1, 0.5, 0.5);
        }
        
        // 缓慢旋转整个场景
        scene.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
}

// 窗口大小调整
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 初始化
init();
loadBackgroundMusic();
animate(); 