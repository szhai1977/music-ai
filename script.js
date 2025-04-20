let scene, camera, renderer;
let audioElement;
let isPlaying = false;
let bars = [];
const barCount = 64; // 方块数量
const barWidth = 0.2;
const barSpacing = 0.1;
const maxBarHeight = 5;

// 初始化Three.js场景
function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('container').appendChild(renderer.domElement);

    // 设置相机位置
    camera.position.z = 15;
    camera.position.y = 5;

    // 创建方块阵列
    const geometry = new THREE.BoxGeometry(barWidth, 1, barWidth);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 100
    });

    // 计算总宽度以居中显示
    const totalWidth = (barCount * (barWidth + barSpacing)) - barSpacing;
    const startX = -totalWidth / 2;

    for (let i = 0; i < barCount; i++) {
        const bar = new THREE.Mesh(geometry, material);
        bar.position.x = startX + (i * (barWidth + barSpacing));
        bar.position.y = 0;
        scene.add(bar);
        bars.push(bar);
    }

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    // 添加点光源
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);
}

// 加载背景音乐
function loadBackgroundMusic() {
    audioElement = new Audio('audio/my.mp3');
    audioElement.loop = true;
    
    // 添加音频元素到页面
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
        // 使用音频元素的currentTime来创建简单的动画效果
        const time = audioElement.currentTime;
        const frequency = Math.sin(time * 2) * 0.5 + 0.5; // 创建简单的正弦波动画
        
        // 更新方块高度
        for (let i = 0; i < bars.length; i++) {
            const offset = i * 0.1; // 为每个方块添加偏移
            const targetHeight = (Math.sin(time * 2 + offset) * 0.5 + 0.5) * maxBarHeight;
            
            // 平滑过渡到目标高度
            bars[i].scale.y = THREE.MathUtils.lerp(
                bars[i].scale.y,
                targetHeight,
                0.2
            );
            
            // 更新方块位置，使其底部保持在y=0
            bars[i].position.y = bars[i].scale.y / 2;
        }
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