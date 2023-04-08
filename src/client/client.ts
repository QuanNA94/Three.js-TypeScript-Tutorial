import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import TWEEN from '@tweenjs/tween.js'
/** ==============================================================
 * Tweenjs is a JavaScript tweening engine.
 *
 * A tween (from in-between) is a concept that allows you to change the values of the properties of an object smoothly. 
 * We can decide how long it should take, and if there should be a delay, 
 * and what to do each time the tween is updated, whether it should repeat and other things.
 * 
 *  npm install @tweenjs/tween.js
 *  import TWEEN from '@tweenjs/tween.js'
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

// camera.position.set(15, 15, 15)

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
controls.enableDamping = true
// controls.addEventListener('change', render) // this line is uneccessary if you are re-render

const sceneMeshes: THREE.Mesh[] = []
let monkey: THREE.Mesh

// let intersectedObject: THREE.Object3D | null
// const originalMaterials: { [id: string]: THREE.Material | THREE.Material[] } = {}
// const highlightedMaterial = new THREE.MeshBasicMaterial({
//     wireframe: true,
//     color: 0x00ff00,
// })

const loader = new GLTFLoader()
loader.load(
    'models/monkey_textured.glb',
    function (gltf) {
        gltf.scene.traverse(function (child) {
            if ((child as THREE.Mesh).isMesh) {
                let m = child as THREE.Mesh
                m.receiveShadow = true
                m.castShadow = true
                //the sphere and plane will not be mouse picked. THe plane will receive shadows while everything else casts shadows.
                // switch (m.name) {
                //     case 'Plane':
                //         m.receiveShadow = true
                //         break

                //     default:
                //         m.castShadow = true
                // }
                // pickableObjects.push(m)

                if (child.name === 'Plane') {
                    sceneMeshes.push(m)
                } else if (child.name === 'Suzanne') {
                    monkey = m
                }
            }
            if ((child as THREE.Light).isLight) {
                const l = child as THREE.Light
                l.castShadow = true
                l.shadow.bias = -0.003
                l.shadow.mapSize.width = 2048
                l.shadow.mapSize.height = 2048
            }
        })
        scene.add(gltf.scene)
        // render()
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

const raycaster = new THREE.Raycaster()
// let intersects: THREE.Intersection[]
const mouse = new THREE.Vector2()

function onDoubleClick(event: MouseEvent) {
    mouse.set(
        (event.clientX / renderer.domElement.clientWidth) * 2 - 1,
        -(event.clientY / renderer.domElement.clientHeight) * 2 + 1
    )
    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(sceneMeshes, false)

    if (intersects.length > 0) {
        const p = intersects[0].point

        //controls.target.set(p.x, p.y, p.z)

        // new TWEEN.Tween(controls.target)
        //     .to({
        //         x: p.x,
        //         y: p.y,
        //         z: p.z
        //     }, 500)
        //     //.delay (1000)
        //     .easing(TWEEN.Easing.Cubic.Out)
        //     //.onUpdate(() => render())
        //     .start()

        new TWEEN.Tween(monkey.position)
            .to(
                {
                    x: p.x,
                    // y: p.y + 1,
                    z: p.z,
                },
                500
            )
            .start()

        new TWEEN.Tween(monkey.position)
            .to(
                {
                    // x: p.x,
                    y: p.y + 3,
                    // z: p.z,
                },
                250
            )
            //.delay (1000)
            .easing(TWEEN.Easing.Cubic.Out)
            //.onUpdate(() => render())
            .start()
            .onComplete(() => {
                new TWEEN.Tween(monkey.position)
                    .to(
                        {
                            // x: p.x,
                            y: p.y + 1,
                            // z: p.z,
                        },
                        250
                    )
                    //.delay (250)
                    .easing(TWEEN.Easing.Bounce.Out)
                    //.onUpdate(() => render())
                    .start()
            })
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

// Một hàm animate để cập nhật trạng thái của các đối tượng 3D trong mỗi khung hình (frame)
var animate = function () {
    requestAnimationFrame(animate)

    controls.update()

    TWEEN.update()
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
    // labelRenderer.render(scene, camera)
    renderer.render(scene, camera)
}
animate()
