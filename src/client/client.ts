import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

/** [1] Scene (Cảnh): là một đối tượng Three.js chứa tất cả các đối tượng,
 * ánh sáng và hiệu ứng cần được vẽ trên màn hình.
 */
// tạo một đối tượng scene mới,sau đó thêm đối tượng AxesHelper vào scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xff0000)

/**  AxesHelper là một class của Three.js: tạo 1 trục tọa độ 3D
 *  với các đường dẫn khác màu sắc, ở đây trục có độ dài 5 đơn vị
 */
scene.add(new THREE.AxesHelper(5))

/** [7] Light (Ánh sáng): Được sử dụng để tạo ra ánh sáng trong cảnh, giúp các đối tượng 3D có thể được hiển thị rõ ràng hơn.
 *  Three.js hỗ trợ nhiều loại ánh sáng khác nhau, bao gồm AmbientLight, DirectionalLight, và PointLight.
 */
const light = new THREE.PointLight(0xffffff, 2)
light.position.set(10, 10, 10)
scene.add(light)

// const light2 = new THREE.PointLight(0xffffff, 2)
// light2.position.set(-10, -10, -10)
// scene.add(light2)

/** [2] Camera (Máy ảnh): là một đối tượng Three.js để đại diện cho góc nhìn của người dùng.
 * Có nhiều loại camera khác nhau như PerspectiveCamera, OrthographicCamera,
 * CubeCamera,... cho phép bạn tạo ra các hiệu ứng khác nhau và điều chỉnh khoảng cách đến các đối tượng trên màn hình.
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 3

/** [3]Renderer (Trình kết xuất): là một đối tượng Three.js để kết xuất các đối tượng trên màn hình.
 *  Trình kết xuất sẽ sử dụng WebGL hoặc các công nghệ tương tự để tạo ra các hình ảnh 3D.
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/** `new OrbitControls(camera, renderer.domElement)`
 * sử dụng trong Three.js để tạo ra một đối tượng điều khiển camera bằng chuột.
 * Nó cung cấp cho người dùng khả năng quay và di chuyển camera trong không gian 3D.
 */
new OrbitControls(camera, renderer.domElement)

/** [4] Geometry (Hình học): là một đối tượng Three.js để đại diện cho hình dạng và kích thước của một đối tượng.
 *  Geometry có thể được sử dụng để tạo ra các hình dạng phức tạp
 * từ các hình dạng cơ bản như hình cầu, hình trụ, hình chữ nhật,...
 */
const boxGeometry = new THREE.BoxGeometry()
const sphereGeometry = new THREE.SphereGeometry()
const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
const planeGeometry = new THREE.PlaneGeometry()
const torusKnotGeometry = new THREE.TorusKnotGeometry()

/** [5] Material (Vật liệu): là một đối tượng Three.js để đại diện cho màu sắc, độ bóng và ánh sáng của một đối tượng.
 *  Vật liệu có thể được áp dụng cho hình học để tạo ra các hiệu ứng khác nhau,
 *  chẳng hạn như phản chiếu, ánh sáng, bóng tối,...
 */

const material = new THREE.MeshLambertMaterial()

// const texture = new THREE.TextureLoader().load('img/grid.png')
// material.map = texture
// const envTexture = new THREE.CubeTextureLoader().load([
//     'img/px_50.png',
//     'img/nx_50.png',
//     'img/py_50.png',
//     'img/ny_50.png',
//     'img/pz_50.png',
//     'img/nz_50.png',
// ])
// envTexture.mapping = THREE.CubeReflectionMapping
// // envTexture.mapping = THREE.CubeRefractionMapping
// // material.envMap = envTexture
// material.envMap = envTexture

/** [6] Mesh (Lưới): là một đối tượng Three.js để kết hợp geometry và material của một đối tượng.
 *  Mesh có thể được đặt trong scene và sẽ được kết xuất bởi trình kết xuất.
 */
const cube = new THREE.Mesh(boxGeometry, material)
cube.position.x = 5
scene.add(cube)

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.x = 3
scene.add(sphere)

const icosahedron = new THREE.Mesh(icosahedronGeometry, material)
icosahedron.position.x = 0
scene.add(icosahedron)

const plane = new THREE.Mesh(planeGeometry, material)
plane.position.x = -2
scene.add(plane)

const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
torusKnot.position.x = -5
scene.add(torusKnot)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    // 1. Cập nhật tỷ lệ khung hình (aspect) của camera theo kích thước mới của window:
    camera.aspect = window.innerWidth / window.innerHeight
    // 2. Cập nhật ma trận chiếu (projection matrix) của camera:
    camera.updateProjectionMatrix()
    // 3. Cập nhật kích thước của renderer để phù hợp với kích thước mới của window:
    renderer.setSize(window.innerWidth, window.innerHeight)
    // 4. Gọi hàm render() để render lại cảnh.
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const options = {
    side: {
        FrontSide: THREE.FrontSide,
        BackSide: THREE.BackSide,
        DoubleSide: THREE.DoubleSide,
    },
    combine: {
        MultiplyOperation: THREE.MultiplyOperation,
        MixOperation: THREE.MixOperation,
        AddOperation: THREE.AddOperation,
    },
}

const gui = new GUI()
const materialFolder = gui.addFolder('THREE.Material')

materialFolder.add(material, 'transparent').onChange(() => (material.needsUpdate = true))
materialFolder.add(material, 'opacity', 0, 1, 0.01)
materialFolder.add(material, 'depthTest')
materialFolder.add(material, 'depthWrite')
materialFolder.add(material, 'alphaTest', 0, 1, 0.01).onChange(() => updateMaterial())
materialFolder.add(material, 'visible')
materialFolder.add(material, 'side', options.side).onChange(() => updateMaterial())
materialFolder.open()

const data = {
    color: material.color.getHex(),
    emissive: material.emissive.getHex(),
}

const meshLambertMaterialFolder = gui.addFolder('THREE.MeshLambertMaterial')

meshLambertMaterialFolder.addColor(data, 'color').onChange(() => {
    material.color.setHex(Number(data.color.toString().replace('#', '0x')))
})
meshLambertMaterialFolder.addColor(data, 'emissive').onChange(() => {
    material.emissive.setHex(Number(data.emissive.toString().replace('#', '0x')))
})
meshLambertMaterialFolder.add(material, 'wireframe')
meshLambertMaterialFolder.add(material, 'wireframeLinewidth', 0, 10)
//meshLambertMaterialFolder.add(material, 'flatShading').onChange(() => updateMaterial())
meshLambertMaterialFolder.add(material, 'combine', options.combine).onChange(() => updateMaterial())
meshLambertMaterialFolder.add(material, 'reflectivity', 0, 1)
meshLambertMaterialFolder.add(material, 'refractionRatio', 0, 1)
meshLambertMaterialFolder.open()

function updateMaterial() {
    material.side = Number(material.side)
    material.combine = Number(material.combine)
    material.needsUpdate = true
}
// Một hàm animate để cập nhật trạng thái của các đối tượng 3D trong mỗi khung hình (frame)
function animate() {
    requestAnimationFrame(animate)

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
