import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

/** ==============================================================
 * The Directional Light Shadow uses an OrthographicCamera to calculate the shadows, rather than a PerspectiveCamera. 
 * This is because the light rays from the DirectionalLight are parallel.
  ============================================================== */

/** [1] Scene (Cảnh): là một đối tượng Three.js chứa tất cả các đối tượng,
 * ánh sáng và hiệu ứng cần được vẽ trên màn hình.
 */
// tạo một đối tượng scene mới,sau đó thêm đối tượng AxesHelper vào scene
const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

/** [7] Light (Ánh sáng): Được sử dụng để tạo ra ánh sáng trong cảnh, giúp các đối tượng 3D có thể được hiển thị rõ ràng hơn.
 *  Three.js hỗ trợ nhiều loại ánh sáng khác nhau, bao gồm AmbientLight, DirectionalLight, và PointLight.
 */
const light = new THREE.DirectionalLight()
light.castShadow = true
light.shadow.mapSize.width = 512
light.shadow.mapSize.height = 512
light.shadow.camera.near = 0.5
light.shadow.camera.far = 100
scene.add(light)

/**  AxesHelper là một class của Three.js: tạo 1 trục tọa độ 3D
 *  với các đường dẫn khác màu sắc, ở đây trục có độ dài 5 đơn vị
 */

// const helper = new THREE.SpotLightHelper(light)
//const helper = new THREE.DirectionalLightHelper(light);
const helper = new THREE.CameraHelper(light.shadow.camera)
scene.add(helper)

/** [2] Camera (Máy ảnh): là một đối tượng Three.js để đại diện cho góc nhìn của người dùng.
 * Có nhiều loại camera khác nhau như PerspectiveCamera, OrthographicCamera,
 * CubeCamera,... cho phép bạn tạo ra các hiệu ứng khác nhau và điều chỉnh khoảng cách đến các đối tượng trên màn hình.
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 7
// camera.position.set(0, -0.35, 0.2)

/** [3]Renderer (Trình kết xuất): là một đối tượng Three.js để kết xuất các đối tượng trên màn hình.
 *  Trình kết xuất sẽ sử dụng WebGL hoặc các công nghệ tương tự để tạo ra các hình ảnh 3D.
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.shadowMap.type = THREE.BasicShadowMap
//renderer.shadowMap.type = THREE.PCFShadowMap
// renderer.shadowMap.type = THREE.VSMShadowMap

/** Thêm đối tượng renderer vào thẻ HTML sử dụng hàm appendChild(renderer.domElement).
 *  Trong trường hợp này, renderer.domElement là một đối tượng HTMLCanvasElement,
 *  và nó sẽ được thêm vào thẻ body để hiển thị kết quả cuối cùng của các hoạt động đồ họa.
 */
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

// 1. khởi tạo một đối tượng PlaneGeometry với kích thước 100 đơn vị chiều dài và 20 đơn vị chiều rộng.
const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(100, 20)
// 2.  MeshPhongMaterial để tạo chất liệu cho mặt phẳng.
const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
// 3. xoay mặt phẳng quanh trục X một góc -90 độ, tức là xoay mặt phẳng ngang xuống.
plane.rotateX(-Math.PI / 2)
// 4. đặt vị trí của mặt phẳng tại độ cao -1.75 đơn vị so với trục Y. Điều này đặt mặt phẳng trên mặt đất.
plane.position.y = -1.75
plane.receiveShadow = true

// 5.  thêm mặt phẳng vào đối tượng Scene để nó được hiển thị lên màn hình.
scene.add(plane)
// =================================================================================

const torusGeometry = [
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
]

const material = [
    new THREE.MeshBasicMaterial(),
    new THREE.MeshLambertMaterial(),
    new THREE.MeshPhongMaterial(),
    new THREE.MeshPhysicalMaterial({}),
    new THREE.MeshToonMaterial(),
]

