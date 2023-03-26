import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import Stats from 'three/examples/jsm/libs/stats.module'

/** ==============================================================
 * The PointerLockControls implements the inbuilt browsers Pointer Lock API.
 *  It provides input methods based on the movement of the mouse over time (i.e., deltas), 
 * not just the absolute position of the mouse cursor in the viewport.
 *  It gives you access to raw mouse movement,
 *  locks the target of mouse events to a single element,
 *  eliminates limits on how far mouse movement can go in a single direction,
 *  and removes the cursor from view. It is ideal for first person 3D games, for example.
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
// const light = new THREE.DirectionalLight()
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
camera.position.y = 1
camera.position.z = 2
// camera.position.set(0, -0.35, 0.2)

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

const menuPanel = document.getElementById('menuPanel') as HTMLDivElement
const startButton = document.getElementById('startButton') as HTMLInputElement
startButton.addEventListener(
    'click',
    function () {
        controls.lock()
    },
    false
)

/** `new OrbitControls(camera, renderer.domElement)`
 * sử dụng trong Three.js để tạo ra một đối tượng điều khiển camera bằng chuột.
 * Nó cung cấp cho người dùng khả năng quay và di chuyển camera trong không gian 3D.
 */
const controls = new PointerLockControls(camera, renderer.domElement)
// controls.addEventListener('change', () => console.log("Controls Change"))
controls.addEventListener('lock', () => menuPanel.style.display = 'none')
controls.addEventListener('unlock', () => menuPanel.style.display = 'block')

/** [4] Geometry (Hình học): là một đối tượng Three.js để đại diện cho hình dạng và kích thước của một đối tượng.
 *  Geometry có thể được sử dụng để tạo ra các hình dạng phức tạp
 * từ các hình dạng cơ bản như hình cầu, hình trụ, hình chữ nhật,...
 */

const planeGeometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(100, 100, 50, 50)
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const plane = new THREE.Mesh(planeGeometry, material)
plane.rotateX(-Math.PI / 2)
scene.add(plane)

// const cube = new THREE.Mesh(geometry, material)
// // thêm mặt phẳng vào đối tượng Scene để nó được hiển thị lên màn hình.
// scene.add(cube)

/** Đoạn code trên sử dụng thư viện Three.js để tạo ra 100 hình hộp (cubes)
 * có kích thước và màu sắc ngẫu nhiên, và thêm chúng vào một scene.
 */

const cubes: THREE.Mesh[] = []
for (let i = 0; i < 100; i++) {
    // Để tạo ra mỗi hình hộp, đoạn code sử dụng class THREE.BoxGeometry để tạo ra geometry và
    const geo = new THREE.BoxGeometry(Math.random() * 4, Math.random() * 16, Math.random() * 4)
    // class THREE.MeshBasicMaterial để tạo ra vật liệu cho mỗi hình hộp.
    // Vật liệu được tạo ra với thuộc tính wireframe: true, nghĩa là chỉ hiển thị khung xương của hình hộp thay vì mặt phẳng.
    const mat = new THREE.MeshBasicMaterial({ wireframe: true })

    /**
     * Màu sắc của từng hình hộp được xác định dựa trên phần dư của số thứ tự của hình hộp khi chia cho 3,
     * bằng cách sử dụng câu lệnh switch-case để gán giá trị màu cho vật liệu.
     */
    switch (i % 3) {
        case 0:
            // Nếu số thứ tự là 0, hình hộp có màu đỏ (0xff0000)
            mat.color = new THREE.Color(0xff0000)
            break
        case 1:
            // nếu là 1 thì màu vàng (0xffff00)
            mat.color = new THREE.Color(0xffff00)
            break
        case 2:
            // nếu là 2 thì màu xanh dương (0x0000ff).
            mat.color = new THREE.Color(0x0000ff)
            break
    }
    /**
     * Sau khi tạo ra các hình hộp,
     * chúng được đặt vào một mảng (cubes)
     */
    const cube = new THREE.Mesh(geo, mat)
    cubes.push(cube)
}
/** và sau đó vòng lặp forEach
 * được sử dụng để xác định vị trí và đưa từng hình hộp vào scene.
 */
cubes.forEach((c) => {
    /**
     * Mỗi hình hộp được đặt vào một vị trí ngẫu nhiên trên trục x và trục z,
     * và được nâng lên một độ cao sao cho mặt phẳng đáy của hình hộp đặt trên mặt phẳng của scene.
     */

    c.position.x = Math.random() * 100 - 50
    c.position.z = Math.random() * 100 - 50

    // Điều này được thực hiện bằng cách tính toán chiều cao của hình hộp thông qua phương thức computeBoundingBox() của geometry,
    c.geometry.computeBoundingBox()
    // sau đó tính toán vị trí theo công thức ((max.y - min.y) / 2).
    // c.position.y =
    //     ((c.geometry.boundingBox as THREE.Box3).max.y -
    //         (c.geometry.boundingBox as THREE.Box3).min.y) /
    //     2
    scene.add(c)
})

const onKeyDown = function (event: KeyboardEvent) {
    switch (event.code) {
        case "KeyW":
            controls.moveForward(.25)
            break
        case "KeyA":
            controls.moveRight(-.25)
            break
        case "KeyS":
            controls.moveForward(-.25)
            break
        case "KeyD":
            controls.moveRight(.25)
            break
    }
}
document.addEventListener('keydown', onKeyDown, false)

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

// const data = {
//     color: light.color.getHex(),
//     // groundColor: light.groundColor.getHex(),
//     mapsEnabled: true,
//     shadowMapSizeWidth: 512,
//     shadowMapSizeHeight: 512,
// }

// Một hàm animate để cập nhật trạng thái của các đối tượng 3D trong mỗi khung hình (frame)
function animate() {
    requestAnimationFrame(animate)

    // helper.update()

    // torus.forEach((t) => {
    //     t.rotation.y += 0.01
    // })

    // trackball controls needs to be updated in the animation loop before it will work
    // controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}
animate()
