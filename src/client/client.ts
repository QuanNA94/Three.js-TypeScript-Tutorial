import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'

/** ==============================================================
 * Using the Raycaster to assist in measuring the distance between points.
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
const light = new THREE.SpotLight()
light.position.set(12.5, 12.5, 12.5)
light.castShadow = true
light.shadow.mapSize.width = 1024
light.shadow.mapSize.height = 1024
scene.add(light)

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

camera.position.set(15, 15, 15)

/** [3]Renderer (Trình kết xuất): là một đối tượng Three.js để kết xuất các đối tượng trên màn hình.
 *  Trình kết xuất sẽ sử dụng WebGL hoặc các công nghệ tương tự để tạo ra các hình ảnh 3D.
 */
const renderer = new THREE.WebGLRenderer()
//renderer.physicallyCorrectLights = true //deprecated
// renderer.useLegacyLights = false //use this instead of setting physicallyCorrectLights=true property
renderer.shadowMap.enabled = true
renderer.outputEncoding = THREE.sRGBEncoding
renderer.setSize(window.innerWidth, window.innerHeight)

/** Thêm đối tượng renderer vào thẻ HTML sử dụng hàm appendChild(renderer.domElement).
 *  Trong trường hợp này, renderer.domElement là một đối tượng HTMLCanvasElement,
 *  và nó sẽ được thêm vào thẻ body để hiển thị kết quả cuối cùng của các hoạt động đồ họa.
 */
document.body.appendChild(renderer.domElement)
//const material: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000, transparent: true })
//const cube: THREE.Mesh = new THREE.Mesh(geometry, material)
//scene.add(cube)

const labelRenderer = new CSS2DRenderer()
labelRenderer.setSize(window.innerWidth, window.innerHeight)
labelRenderer.domElement.style.position = 'absolute'
labelRenderer.domElement.style.top = '0px'
labelRenderer.domElement.style.pointerEvents = 'none'
document.body.appendChild(labelRenderer.domElement)

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

const pickableObjects: THREE.Mesh[] = []

// let intersectedObject: THREE.Object3D | null
// const originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } = {}
// const highlightedMaterial = new THREE.MeshBasicMaterial({
//     wireframe: true,
//     color: 0x00ff00,
// })

const loader = new GLTFLoader()
loader.load(
    'models/simplescene.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh
                //the sphere and plane will not be mouse picked. THe plane will receive shadows while everything else casts shadows.
                switch (m.name) {
                    case 'Plane':
                        m.receiveShadow = true
                        break

                    default:
                        m.castShadow = true
                }
                pickableObjects.push(m)
            }
        })
        scene.add(gltf.scene)
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

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
let ctrlDown = false
let lineId = 0
let line: THREE.Line
let drawingLine = false
const measurementLabels: { [key: number]: CSS2DObject } = {}

window.addEventListener('keydown', function (event) {
    if (event.key === 'Control') {
        ctrlDown = true
        controls.enabled = false
        renderer.domElement.style.cursor = 'crosshair'
    }
})

window.addEventListener('keyup', function (event) {
    if (event.key === 'Control') {
        ctrlDown = false
        controls.enabled = true
        renderer.domElement.style.cursor = 'pointer'
        if (drawingLine) {
            //delete the last line because it wasn't committed
            scene.remove(line)
            scene.remove(measurementLabels[lineId])
            drawingLine = false
        }
    }
})

const raycaster = new THREE.Raycaster()
let intersects: THREE.Intersection[]
const mouse = new THREE.Vector2()

renderer.domElement.addEventListener('pointerdown', onClick, false)
function onClick() {
    if (ctrlDown) {
        raycaster.setFromCamera(mouse, camera)
        intersects = raycaster.intersectObjects(pickableObjects, false)
        if (intersects.length > 0) {
            if (!drawingLine) {
                //start the line
                const points = []
                points.push(intersects[0].point)
                points.push(intersects[0].point.clone())
                const geometry = new THREE.BufferGeometry().setFromPoints(points)
                line = new THREE.LineSegments(
                    geometry,
                    new THREE.LineBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.75,
                        // depthTest: false,
                        // depthWrite: false
                    })
                )
                line.frustumCulled = false
                scene.add(line)

                const measurementDiv = document.createElement('div') as HTMLDivElement
                measurementDiv.className = 'measurementLabel'
                measurementDiv.innerText = '0.0m'
                const measurementLabel = new CSS2DObject(measurementDiv)
                measurementLabel.position.copy(intersects[0].point)
                measurementLabels[lineId] = measurementLabel
                scene.add(measurementLabels[lineId])
                drawingLine = true
            } else {
                //finish the line
                const positions = (line.geometry.attributes.position as THREE.BufferAttribute)
                    .array as Array<number>
                positions[3] = intersects[0].point.x
                positions[4] = intersects[0].point.y
                positions[5] = intersects[0].point.z
                line.geometry.attributes.position.needsUpdate = true
                lineId++
                drawingLine = false
            }
        }
    }
}

document.addEventListener('mousemove', onDocumentMouseMove, false)
function onDocumentMouseMove(event: MouseEvent) {
    event.preventDefault()

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

    if (drawingLine) {
        raycaster.setFromCamera(mouse, camera)
        intersects = raycaster.intersectObjects(pickableObjects, false)
        if (intersects.length > 0) {
            const positions = (line.geometry.attributes.position as THREE.BufferAttribute)
                .array as Array<number>
            const v0 = new THREE.Vector3(positions[0], positions[1], positions[2])
            const v1 = new THREE.Vector3(
                intersects[0].point.x,
                intersects[0].point.y,
                intersects[0].point.z
            )
            positions[3] = intersects[0].point.x
            positions[4] = intersects[0].point.y
            positions[5] = intersects[0].point.z
            line.geometry.attributes.position.needsUpdate = true
            const distance = v0.distanceTo(v1)
            measurementLabels[lineId].element.innerText = distance.toFixed(2) + 'm'
            measurementLabels[lineId].position.lerpVectors(v0, v1, 0.5)
        }
    }
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
    labelRenderer.render(scene, camera)
    renderer.render(scene, camera)
}
animate()
