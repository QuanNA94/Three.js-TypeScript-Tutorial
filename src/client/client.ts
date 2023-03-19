import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

/** [1] Scene (Cảnh): là một đối tượng Three.js chứa tất cả các đối tượng,
 * ánh sáng và hiệu ứng cần được vẽ trên màn hình.
 */
// tạo một đối tượng scene mới,sau đó thêm đối tượng AxesHelper vào scene
const scene = new THREE.Scene()

/**  AxesHelper là một class của Three.js: tạo 1 trục tọa độ 3D
 *  với các đường dẫn khác màu sắc, ở đây trục có độ dài 5 đơn vị
 */
scene.add(new THREE.AxesHelper(5))

/** [7] Light (Ánh sáng): Được sử dụng để tạo ra ánh sáng trong cảnh, giúp các đối tượng 3D có thể được hiển thị rõ ràng hơn.
 *  Three.js hỗ trợ nhiều loại ánh sáng khác nhau, bao gồm AmbientLight, DirectionalLight, và PointLight.
 */
const light = new THREE.PointLight(0xffffff, 1)
light.position.set(0, 2, 5)
scene.add(light)

/** [2] Camera (Máy ảnh): là một đối tượng Three.js để đại diện cho góc nhìn của người dùng.
 * Có nhiều loại camera khác nhau như PerspectiveCamera, OrthographicCamera,
 * CubeCamera,... cho phép bạn tạo ra các hiệu ứng khác nhau và điều chỉnh khoảng cách đến các đối tượng trên màn hình.
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 1

/** [3]Renderer (Trình kết xuất): là một đối tượng Three.js để kết xuất các đối tượng trên màn hình.
 *  Trình kết xuất sẽ sử dụng WebGL hoặc các công nghệ tương tự để tạo ra các hình ảnh 3D.
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
/** Thêm đối tượng renderer vào thẻ HTML sử dụng hàm appendChild(renderer.domElement).
 *  Trong trường hợp này, renderer.domElement là một đối tượng HTMLCanvasElement,
 *  và nó sẽ được thêm vào thẻ body để hiển thị kết quả cuối cùng của các hoạt động đồ họa.
 */
document.body.appendChild(renderer.domElement)

/** `new OrbitControls(camera, renderer.domElement)`
 * sử dụng trong Three.js để tạo ra một đối tượng điều khiển camera bằng chuột.
 * Nó cung cấp cho người dùng khả năng quay và di chuyển camera trong không gian 3D.
 */
const controls = new OrbitControls(camera, renderer.domElement)
// controls.screenSpacePanning = true // default is now true since three r118. Used so that panning up and down doesn't zoom in/out
controls.enableDamping = true
//controls.addEventListener('change', render)

/** [4] Geometry (Hình học): là một đối tượng Three.js để đại diện cho hình dạng và kích thước của một đối tượng.
 *  Geometry có thể được sử dụng để tạo ra các hình dạng phức tạp
 * từ các hình dạng cơ bản như hình cầu, hình trụ, hình chữ nhật,...
 */
// const boxGeometry = new THREE.BoxGeometry()
// const sphereGeometry = new THREE.SphereGeometry()
// const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
// const planeGeometry = new THREE.PlaneGeometry()

const planeGeometry = new THREE.PlaneGeometry(3.6, 1.8)

// const torusKnotGeometry = new THREE.TorusKnotGeometry()

// =================================================================================

// const threeTone = new THREE.TextureLoader().load('img/threeTone.jpg')
// threeTone.minFilter = THREE.NearestFilter
// threeTone.magFilter = THREE.NearestFilter

// const fourTone = new THREE.TextureLoader().load('img/fourTone.jpg')
// fourTone.minFilter = THREE.NearestFilter
// fourTone.magFilter = THREE.NearestFilter

// const fiveTone = new THREE.TextureLoader().load('img/fiveTone.jpg')
// fiveTone.minFilter = THREE.NearestFilter
// fiveTone.magFilter = THREE.NearestFilter

// =================================================================================

/** [5] Material (Vật liệu): là một đối tượng Three.js để đại diện cho màu sắc, độ bóng và ánh sáng của một đối tượng.
 *  Vật liệu có thể được áp dụng cho hình học để tạo ra các hiệu ứng khác nhau,
 *  chẳng hạn như phản chiếu, ánh sáng, bóng tối,...
 */

const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial()

// const texture = new THREE.TextureLoader().load('img/grid.png')

