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

/** [2] Camera (Máy ảnh): là một đối tượng Three.js để đại diện cho góc nhìn của người dùng.
 * Có nhiều loại camera khác nhau như PerspectiveCamera, OrthographicCamera,
 * CubeCamera,... cho phép bạn tạo ra các hiệu ứng khác nhau và điều chỉnh khoảng cách đến các đối tượng trên màn hình.
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = -2
camera.position.y = 4
camera.position.z = 5

/** [3]Renderer (Trình kết xuất): là một đối tượng Three.js để kết xuất các đối tượng trên màn hình.
 *  Trình kết xuất sẽ sử dụng WebGL hoặc các công nghệ tương tự để tạo ra các hình ảnh 3D.
 */
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

/** [8] Controls (Điều khiển): là một đối tượng Three.js để cung cấp các điều khiển cho người dùng,
 * cho phép họ di chuyển và xoay camera.
 */
new OrbitControls(camera, renderer.domElement)

/** [4] Geometry (Hình học): là một đối tượng Three.js để đại diện cho hình dạng và kích thước của một đối tượng.
 *  Geometry có thể được sử dụng để tạo ra các hình dạng phức tạp
 * từ các hình dạng cơ bản như hình cầu, hình trụ, hình chữ nhật,...
 */
const boxGeometry = new THREE.BoxGeometry()
const sphereGeometry = new THREE.SphereGeometry()
const icosahedronGeometry = new THREE.IcosahedronGeometry()

/** [5] Material (Vật liệu): là một đối tượng Three.js để đại diện cho màu sắc, độ bóng và ánh sáng của một đối tượng.
 *  Vật liệu có thể được áp dụng cho hình học để tạo ra các hiệu ứng khác nhau,
 *  chẳng hạn như phản chiếu, ánh sáng, bóng tối,...
 */
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

/** [6] Mesh (Lưới): là một đối tượng Three.js để kết hợp geometry và material của một đối tượng.
 *  Mesh có thể được đặt trong scene và sẽ được kết xuất bởi trình kết xuất.
 */
const cube = new THREE.Mesh(boxGeometry, material)
cube.position.x = 5
scene.add(cube)

const sphere = new THREE.Mesh(sphereGeometry, material)
sphere.position.x = -5
scene.add(sphere)

const icosahedron = new THREE.Mesh(icosahedronGeometry, material)
scene.add(icosahedron)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
const cubeFolder = gui.addFolder('Cube')
const cubeRotationFolder = cubeFolder.addFolder('Rotation')
cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2, 0.01)
cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2, 0.01)
cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2, 0.01)
const cubePositionFolder = cubeFolder.addFolder('Position')
cubePositionFolder.add(cube.position, 'x', -10, 10)
cubePositionFolder.add(cube.position, 'y', -10, 10)
cubePositionFolder.add(cube.position, 'z', -10, 10)
const cubeScaleFolder = cubeFolder.addFolder('Scale')
cubeScaleFolder.add(cube.scale, 'x', -5, 5, 0.1) //.onFinishChange(() => console.dir(cube.geometry))
cubeScaleFolder.add(cube.scale, 'y', -5, 5, 0.1)
cubeScaleFolder.add(cube.scale, 'z', -5, 5, 0.1)
cubeFolder.add(cube, 'visible', true)
cubeFolder.open()

// const debug = document.getElementById('debug1') as HTMLDivElement

const cubeData = {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1,
}

const cubePropertiesFolder = cubeFolder.addFolder('Properties')

cubePropertiesFolder
    .add(cubeData, 'width', 1, 30)
    .onChange(regenerateBoxGeometry)
    .onFinishChange(() => console.dir(cube.geometry))
cubePropertiesFolder.add(cubeData, 'height', 1, 30).onChange(regenerateBoxGeometry)
cubePropertiesFolder.add(cubeData, 'depth', 1, 30).onChange(regenerateBoxGeometry)
cubePropertiesFolder.add(cubeData, 'widthSegments', 1, 30).onChange(regenerateBoxGeometry)
cubePropertiesFolder.add(cubeData, 'heightSegments', 1, 30).onChange(regenerateBoxGeometry)
cubePropertiesFolder.add(cubeData, 'depthSegments', 1, 30).onChange(regenerateBoxGeometry)

