import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import * as CANNON from 'cannon-es'
/** ==============================================================
 * Animation can also be achieved using a Physics library. We can use a library called Cannon.js. 
 * But, rather than using the original Cannon.js, which is no longer maintained, we can install a newer fork of it named Cannon-es instead.
 * 
 * The Cannon physics library is ideal for simulating rigid bodies. You don't have to use it with Three.js, 
 * but it was originally built to be used with Three.js, so it will be quite easy to begin using in your project.
 * 
 * We will use it to make objects move and interact in a more realistic way and provide collision detection possibilities.
 * 
 * 
 * Basic Concepts

    Shape : A geometrical shape, such as a sphere, cube or plane, used for the the physics calculations.

    Rigid Body : A rigid body has a shape and a number of other properties used in the calculations such as mass and inertia.

    Constraint : A 3D body has 6 degrees of freedom, 3 for position and three to describe the rotation vector. 
    A constraint is a limit on one of the degrees of freedom.

    Contact constraint : A type of constraint to simulate friction and restitution. 
    These are like the faces of an object where the constraint is applied.

    World : A collection of bodies and constraints that interact together.

    Solver : The algorithm that is passed over the bodies and constraints to calculate there physical properties 
    and adjust them accordingly.

//-------------------------------------------------------
    npm install cannon-es --save-dev
//-------------------------------------------------------

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
// const light = new THREE.SpotLight()
// light.position.set(12.5, 12.5, 12.5)
// light.castShadow = true
// light.shadow.mapSize.width = 1024
// light.shadow.mapSize.height = 1024
// scene.add(light)

const light1 = new THREE.SpotLight()
light1.position.set(2.5, 5, 5)
light1.angle = Math.PI / 4
light1.penumbra = 0.5
light1.castShadow = true
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
light1.shadow.camera.near = 0.5
light1.shadow.camera.far = 20
scene.add(light1)

const light2 = new THREE.SpotLight()
light2.position.set(-2.5, 5, 5)
light2.angle = Math.PI / 4
light2.penumbra = 0.5
light2.castShadow = true
light2.shadow.mapSize.width = 1024
light2.shadow.mapSize.height = 1024
light2.shadow.camera.near = 0.5
light2.shadow.camera.far = 20
scene.add(light2)

/**  AxesHelper là một class của Three.js: tạo 1 trục tọa độ 3D
 *  với các đường dẫn khác màu sắc, ở đây trục có độ dài 5 đơn vị
 */

// const helper = new THREE.SpotLightHelper(light)
//const helper = new THREE.DirectionalLightHelper(light);
// const helper = new THREE.CameraHelper(light.shadow.camera)
// scene.add(helper)

/** [2] Camera (Máy ảnh): là một đối tượng Three.js để đại diện cho góc nhìn của người dùng.
 * Có nhiều loại camera khác nhau như PerspectiveCamera, OrthographicCamera,
 * CubeCamera,... cho phép bạn tạo ra các hiệu ứng khác nhau và điều chỉnh khoảng cách đến các đối tượng trên màn hình.
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// camera.position.x = 2
// camera.position.y = 1
// camera.position.z = 2

camera.position.set(0, 2, 4)

/** [3]Renderer (Trình kết xuất): là một đối tượng Three.js để kết xuất các đối tượng trên màn hình.
 *  Trình kết xuất sẽ sử dụng WebGL hoặc các công nghệ tương tự để tạo ra các hình ảnh 3D.
 */
const renderer = new THREE.WebGLRenderer()
//renderer.physicallyCorrectLights = true //deprecated
// renderer.useLegacyLights = false //use this instead of setting physicallyCorrectLights=true property
renderer.shadowMap.enabled = true
// renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)

/** Thêm đối tượng renderer vào thẻ HTML sử dụng hàm appendChild(renderer.domElement).
 *  Trong trường hợp này, renderer.domElement là một đối tượng HTMLCanvasElement,
 *  và nó sẽ được thêm vào thẻ body để hiển thị kết quả cuối cùng của các hoạt động đồ họa.
 */
document.body.appendChild(renderer.domElement)
//const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true })
//const cube: THREE.Mesh = new THREE.Mesh(geometry, material)
//scene.add(cube)

/** [4] Geometry (Hình học): là một đối tượng Three.js để đại diện cho hình dạng và kích thước của một đối tượng.
 *  Geometry có thể được sử dụng để tạo ra các hình dạng phức tạp
 * từ các hình dạng cơ bản như hình cầu, hình trụ, hình chữ nhật,...
 */

/** `new OrbitControls(camera, renderer.domElement)`
 * sử dụng trong Three.js để tạo ra một đối tượng điều khiển camera bằng chuột.
 * Nó cung cấp cho người dùng khả năng quay và di chuyển camera trong không gian 3D.
 */