// 1.Tải và gán bản đồ màu (texture map) cho vật liệu:
/**
 * Trong đó, hàm THREE.TextureLoader() được sử dụng để tạo một đối tượng TextureLoader mới,
 *  sau đó hàm .load() được gọi với đường dẫn của tệp ảnh "img/worldColour.5400x2700.jpg" để tải ảnh.
 */
const texture = new THREE.TextureLoader().load('img/worldColour.5400x2700.jpg')
// material.map = texture

// =================================================================================
// // 2. Tải và gán bản đồ bump (bump map) cho vật liệu:
// const bumpTexture = new THREE.TextureLoader().load('img/earth_bumpmap.jpg')
// material.bumpMap = bumpTexture
// /** giá trị "bumpScale" được thiết lập là 0.015
//  * để điều chỉnh độ sâu của các phần của vật thể có hiệu ứng đồ họa bị lồi hoặc lõm dựa trên bản đồ bump.
//  */
// material.bumpScale = 0.015
// =================================================================================

const normalTexture = new THREE.TextureLoader().load('img/earth_normalmap_8192x4096.jpg')
material.normalMap = normalTexture
material.normalScale.set(2, 2) // left_right_shadow && up_down_shadow

// =================================================================================

/** envTexture là một CubeTexture được tạo ra từ 6 hình ảnh ở dạng khối lập phương,
 *  tạo thành một "cube map" để biểu diễn môi trường xung quanh vật thể 3D.
 */
// const envTexture = new THREE.CubeTextureLoader().load([
//     'img/px_50.png',
//     'img/nx_50.png',
//     'img/py_50.png',
//     'img/ny_50.png',
//     'img/pz_50.png',
//     'img/nz_50.png',
// ])
// const envTexture = new THREE.CubeTextureLoader().load([
//     'img/px_eso0932a.jpg',
//     'img/nx_eso0932a.jpg',
//     'img/py_eso0932a.jpg',
//     'img/ny_eso0932a.jpg',
//     'img/pz_eso0932a.jpg',
//     'img/nz_eso0932a.jpg',
// ])
// envTexture.mapping = THREE.CubeReflectionMapping

/** Để áp dụng CubeTexture này vào vật liệu,
 * ta gán giá trị của envTexture vào thuộc tính envMap của vật liệu (material.envMap = envTexture).
 */
// material.envMap = envTexture

// const specularTexture = new THREE.TextureLoader().load('img/grayscale-test.png')
// const specularTexture = new THREE.TextureLoader().load('img/earthSpecular.jpg')
// material.specularMap = specularTexture

// material.roughnessMap = specularTexture
// material.metalnessMap = specularTexture

// =================================================================================

/** [6] Mesh (Lưới): là một đối tượng Three.js để kết hợp geometry và material của một đối tượng.
 *  Mesh có thể được đặt trong scene và sẽ được kết xuất bởi trình kết xuất.
 */

// =================================================================================

// const cube = new THREE.Mesh(boxGeometry, material)
// cube.position.x = 5
// scene.add(cube)

// const sphere = new THREE.Mesh(sphereGeometry, material)
// sphere.position.x = 3
// scene.add(sphere)

// const icosahedron = new THREE.Mesh(icosahedronGeometry, material)
// icosahedron.position.x = 0
// scene.add(icosahedron)

const plane: THREE.Mesh = new THREE.Mesh(planeGeometry, material)
// plane.position.x = -2
scene.add(plane)

// const torusKnot = new THREE.Mesh(torusKnotGeometry, material)
// torusKnot.position.x = -5
// scene.add(torusKnot)

// =================================================================================

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
    /** Những bước này giúp đảm bảo rằng cảnh được hiển thị đúng tỷ lệ khung hình
     * và độ phân giải trên màn hình khi kích thước của cửa sổ trình duyệt thay đổi.
     */
}

const stats = Stats()
document.body.appendChild(stats.dom)

// const options = {
//     side: {
//         FrontSide: THREE.FrontSide,
//         BackSide: THREE.BackSide,
//         DoubleSide: THREE.DoubleSide,
//     },
//     // combine: {
//     //     MultiplyOperation: THREE.MultiplyOperation,
//     //     MixOperation: THREE.MixOperation,
//     //     AddOperation: THREE.AddOperation,
//     // },
//     // gradientMap: {
//     //     Default: null,
//     //     threeTone: 'threeTone',
//     //     fourTone: 'fourTone',
//     //     fiveTone: 'fiveTone',
//     // },
// }