function regenerateBoxGeometry() {
    const newGeometry = new THREE.BoxGeometry(
        cubeData.width,
        cubeData.height,
        cubeData.depth,
        cubeData.widthSegments,
        cubeData.heightSegments,
        cubeData.depthSegments
    )
    cube.geometry.dispose()
    cube.geometry = newGeometry
}

const sphereData = {
    radius: 1,
    widthSegments: 8,
    heightSegments: 6,
    phiStart: 0,
    phiLength: Math.PI * 2,
    thetaStart: 0,
    thetaLength: Math.PI,
}
const sphereFolder = gui.addFolder('Sphere')
const spherePropertiesFolder = sphereFolder.addFolder('Properties')
spherePropertiesFolder.add(sphereData, 'radius', 0.1, 30).onChange(regenerateSphereGeometry)
spherePropertiesFolder.add(sphereData, 'widthSegments', 1, 32).onChange(regenerateSphereGeometry)
spherePropertiesFolder.add(sphereData, 'heightSegments', 1, 16).onChange(regenerateSphereGeometry)
spherePropertiesFolder
    .add(sphereData, 'phiStart', 0, Math.PI * 2)
    .onChange(regenerateSphereGeometry)
spherePropertiesFolder
    .add(sphereData, 'phiLength', 0, Math.PI * 2)
    .onChange(regenerateSphereGeometry)
spherePropertiesFolder.add(sphereData, 'thetaStart', 0, Math.PI).onChange(regenerateSphereGeometry)
spherePropertiesFolder.add(sphereData, 'thetaLength', 0, Math.PI).onChange(regenerateSphereGeometry)

function regenerateSphereGeometry() {
    const newGeometry = new THREE.SphereGeometry(
        sphereData.radius,
        sphereData.widthSegments,
        sphereData.heightSegments,
        sphereData.phiStart,
        sphereData.phiLength,
        sphereData.thetaStart,
        sphereData.thetaLength
    )
    sphere.geometry.dispose()
    sphere.geometry = newGeometry
}

const icosahedronData = {
    radius: 1,
    detail: 0,
}
const icosahedronFolder = gui.addFolder('Icosahedron')
const icosahedronPropertiesFolder = icosahedronFolder.addFolder('Properties')
icosahedronPropertiesFolder
    .add(icosahedronData, 'radius', 0.1, 10)
    .onChange(regenerateIcosahedronGeometry)
icosahedronPropertiesFolder
    .add(icosahedronData, 'detail', 0, 5)
    .step(1)
    .onChange(regenerateIcosahedronGeometry)

function regenerateIcosahedronGeometry() {
    const newGeometry = new THREE.IcosahedronGeometry(
        icosahedronData.radius,
        icosahedronData.detail
    )
    icosahedron.geometry.dispose()
    icosahedron.geometry = newGeometry
}

const debug = document.getElementById('debug1') as HTMLDivElement

function animate() {
    requestAnimationFrame(animate)

    render()

    // debug.innerText =
    //     'Red\n' +
    //     'Local Pos X : ' +
    //     object1.position.x.toFixed(2) +
    //     '\n' +
    //     'World Pos X : ' +
    //     object1WorldPosition.x.toFixed(2) +
    //     '\n' +
    //     '\nGreen\n' +
    //     'Local Pos X : ' +
    //     object2.position.x.toFixed(2) +
    //     '\n' +
    //     'World Pos X : ' +
    //     object2WorldPosition.x.toFixed(2) +
    //     '\n' +
    //     '\nBlue\n' +
    //     'Local Pos X : ' +
    //     object3.position.x.toFixed(2) +
    //     '\n' +
    //     'World Pos X : ' +
    //     object3WorldPosition.x.toFixed(2) +
    //     '\n'

    debug.innerText = 'Matrix\n' + cube.matrix.elements.toString().replace(/,/g, '\n')

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
