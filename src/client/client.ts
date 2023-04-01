import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'

const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(2.5, 7.5, 15)
scene.add(light)

// const ambientLight = new THREE.AmbientLight()
// scene.add(ambientLight)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(0.8, 1.4, 1.0)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.target.set(0, 1, 0)

//const material = new THREE.MeshNormalMaterial()

let mixer: THREE.AnimationMixer
let modelReady = false
const animationActions: THREE.AnimationAction[] = []
let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction

const fbxLoader: FBXLoader = new FBXLoader()
fbxLoader.load(
    'models/vanguard_t_choonyung.fbx',
    (object) => {
        // 1. scale kích thước đối tượng
        object.scale.set(0.01, 0.01, 0.01)
        mixer = new THREE.AnimationMixer(object)

        /* 2. đoạn code lấy ra hành động animation đầu tiên của đối tượng 
         và đưa vào trong một mảng animationActions. */
        const animationAction = mixer.clipAction((object as any).animations[0])
        // 3. đưa animationAction vào mảng animationActions đã khai báo ở trên
        animationActions.push(animationAction)
        animationsFolder.add(animations, 'default')
        activeAction = animationActions[0]

        scene.add(object)

        // add an animation from another file
        fbxLoader.load(
            'models/vanguard@samba.fbx',
            (object) => {
                console.log('loaded samba')

                const animationAction = mixer.clipAction((object as THREE.Object3D).animations[0])
                animationActions.push(animationAction)
                animationsFolder.add(animations, 'samba')

                // add an animation from another file
                fbxLoader.load(
                    'models/vanguard@bellydance.fbx',
                    (object) => {
                        console.log('loaded bellydance')
                        const animationAction = mixer.clipAction(
                            (object as THREE.Object3D).animations[0]
                        )
                        animationActions.push(animationAction)
                        animationsFolder.add(animations, 'bellydance')

                        // add an animation from another file
                        fbxLoader.load(
                            'models/vanguard@goofyrunning.fbx',
                            (object) => {
                                console.log('loaded goofyrunning')
                                ;(object as THREE.Object3D).animations[0].tracks.shift() //delete the specific track that moves the object forward while running
                                // console.dir((object as THREE.Object3D).animations[0])
                                const animationAction = mixer.clipAction(
                                    (object as THREE.Object3D).animations[0]
                                )
                                animationActions.push(animationAction)
                                animationsFolder.add(animations, 'goofyrunning')

                                modelReady = true
                            },
                            (xhr) => {
                                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                            },
                            (error) => {
                                console.log(error)
                            }
                        )
                    },
                    (xhr) => {
                        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                    },
                    (error) => {
                        console.log(error)
                    }
                )
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
            (error) => {
                console.log(error)
            }
        )
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
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const stats = Stats()
document.body.appendChild(stats.dom)

const animations = {
    default: function () {
        setAction(animationActions[0])
    },
    samba: function () {
        setAction(animationActions[1])
    },
    bellydance: function () {
        setAction(animationActions[2])
    },
    goofyrunning: function () {
        setAction(animationActions[3])
    },
}

const setAction = (toAction: THREE.AnimationAction) => {
    if (toAction != activeAction) {
        lastAction = activeAction
        activeAction = toAction
        // lastAction.stop()
        lastAction.fadeOut(1)
        activeAction.reset()
        activeAction.fadeIn(1)
        activeAction.play()
    }
}

/** GUI này cho phép người dùng tương tác với các biến
 * và giá trị trong chương trình thông qua các control được hiển thị trên giao diện.
 *
 */
const gui = new GUI()
const animationsFolder = gui.addFolder('Animations')
// đoạn code mở folder đó ra để người dùng có thể nhìn thấy các control bên trong
animationsFolder.open()

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    if (modelReady) mixer.update(clock.getDelta())

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

animate()