const gui = new GUI()
gui.add(material.normalScale, 'x', 0, 10, 0.01)
gui.add(material.normalScale, 'y', 0, 10, 0.01)
gui.add(light.position, 'x', -20, 20).name('Light Pos X')

// gui.add(material, 'bumpScale', 0, 1, 0.01)

// const data = {
//     color: material.color.getHex(),
//     // lightColor: light.color.getHex(),
//     // gradientMap: 'threeTone',
//     emissive: material.emissive.getHex(),
//     // specular: material.specular.getHex(),
// }

// material.gradientMap = threeTone

// const lightFolder = gui.addFolder('THREE.Light')
// lightFolder.addColor(data, 'lightColor').onChange(() => {
//     light.color.setHex(Number(data.lightColor.toString().replace('#', '0x')))
// })
// lightFolder.add(light, 'intensity', 0, 4)

// const materialFolder = gui.addFolder('THREE.Material')
// materialFolder.add(material, 'transparent').onChange(() => (material.needsUpdate = true))
// materialFolder.add(material, 'opacity', 0, 1, 0.01)
// materialFolder.add(material, 'depthTest')
// materialFolder.add(material, 'depthWrite')
// materialFolder.add(material, 'alphaTest', 0, 1, 0.01).onChange(() => updateMaterial())
// materialFolder.add(material, 'visible')
// materialFolder.add(material, 'side', options.side).onChange(() => updateMaterial())
// //materialFolder.open()

// =================================================================================

// const meshToonMaterialFolder = gui.addFolder('THREE.MeshToonMaterial')
// meshToonMaterialFolder.addColor(data, 'color').onChange(() => {
//     material.color.setHex(Number(data.color.toString().replace('#', '0x')))
// })

//shininess, specular and flatShading no longer supported in MeshToonMaterial

// meshToonMaterialFolder
//     .add(data, 'gradientMap', options.gradientMap)
//     .onChange(() => updateMaterial())
// meshToonMaterialFolder.open()

// =================================================================================

/** Đoạn code trên sử dụng thư viện GUI của Three.js để tạo một folder mới có tên là 'THREE.MeshPhongMaterial'.
 * Folder này sẽ chứa các control để điều chỉnh các thuộc tính của một vật liệu MeshPhong trong Three.js.
 */
// const meshPhysicalMaterialFolder = gui.addFolder('THREE.meshPhysicalMaterialFolder ')

// meshPhysicalMaterialFolder.addColor(data, 'color').onChange(() => {
//     material.color.setHex(Number(data.color.toString().replace('#', '0x')))
// })
// meshPhysicalMaterialFolder.addColor(data, 'emissive').onChange(() => {
//     material.emissive.setHex(Number(data.emissive.toString().replace('#', '0x')))
// })
// // meshPhongMaterialFolder.addColor(data, 'specular').onChange(() => {
// //     material.specular.setHex(Number(data.specular.toString().replace('#', '0x')))
// // })
// // meshPhongMaterialFolder.add(material, 'shininess', 0, 1024)
// meshPhysicalMaterialFolder.add(material, 'wireframe')
// meshPhysicalMaterialFolder.add(material, 'flatShading').onChange(() => updateMaterial())
// meshPhysicalMaterialFolder.add(material, 'reflectivity', 0, 1)
// meshPhysicalMaterialFolder.add(material, 'envMapIntensity', 0, 1)
// meshPhysicalMaterialFolder.add(material, 'roughness', 0, 1)
// meshPhysicalMaterialFolder.add(material, 'metalness', 0, 1)
// meshPhysicalMaterialFolder.add(material, 'clearcoat', 0, 1, 0.01)
// meshPhysicalMaterialFolder.add(material, 'clearcoatRoughness', 0, 1, 0.01)
// // meshPhongMaterialFolder.add(material, 'combine', options.combine).onChange(() => updateMaterial())
// meshPhysicalMaterialFolder.open()

// function updateMaterial() {
//     material.side = Number(material.side)
//     // material.combine = Number(material.combine)
//     // material.gradientMap = eval(data.gradientMap as string)
//     material.needsUpdate = true
// }

// Một hàm animate để cập nhật trạng thái của các đối tượng 3D trong mỗi khung hình (frame)
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    // torusKnot.rotation.x += 0.01
    // torusKnot.rotation.y += 0.01

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