const controls = new OrbitControls(camera, renderer.domElement)
// cho phép các hiệu ứng nhấp nháy và giảm tốc khi di chuyển camera, giúp tạo ra một trải nghiệm mượt mà hơn khi tương tác với các phần tử 3D.
controls.enableDamping = true
controls.target.y = 0.5
// controls.target.set(0, 1, 0)
// controls.addEventListener('change', render) // this line is uneccessary if you are re-render

// const sceneMeshes: THREE.Mesh[] = []
// let sceneMeshes: any = []

// ===========================================================================

const world = new CANNON.World()
world.gravity.set(0, -9.82, 0)
// world.broadphase = new CANNON.NaiveBroadphase()
// ;(world.solver as CANNON.GSSolver).iterations = 10
// world.allowSleep = true

// ===========================================================================

const normalMaterial = new THREE.MeshNormalMaterial()
const phongMaterial = new THREE.MeshPhongMaterial()

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeMesh = new THREE.Mesh(cubeGeometry, normalMaterial)

cubeMesh.position.x = -3
cubeMesh.position.y = 3
cubeMesh.castShadow = true

scene.add(cubeMesh)
const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
const cubeBody = new CANNON.Body({ mass: 1 })
cubeBody.addShape(cubeShape)
cubeBody.position.x = cubeMesh.position.x
cubeBody.position.y = cubeMesh.position.y
cubeBody.position.z = cubeMesh.position.z
world.addBody(cubeBody)

const sphereGeometry = new THREE.SphereGeometry()
const sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial)
sphereMesh.position.x = -1
sphereMesh.position.y = 3
sphereMesh.castShadow = true
scene.add(sphereMesh)
const sphereShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)) //new CANNON.Sphere(1)
const sphereBody = new CANNON.Body({ mass: 1 })
sphereBody.addShape(sphereShape)
sphereBody.position.x = sphereMesh.position.x
sphereBody.position.y = sphereMesh.position.y
sphereBody.position.z = sphereMesh.position.z
world.addBody(sphereBody)

const icosahedronGeometry = new THREE.IcosahedronGeometry(1, 0)
const icosahedronMesh = new THREE.Mesh(icosahedronGeometry, normalMaterial)
icosahedronMesh.position.x = 1
icosahedronMesh.position.y = 3
icosahedronMesh.castShadow = true
scene.add(icosahedronMesh)
let position = (icosahedronMesh.geometry.attributes.position as THREE.BufferAttribute).array
const icosahedronPoints: CANNON.Vec3[] = []
for (let i = 0; i < position.length; i += 3) {
    icosahedronPoints.push(new CANNON.Vec3(position[i], position[i + 1], position[i + 2]))
}
const icosahedronFaces: number[][] = []
for (let i = 0; i < position.length / 3; i += 3) {
    icosahedronFaces.push([i, i + 1, i + 2])
}
const icosahedronShape = new CANNON.ConvexPolyhedron({
    vertices: icosahedronPoints,
    faces: icosahedronFaces,
})
const icosahedronBody = new CANNON.Body({ mass: 1 })
icosahedronBody.addShape(icosahedronShape)
icosahedronBody.position.x = icosahedronMesh.position.x
icosahedronBody.position.y = icosahedronMesh.position.y
icosahedronBody.position.z = icosahedronMesh.position.z
world.addBody(icosahedronBody)

const torusKnotGeometry = new THREE.TorusKnotGeometry()
const torusKnotMesh = new THREE.Mesh(torusKnotGeometry, normalMaterial)
torusKnotMesh.position.x = 4
torusKnotMesh.position.y = 3
torusKnotMesh.castShadow = true
scene.add(torusKnotMesh)
// position = (torusKnotMesh.geometry.attributes.position as THREE.BufferAttribute).array
// const torusKnotPoints: CANNON.Vec3[] = []
// for (let i = 0; i < position.length; i += 3) {
//     torusKnotPoints.push(new CANNON.Vec3(position[i], position[i + 1], position[i + 2]))
// }
// const torusKnotFaces: number[][] = []
// for (let i = 0; i < position.length / 3; i += 3) {
//     torusKnotFaces.push([i, i + 1, i + 2])
// }
// const torusKnotShape = new CANNON.ConvexPolyhedron({
//     vertices: torusKnotPoints,
//     faces: torusKnotFaces,
// })
const torusKnotShape = CreateTrimesh(torusKnotMesh.geometry)
const torusKnotBody = new CANNON.Body({ mass: 1 })
torusKnotBody.addShape(torusKnotShape)
torusKnotBody.position.x = torusKnotMesh.position.x
torusKnotBody.position.y = torusKnotMesh.position.y
torusKnotBody.position.z = torusKnotMesh.position.z
world.addBody(torusKnotBody)

