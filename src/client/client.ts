import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
/** ==============================================================
 * Sometimes you only need a simple positional transform to occur over time. 
 * The tween library works very well, but it could be over engineering if you don't actually need all the features that it offers.
 * 
 * If you only want to move an object from A to B and, and nothing else then you can use the Vector3 .lerp and .lerpVectors methods.
 * 
 * EX: 
 *  ====================================================================================================
 * || (method) Vector3.lerp(v1: THREE.Vector3, alpha: number): THREE.Vector3                            ||
 * || (method) Vector3.lerpVectors(v1: THREE.Vector3, v2: THREE.Vector3, alpha: number): THREE.Vector3  ||
 *  ====================================================================================================
 * eg,  
 * cube.position.lerp(new THREE.Vector3(1, 2, 3), 0.05)
 * 
 * =====================================================================================================================
 * v1 : Is the vector to lerp towards.
 * alpha : Is the percent distance along the line from the current vector to the v1.
 * v2 : If using .lerpVectors, then you can set an alternate start vector3 to lerp from rather that the current vector3.
 * =====================================================================================================================
 * Calling .lerp during an animation loop will appear to mimic a Tween using a TWEEN.Easing.Cubic.Out
 * Calling .lerpVectors is useful if you want to slide an object along an arbitrary line depending on the alpha value. Amongst other things.
 * Set alpha to low number such as 0.1, and the vector will appear to lerp more slowly, slowing down as it gets closer to the target vector.
 * Set alpha to 1.0, and the tween will happen instantly in one render cycle.
 * Double-click on the floor in the example to see a slower lerp. 
 * Then experiment with the alphas to see a faster lerp and slide a second cube along a line between the first cube and the starting position.

  ============================================================== */

/** [1] Scene (Cảnh): là một đối tượng Three.js chứa tất cả các đối tượng,
 * ánh sáng và hiệu ứng cần được vẽ trên màn hình.
 */
// tạo một đối tượng scene mới,sau đó thêm đối tượng AxesHelper vào scene
const scene = new THREE.Scene()
// scene.add(new THREE.AxesHelper(5))

/** [7] Light (Ánh sáng): Được sử dụng để tạo ra ánh sáng trong cảnh, giúp các đối tượng 3D có thể được hiển thị rõ ràng hơn.
 *  Three.js hỗ trợ nhiều loại ánh sáng khác nhau, bao gồm AmbientLight, DirectionalLight, và PointLight.
 */
// const light = new THREE.SpotLight()
// light.position.set(12.5, 12.5, 12.5)
// light.castShadow = true
// light.shadow.mapSize.width = 1024
// light.shadow.mapSize.height = 1024
// scene.add(light)

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

camera.position.set(1, 2, 5)

/** [3]Renderer (Trình kết xuất): là một đối tượng Three.js để kết xuất các đối tượng trên màn hình.
 *  Trình kết xuất sẽ sử dụng WebGL hoặc các công nghệ tương tự để tạo ra các hình ảnh 3D.
 */
const renderer = new THREE.WebGLRenderer()
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

const controls = new OrbitControls(camera, renderer.domElement)
// cho phép các hiệu ứng nhấp nháy và giảm tốc khi di chuyển camera, giúp tạo ra một trải nghiệm mượt mà hơn khi tương tác với các phần tử 3D.
// controls.enableDamping = true
// controls.target.set(0, 1, 0)
// controls.addEventListener('change', render) // this line is uneccessary if you are re-render

// const sceneMeshes: THREE.Mesh[] = []
// let sceneMeshes: any = []

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20, 10, 10),
    new THREE.MeshBasicMaterial({ color: 0xaec6cf, wireframe: true })
)

floor.rotateX(-Math.PI / 2)
scene.add(floor)

const geometry = new THREE.BoxGeometry()
// the cube used for .lerp
const cube1 = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
)
cube1.position.y = 0.5
scene.add(cube1)

//the cube used for .lerpVectors
const cube2: THREE.Mesh = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
)
cube2.position.y = 0.5
scene.add(cube2)

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

const raycaster = new THREE.Raycaster()
let v1 = new THREE.Vector3(2, 0.5, 2)
let v2 = new THREE.Vector3(0, 0.5, 0)

const mouse = new THREE.Vector2()

function onDoubleClick(event: MouseEvent) {
    // const mouse = {
    //     x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
    //     y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    // }

    mouse.set(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    )

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObject(floor, false)

    if (intersects.length > 0) {
        v1 = intersects[0].point
        v1.y += 0.5 //raise it so it appears to sit on grid
        //console.log(v1)

        // modelMesh.lookAt(p)
    }
}

renderer.domElement.addEventListener('dblclick', onDoubleClick, false)

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

const data = {
    lerpAlpha: 0.1,
    lerpVectorsAlpha: 1.0,
}

const gui = new GUI()

const lerpFolder = gui.addFolder('.lerp')
lerpFolder.add(data, 'lerpAlpha', 0, 1.0, 0.01)
lerpFolder.open()

const lerpVectorsFolder = gui.addFolder('.lerpVectors')
lerpVectorsFolder.add(data, 'lerpVectorsAlpha', 0, 1.0, 0.01)
lerpVectorsFolder.open()

// Một hàm animate để cập nhật trạng thái của các đối tượng 3D trong mỗi khung hình (frame)
var animate = function () {
    requestAnimationFrame(animate)

    controls.update()

    cube1.position.lerp(v1, data.lerpAlpha)
    cube2.position.lerpVectors(v1, v2, data.lerpVectorsAlpha)
    controls.target.copy(cube1.position)

    // controls.target.lerp(v1, .01)

    // helper.update()

    // torus.forEach((t) => {
    //     t.rotation.y += 0.01
    // })

    // trackball controls needs to be updated in the animation loop before it will work
    // controls.update()

    // if (sceneMeshes.length > 1) {
    //     sceneMeshes[1].rotation.x += 0.002
    // }
    render()

    stats.update()
}

function render() {
    // labelRenderer.render(scene, camera)
    renderer.render(scene, camera)
}
animate()