const torus = [
    new THREE.Mesh(torusGeometry[0], material[0]),
    new THREE.Mesh(torusGeometry[1], material[1]),
    new THREE.Mesh(torusGeometry[2], material[2]),
    new THREE.Mesh(torusGeometry[3], material[3]),
    new THREE.Mesh(torusGeometry[4], material[4]),
]

const texture = new THREE.TextureLoader().load('img/grid.png')
material[0].map = texture
material[1].map = texture
material[2].map = texture
material[3].map = texture
material[4].map = texture

torus[0].position.x = -8
torus[1].position.x = -4
torus[2].position.x = 0
torus[3].position.x = 4
torus[4].position.x = 8

torus[0].castShadow = true
torus[1].castShadow = true
torus[2].castShadow = true
torus[3].castShadow = true
torus[4].castShadow = true

torus[0].receiveShadow = true
torus[1].receiveShadow = true
torus[2].receiveShadow = true
torus[3].receiveShadow = true
torus[4].receiveShadow = true

scene.add(torus[0])
scene.add(torus[1])
scene.add(torus[2])
scene.add(torus[3])
scene.add(torus[4])

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

const data = {
    color: light.color.getHex(),
    // groundColor: light.groundColor.getHex(),
    mapsEnabled: true,
    shadowMapSizeWidth: 512,
    shadowMapSizeHeight: 512,
}

const gui = new GUI()
const lightFolder = gui.addFolder('THREE.Light')
lightFolder.addColor(data, 'color').onChange(() => {
    light.color.setHex(Number(data.color.toString().replace('#', '0x')))
})

lightFolder.add(light, 'intensity', 0, 1, 0.01)
// lightFolder.open()

const directionalLightFolder = gui.addFolder('THREE.DirectionalLight')
directionalLightFolder
    .add(light.shadow.camera, 'left', -10, -1, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix())
directionalLightFolder
    .add(light.shadow.camera, 'right', 1, 10, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix())
directionalLightFolder
    .add(light.shadow.camera, 'top', 1, 10, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix())
directionalLightFolder
    .add(light.shadow.camera, 'bottom', -10, -1, 0.1)
    .onChange(() => light.shadow.camera.updateProjectionMatrix())
directionalLightFolder
    .add(light.shadow.camera, 'near', 0.1, 100)
    .onChange(() => light.shadow.camera.updateProjectionMatrix())
directionalLightFolder
    .add(light.shadow.camera, 'far', 0.1, 100)
    .onChange(() => light.shadow.camera.updateProjectionMatrix())
directionalLightFolder
    .add(data, 'shadowMapSizeWidth', [256, 512, 1024, 2048, 4096])
    .onChange(() => updateShadowMapSize())
directionalLightFolder
    .add(data, 'shadowMapSizeHeight', [256, 512, 1024, 2048, 4096])
    .onChange(() => updateShadowMapSize())
directionalLightFolder.add(light.position, 'x', -50, 50, 0.01)
directionalLightFolder.add(light.position, 'y', -50, 50, 0.01)
directionalLightFolder.add(light.position, 'z', -50, 50, 0.01)
directionalLightFolder.open()

function updateShadowMapSize() {
    light.shadow.mapSize.width = data.shadowMapSizeWidth
    light.shadow.mapSize.height = data.shadowMapSizeHeight
    ;(light.shadow.map as any) = null
}

const meshesFolder = gui.addFolder('Meshes')
meshesFolder.add(data, 'mapsEnabled').onChange(() => {
    material.forEach((m) => {
        if (data.mapsEnabled) {
            m.map = texture
        } else {
            m.map = null
        }
        m.needsUpdate = true
    })
})

// Một hàm animate để cập nhật trạng thái của các đối tượng 3D trong mỗi khung hình (frame)
function animate() {
    requestAnimationFrame(animate)

    helper.update()

    torus.forEach((t) => {
        t.rotation.y += 0.01
    })

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}
animate()