function CreateTrimesh(geometry: THREE.BufferGeometry) {
    const vertices = (geometry.attributes.position as THREE.BufferAttribute).array
    const indices = Object.keys(vertices).map(Number)
    return new CANNON.Trimesh(vertices as [], indices)
}

const planeGeometry = new THREE.PlaneGeometry(25, 25)
const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial)
planeMesh.rotateX(-Math.PI / 2)
planeMesh.receiveShadow = true
scene.add(planeMesh)

// the cube will dropping and landing on the floor
const planeShape = new CANNON.Plane()
const planeBody = new CANNON.Body({ mass: 0 })
planeBody.addShape(planeShape)
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
world.addBody(planeBody)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    // 1. Cập nhật tỷ lệ khung hình (aspect) của camera theo kích thước mới của window:
    camera.aspect = window.innerWidth / window.innerHeight
    // 2. Cập nhật ma trận chiếu (projection matrix) của camera:
    camera.updateProjectionMatrix()
    // 3. Cập nhật kích thước của renderer để phù hợp với kích thước mới của window:
    renderer.setSize(window.innerWidth, window.innerHeight)
    // labelRenderer.setSize(window.innerWidth, window.innerHeight)
    // 4. Gọi hàm render() để render lại cảnh.
    render()
    /** Những bước này giúp đảm bảo rằng cảnh được hiển thị đúng tỷ lệ khung hình
     * và độ phân giải trên màn hình khi kích thước của cửa sổ trình duyệt thay đổi.
     */
}

// ===================================================================================

// const animations = {
//     default: function () {
//         setAction(animationActions[0])
//     },
//     samba: function () {
//         setAction(animationActions[1])
//     },
//     bellydance: function () {
//         setAction(animationActions[2])
//     },
//     goofyrunning: function () {
//         setAction(animationActions[3])
//     },
// }

// const setAction = (toAction: THREE.AnimationAction) => {
//     if (toAction != activeAction) {
//         lastAction = activeAction
//         activeAction = toAction
//         //lastAction.stop()
//         lastAction.fadeOut(1)
//         activeAction.reset()
//         activeAction.fadeIn(1)
//         activeAction.play()
//     }
// }

// const clock = new THREE.Clock()

// const data = {
//     color: light.color.getHex(),
//     // groundColor: light.groundColor.getHex(),
//     mapsEnabled: true,
//     shadowMapSizeWidth: 512,
//     shadowMapSizeHeight: 512,
// }

// ===================================================================================

const stats = Stats()
document.body.appendChild(stats.dom)

const gui = new GUI()
// const physicsFolder = gui.addFolder('Physics')
// physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1)
// physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1)
// physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1)
// physicsFolder.open()

const clock = new THREE.Clock()
let delta

// Một hàm animate để cập nhật trạng thái của các đối tượng 3D trong mỗi khung hình (frame)
var animate = function () {
    requestAnimationFrame(animate)

    controls.update()

    // delta = clock.getDelta()
    delta = Math.min(clock.getDelta(), 0.1) // if that number clock.getDelta gets too high,then use that number (0.1) instead
    world.step(delta)

    // Copy coordinates from Cannon to Three.js
    cubeMesh.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z)
    cubeMesh.quaternion.set(
        cubeBody.quaternion.x,
        cubeBody.quaternion.y,
        cubeBody.quaternion.z,
        cubeBody.quaternion.w
    )

    /**
     * đồng bộ hóa vị trí và hướng quay của một đối tượng hình cầu (sphereMesh)
     * trong không gian 3 chiều với một thể rắn (sphereBody) trong một mô phỏng vật lý.
     */
    sphereMesh.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z)
    sphereMesh.quaternion.set(
        sphereBody.quaternion.x,
        sphereBody.quaternion.y,
        sphereBody.quaternion.z,
        sphereBody.quaternion.w
    )

    /** update position and quaternion
     *
     */
    icosahedronMesh.position.set(
        icosahedronBody.position.x,
        icosahedronBody.position.y,
        icosahedronBody.position.z
    )
    icosahedronMesh.quaternion.set(
        icosahedronBody.quaternion.x,
        icosahedronBody.quaternion.y,
        icosahedronBody.quaternion.z,
        icosahedronBody.quaternion.w
    )
    torusKnotMesh.position.set(
        torusKnotBody.position.x,
        torusKnotBody.position.y,
        torusKnotBody.position.z
    )
    torusKnotMesh.quaternion.set(
        torusKnotBody.quaternion.x,
        torusKnotBody.quaternion.y,
        torusKnotBody.quaternion.z,
        torusKnotBody.quaternion.w
    )

    render()

    stats.update()
}

function render() {
    // labelRenderer.render(scene, camera)
    renderer.render(scene, camera)
}
animate()
