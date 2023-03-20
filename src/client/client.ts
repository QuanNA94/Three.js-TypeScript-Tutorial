import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

/** [1] Scene (Cảnh): là một đối tượng Three.js chứa tất cả các đối tượng,
 * ánh sáng và hiệu ứng cần được vẽ trên màn hình.
 */
// tạo một đối tượng scene mới,sau đó thêm đối tượng AxesHelper vào scene
const scene1 = new THREE.Scene()
const scene2 = new THREE.Scene()

/**  AxesHelper là một class của Three.js: tạo 1 trục tọa độ 3D
 *  với các đường dẫn khác màu sắc, ở đây trục có độ dài 5 đơn vị
 */

const axesHelper1 = new THREE.AxesHelper(5)
scene1.add(axesHelper1)
const axesHelper2 = new THREE.AxesHelper(5)
scene2.add(axesHelper2)
/** [7] Light (Ánh sáng): Được sử dụng để tạo ra ánh sáng trong cảnh, giúp các đối tượng 3D có thể được hiển thị rõ ràng hơn.
 *  Three.js hỗ trợ nhiều loại ánh sáng khác nhau, bao gồm AmbientLight, DirectionalLight, và PointLight.
 */
// const light = new THREE.PointLight(0xffffff, 2)
// light.position.set(0, 5, 10)
// scene.add(light)

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
new OrbitControls(camera, renderer.domElement)

/** [4] Geometry (Hình học): là một đối tượng Three.js để đại diện cho hình dạng và kích thước của một đối tượng.
 *  Geometry có thể được sử dụng để tạo ra các hình dạng phức tạp
 * từ các hình dạng cơ bản như hình cầu, hình trụ, hình chữ nhật,...
 */

// const planeGeometry = new THREE.PlaneGeometry(3.6, 1.8)
const planeGeometry1 = new THREE.PlaneGeometry()
const planeGeometry2 = new THREE.PlaneGeometry()

// =================================================================================

// const texture1 = new THREE.TextureLoader().load('img/grid.png')
// const texture2 = texture1.clone()

const mipmap = (size: number, color: string) => {
    const imageCanvas = document.createElement('canvas') as HTMLCanvasElement
    const context = imageCanvas.getContext('2d') as CanvasRenderingContext2D

    imageCanvas.width = size
    imageCanvas.height = size
    context.fillStyle = '#888888'
    context.fillRect(0, 0, size, size)
    context.fillStyle = color
    context.fillRect(0, 0, size / 2, size / 2)
    context.fillRect(size / 2, size / 2, size / 2, size / 2)
    return imageCanvas
}

const blankCanvas = document.createElement('canvas') as HTMLCanvasElement
blankCanvas.width = 128
blankCanvas.height = 128

const texture1 = new THREE.CanvasTexture(blankCanvas)
texture1.mipmaps[0] = mipmap(128, '#ff0000')
texture1.mipmaps[1] = mipmap(64, '#00ff00')
texture1.mipmaps[2] = mipmap(32, '#0000ff')
texture1.mipmaps[3] = mipmap(16, '#880000')
texture1.mipmaps[4] = mipmap(8, '#008800')
texture1.mipmaps[5] = mipmap(4, '#000088')
texture1.mipmaps[6] = mipmap(2, '#008888')
texture1.mipmaps[7] = mipmap(1, '#880088')
texture1.repeat.set(5, 5)
texture1.wrapS = THREE.RepeatWrapping
texture1.wrapT = THREE.RepeatWrapping

const texture2 = texture1.clone()
texture2.minFilter = THREE.NearestFilter
texture2.magFilter = THREE.NearestFilter

/** [5] Material (Vật liệu): là một đối tượng Three.js để đại diện cho màu sắc, độ bóng và ánh sáng của một đối tượng.
 *  Vật liệu có thể được áp dụng cho hình học để tạo ra các hiệu ứng khác nhau,
 *  chẳng hạn như phản chiếu, ánh sáng, bóng tối,...
 */

const material1: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ map: texture1 })
const material2: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ map: texture2 })

const plane1 = new THREE.Mesh(planeGeometry1, material1)
const plane2 = new THREE.Mesh(planeGeometry2, material2)

scene1.add(plane1)
scene2.add(plane2)

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

const options = {
    minFilters: {
        NearestFilter: THREE.NearestFilter,
        NearestMipMapLinearFilter: THREE.NearestMipMapLinearFilter,
        NearestMipMapNearestFilter: THREE.NearestMipMapNearestFilter,
        'LinearFilter ': THREE.LinearFilter,
        'LinearMipMapLinearFilter (Default)': THREE.LinearMipMapLinearFilter,
        LinearMipmapNearestFilter: THREE.LinearMipmapNearestFilter,
    },
    magFilters: {
        NearestFilter: THREE.NearestFilter,
        'LinearFilter (Default)': THREE.LinearFilter,
    },
}

const gui = new GUI()
const textureFolder = gui.addFolder('THREE.Texture')
textureFolder.add(texture2, 'minFilter', options.minFilters).onChange(() => updateMinFilter())
textureFolder.add(texture2, 'magFilter', options.magFilters).onChange(() => updateMagFilter())
textureFolder.open()

function updateMinFilter() {
    texture2.minFilter = Number(texture2.minFilter)
    texture2.needsUpdate = true
}
function updateMagFilter() {
    texture2.magFilter = Number(texture2.magFilter)
    texture2.needsUpdate = true
}

const stats = Stats()
document.body.appendChild(stats.dom)

// Một hàm animate để cập nhật trạng thái của các đối tượng 3D trong mỗi khung hình (frame)
function animate() {
    requestAnimationFrame(animate)
    // controls.update()
    // torusKnot.rotation.x += 0.01
    // torusKnot.rotation.y += 0.01

    render()

    stats.update()
}

function render() {
    renderer.setScissorTest(true)

    renderer.setScissor(0, 0, window.innerWidth / 2 - 2, window.innerHeight)
    renderer.render(scene1, camera)

    renderer.setScissor(window.innerWidth / 2, 0, window.innerWidth / 2 - 2, window.innerHeight)
    renderer.render(scene2, camera)

    renderer.setScissorTest(false)
}
animate()
