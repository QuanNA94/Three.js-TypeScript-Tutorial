import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

/** ==============================================================
 * While raycasting is almost always used for mouse picking objects in the 3D scene, 
 * it can also be used for simple collision detection.
 * 
 * In this example, I detect whether the orbit controls will penetrate another object 
 * and adjust the cameras position so that it stays outside.
 * 
 * Essentially, I am creating a ray from the camera target to the camera position. 
 * If there is an intersected object between, then the camera position is adjusted to the intersect point. 
 * This prevents the camera from going behind a wall, or inside a box, or floor, 
 * or any object which is part of the objects array being tested for an intersect.
 * 
 * Also, instead of using the raycaster to find the new point to position the camera in case of collision between the target and itself, 
 * I could instead modify the opacity of the object in between and not move the camera. 
 * Rotate the camera and notice how any object between the camera target and the camera itself, becomes transparent.

 * 
 * ----------------NOTE----------------
 * There seems to be a problem with FBXLoader in Three r151. 
 * You may need to downgrade to Three r150.1 to do the FBXLoader lessons.
    npm install three@0.150.1
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
// const light1 = new THREE.PointLight(0xffffff, 2)
// light1.position.set(2.5, 2.5, 2.5)
// scene.add(light1)

// const light2 = new THREE.PointLight(0xffffff, 2)
// light2.position.set(-2.5, 2.5, 2.5)
// scene.add(light2)

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
camera.position.z = 2

// camera.position.set(0.8, 1.4, 1.0)

/** [3]Renderer (Trình kết xuất): là một đối tượng Three.js để kết xuất các đối tượng trên màn hình.
 *  Trình kết xuất sẽ sử dụng WebGL hoặc các công nghệ tương tự để tạo ra các hình ảnh 3D.
 */
const renderer: any = new THREE.WebGLRenderer()
//renderer.physicallyCorrectLights = true //deprecated
// renderer.useLegacyLights = false //use this instead of setting physicallyCorrectLights=true property
// renderer.shadowMap.enabled = true
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

const raycaster = new THREE.Raycaster()
const sceneMeshes: THREE.Mesh[] = []
const dir = new THREE.Vector3()
let intersects: THREE.Intersection[] = []

const controls = new OrbitControls(camera, renderer.domElement)
// cho phép các hiệu ứng nhấp nháy và giảm tốc khi di chuyển camera, giúp tạo ra một trải nghiệm mượt mà hơn khi tương tác với các phần tử 3D.
controls.enableDamping = true
controls.addEventListener('change', function () {
    xLine.position.copy(controls.target)
    yLine.position.copy(controls.target)
    zLine.position.copy(controls.target)

    raycaster.set(controls.target, dir.subVectors(camera.position, controls.target).normalize())

    intersects = raycaster.intersectObjects(sceneMeshes, false)
    if (intersects.length > 0) {
        if (intersects[0].distance < controls.target.distanceTo(camera.position)) {
            camera.position.copy(intersects[0].point)
        }
    }
})

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
)
floor.rotateX(-Math.PI / 2)
floor.position.y = -1
scene.add(floor)
sceneMeshes.push(floor)

const wall1 = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
)
wall1.position.x = 4
wall1.rotateY(-Math.PI / 2)
scene.add(wall1)
sceneMeshes.push(wall1)

const wall2 = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
)
wall2.position.z = -3
scene.add(wall2)
sceneMeshes.push(wall2)

const cube: THREE.Mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshNormalMaterial())
cube.position.set(-3, 0, 0)
scene.add(cube)
sceneMeshes.push(cube)

const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshNormalMaterial({ side: THREE.DoubleSide })
)
ceiling.rotateX(Math.PI / 2)
ceiling.position.y = 3
scene.add(ceiling)
sceneMeshes.push(ceiling)

//crosshair
const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff,
})
const points: THREE.Vector3[] = []
points[0] = new THREE.Vector3(-0.1, 0, 0)
points[1] = new THREE.Vector3(0.1, 0, 0)
let lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
const xLine = new THREE.Line(lineGeometry, lineMaterial)
scene.add(xLine)
points[0] = new THREE.Vector3(0, -0.1, 0)
points[1] = new THREE.Vector3(0, 0.1, 0)
lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
const yLine = new THREE.Line(lineGeometry, lineMaterial)
scene.add(yLine)
points[0] = new THREE.Vector3(0, 0, -0.1)
points[1] = new THREE.Vector3(0, 0, 0.1)
lineGeometry = new THREE.BufferGeometry().setFromPoints(points)
const zLine = new THREE.Line(lineGeometry, lineMaterial)
scene.add(zLine)

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

// Một hàm animate để cập nhật trạng thái của các đối tượng 3D trong mỗi khung hình (frame)
var animate = function () {
    requestAnimationFrame(animate)

    controls.update()

    // helper.update()

    // torus.forEach((t) => {
    //     t.rotation.y += 0.01
    // })

    // trackball controls needs to be updated in the animation loop before it will work
    // controls.update()

    // if (modelReady) mixer.update(clock.getDelta())

    // if (sceneMeshes.length > 1) {
    //     sceneMeshes[1].rotation.x += 0.002
    // }
    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}
animate()
