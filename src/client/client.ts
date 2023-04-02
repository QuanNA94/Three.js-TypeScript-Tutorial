import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

/** ==============================================================
 * We don't need to download animations from other websites, we can create our own.
 * Using Blender, you can create a model 
 * and then adjust the positions, scales and rotations of its parts by creating key frames on the timeline editor.
  
 * Test your animation works by using the play options on the timeline editor in Blender, 
 * and then export your model as GLB(preferred) or GLTF with animation options selected for the export.
  
 * After exporting your model, you can drag the GLB/GLTF file from your filesystem, 
 * onto this example scene below. It will read the file and create a new checkbox for every animation clip that it finds. 
 * You can enable/disable each animation independently.

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
// camera.position.z = 2

// camera.position.set(0.8, 1.4, 1.0)
camera.position.set(4, 4, 4)

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
controls.enableDamping = true
// controls.target.set(0, 1, 0)

let mixer: THREE.AnimationMixer
let modelReady = false

// const animationActions: THREE.AnimationAction[] = []
// let activeAction: THREE.AnimationAction
// let lastAction: THREE.AnimationAction

// Note that since Three release 148, you will find the Draco libraries in the `.\node_modules\three\examples\jsm\libs\draco\` folder.

const gltfLoader = new GLTFLoader()

const dropzone = document.getElementById('dropzone') as HTMLDivElement

dropzone.ondragover = dropzone.ondragenter = function (evt) {
    evt.preventDefault()
}

dropzone.ondrop = function (evt: DragEvent) {
    evt.stopPropagation()
    evt.preventDefault()

    //clear the scene
    for (let i = scene.children.length - 1; i >= 0; i--) {
        scene.remove(scene.children[i])
    }
    //clear the checkboxes
    const myNode = document.getElementById('animationsPanel') as HTMLDivElement
    while (myNode.firstChild) {
        myNode.removeChild(myNode.lastChild as any)
    }

    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    const light1 = new THREE.DirectionalLight(new THREE.Color(0xffcccc))
    light1.position.set(-1, 1, 1)
    scene.add(light1)

    const light2 = new THREE.DirectionalLight(new THREE.Color(0xccffcc))
    light2.position.set(1, 1, 1)
    scene.add(light2)

    const light3 = new THREE.DirectionalLight(new THREE.Color(0xccccff))
    light3.position.set(0, -1, 0)
    scene.add(light3)

    const files = (evt.dataTransfer as DataTransfer).files
    const reader = new FileReader()
    reader.onload = function () {
        gltfLoader.parse(
            reader.result as string,
            '/',
            (gltf: GLTF) => {
                console.log(gltf.scene)

                mixer = new THREE.AnimationMixer(gltf.scene)

                console.log(gltf.animations)

                if (gltf.animations.length > 0) {
                    const animationsPanel = document.getElementById(
                        'animationsPanel'
                    ) as HTMLDivElement
                    const ul = document.createElement('UL') as HTMLUListElement
                    const ulElem = animationsPanel.appendChild(ul)

                    gltf.animations.forEach((a: THREE.AnimationClip, i) => {
                        const li = document.createElement('UL') as HTMLLIElement
                        const liElem = ulElem.appendChild(li)

                        const checkBox = document.createElement('INPUT') as HTMLInputElement
                        checkBox.id = 'checkbox_' + i
                        checkBox.type = 'checkbox'
                        checkBox.addEventListener('change', (e: Event) => {
                            if ((e.target as HTMLInputElement).checked) {
                                mixer.clipAction((gltf as any).animations[i]).play()
                            } else {
                                mixer.clipAction((gltf as any).animations[i]).stop()
                            }
                        })
                        liElem.appendChild(checkBox)

                        const label = document.createElement('LABEL') as HTMLLabelElement
                        label.htmlFor = 'checkbox_' + i
                        label.innerHTML = a.name
                        liElem.appendChild(label)
                    })

                    if (gltf.animations.length > 1) {
                        const btnPlayAll = document.getElementById(
                            'btnPlayAll'
                        ) as HTMLButtonElement
                        btnPlayAll.addEventListener('click', (e: Event) => {
                            mixer.stopAllAction()
                            gltf.animations.forEach((a: THREE.AnimationClip) => {
                                mixer.clipAction(a).play()
                            })
                        })

                        btnPlayAll.style.display = 'block'
                    }
                } else {
                    const animationsPanel = document.getElementById(
                        'animationsPanel'
                    ) as HTMLDivElement
                    animationsPanel.innerHTML = 'No animations found in model'
                }

                scene.add(gltf.scene)

                const bbox = new THREE.Box3().setFromObject(gltf.scene)
                controls.target.x = (bbox.min.x + bbox.max.x) / 2
                controls.target.y = (bbox.min.y + bbox.max.y) / 2
                controls.target.z = (bbox.min.z + bbox.max.z) / 2

                modelReady = true
            },
            (error) => {
                console.log(error)
            }
        )
    }
    reader.readAsArrayBuffer(files[0])
}

// gltfLoader.load(
//     // 1. the file to download
//     'models/vanguard.glb',
//     // 2. what to do on success
//     (gltf) => {
//         /* if export file .glb we didn't scale it as below
//              gltf.scene.scale.set(.01, .01, .01)
//         */

//         mixer = new THREE.AnimationMixer(gltf.scene)

//         const animationAction = mixer.clipAction((gltf as any).animations[0])
//         animationActions.push(animationAction)
//         animationsFolder.add(animations, 'default')
//         activeAction = animationActions[0]

//         scene.add(gltf.scene)
//         //add an animation from another file
//         gltfLoader.load(
//             'models/vanguard@samba.glb',
//             (gltf) => {
//                 console.log('loaded samba')
//                 const animationAction = mixer.clipAction((gltf as any).animations[0])
//                 animationActions.push(animationAction)
//                 animationsFolder.add(animations, 'samba')

//                 //add an animation from another file
//                 gltfLoader.load(
//                     'models/vanguard@bellydance.glb',
//                     (gltf) => {
//                         console.log('loaded bellydance')
//                         const animationAction = mixer.clipAction((gltf as any).animations[0])
//                         animationActions.push(animationAction)
//                         animationsFolder.add(animations, 'bellydance')

//                         //add an animation from another file
//                         gltfLoader.load(
//                             'models/vanguard@goofyrunning.glb',
//                             (gltf) => {
//                                 console.log('loaded goofyrunning')
//                                 ;(gltf as any).animations[0].tracks.shift() //delete the specific track that moves the object forward while running
//                                 const animationAction = mixer.clipAction(
//                                     (gltf as any).animations[0]
//                                 )
//                                 animationActions.push(animationAction)
//                                 animationsFolder.add(animations, 'goofyrunning')

//                                 modelReady = true
//                             },
//                             (xhr) => {
//                                 console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//                             },
//                             (error) => {
//                                 console.log(error)
//                             }
//                         )
//                     },
//                     (xhr) => {
//                         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//                     },
//                     (error) => {
//                         console.log(error)
//                     }
//                 )
//             },
//             (xhr) => {
//                 console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//             },
//             (error) => {
//                 console.log(error)
//             }
//         )
//     },
//     // progress callback
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//     },
//     // error callback
//     (error) => {
//         console.log(error)
//     }
// )
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

const clock = new THREE.Clock()

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

    controls.update()

    // helper.update()

    // torus.forEach((t) => {
    //     t.rotation.y += 0.01
    // })

    // trackball controls needs to be updated in the animation loop before it will work
    // controls.update()

    if (modelReady) mixer.update(clock.getDelta())

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}
animate()
