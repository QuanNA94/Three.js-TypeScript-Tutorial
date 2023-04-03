import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

/** ==============================================================
 * Raycasting allows you to create a vector from a 3D point in the scene, and detect which object(s) the vector intersects.
 * The raycasting class is almost always used for mouse picking objects in the 3D scene.
 
 * We can set up the raycaster position and direction using the set or setFromCamera methods and then call its intersectObject 
   or intersectObjects methods to tell us many things about the scene objects that were intersected by the ray, including,

    the distance of the intersection from the Raycaster position,
    the position of the intersection in the 3D scene,
    the face of the object that was intersected,
    the direction of the faces normal,
    the UV coordinate of the intersection on the face
    and a reference to the intersected object itself.

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
renderer.useLegacyLights = false //use this instead of setting physicallyCorrectLights=true property
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

let mixer: THREE.AnimationMixer
let modelReady = false

// const animationActions: THREE.AnimationAction[] = []
// let activeAction: THREE.AnimationAction
// let lastAction: THREE.AnimationAction

// const material = new THREE.LineBasicMaterial({ color: 0xff0000 })
// const points = new Array()
// points.push(new THREE.Vector3(0, 0, 0))
// points.push(new THREE.Vector3(0, 0, 0.25))
// const geometry = new THREE.BufferGeometry().setFromPoints(points)
// const line = new THREE.Line(geometry, material)
// scene.add(line)

const arrowHelper = new THREE.ArrowHelper(new THREE.Vector3(), new THREE.Vector3(), 0.25, 0xffff00)
scene.add(arrowHelper)

const material = new THREE.MeshNormalMaterial()

// const boxGeometry = new THREE.BoxGeometry(.2, .2, .2)
const coneGeometry = new THREE.ConeGeometry(0.05, 0.2, 8)

const raycaster = new THREE.Raycaster()
const sceneMeshes: THREE.Object3D[] = []

const loader = new GLTFLoader()

loader.load(
    // 1. the file to download
    'models/monkey_textured.glb',
    // 2. what to do on success
    function (gltf) {
        /* if export file .glb we didn't scale it as below
             gltf.scene.scale.set(.01, .01, .01)
        */

        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                const m = child as THREE.Mesh
                m.receiveShadow = true
                m.castShadow = true
                ;(m.material as THREE.MeshStandardMaterial).flatShading = true

                // if(m.userData.name != "Plane")
                sceneMeshes.push(m) // using when change intersects ( , false)
            }
            if ((child as THREE.Light).isLight) {
                const l = child as THREE.Light
                l.castShadow = true
                l.shadow.bias = -0.03
                l.shadow.mapSize.width = 2048
                l.shadow.mapSize.height = 2048
            }
        })

        scene.add(gltf.scene)
        // sceneMeshes.push(gltf.scene) // using when change intersects ( , true)

        // //add an animation from another file
        // gltfLoader.load(
        //     'models/vanguard@samba.glb',
        //     (gltf) => {
        //         console.log('loaded samba')
        //         const animationAction = mixer.clipAction((gltf as any).animations[0])
        //         animationActions.push(animationAction)
        //         animationsFolder.add(animations, 'samba')
    },
    // progress callback
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    // error callback
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

renderer.domElement.addEventListener('dblclick', onDoubleClick, false)
renderer.domElement.addEventListener('mousemove', onMouseMove, false)

function onMouseMove(event: MouseEvent) {
    const mouse = {
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    }

    // console.log(mouse)

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(sceneMeshes, false)

    if (intersects.length > 0) {
        // console.log(sceneMeshes.length + ' ' + intersects.length)
        // console.log(intersects[0])
        // console.log(intersects[0].object.userData.name + ' ' + intersects[0].distance + ' ')
        // console.log((intersects[0].face as THREE.Face).normal)
        // line.position.set(0, 0, 0)
        // line.lookAt((intersects[0].face as THREE.Face).normal)
        // line.position.copy(intersects[0].point)
        const n = new THREE.Vector3()
        n.copy((intersects[0].face as THREE.Face).normal)
        n.transformDirection(intersects[0].object.matrixWorld)
        arrowHelper.setDirection(n)
        arrowHelper.position.copy(intersects[0].point)
    }
}

function onDoubleClick(event: MouseEvent) {
    const mouse = {
        x: (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        y: -(event.clientY / renderer.domElement.clientHeight) * 2 + 1,
    }
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(sceneMeshes, false)

    if (intersects.length > 0) {
        const n = new THREE.Vector3()
        n.copy((intersects[0].face as THREE.Face).normal)
        n.transformDirection(intersects[0].object.matrixWorld)

        // const cube = new THREE.Mesh(boxGeometry, material)
        const cube = new THREE.Mesh(coneGeometry, material)

        cube.lookAt(n)
        cube.rotateX(Math.PI / 2)
        cube.position.copy(intersects[0].point)
        cube.position.addScaledVector(n, 0.1)

        scene.add(cube)
        sceneMeshes.push(cube)
    }
}

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
