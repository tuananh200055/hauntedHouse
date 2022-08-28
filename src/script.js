import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const fog = new THREE.Fog('#262837',1,15)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorTexture = textureLoader.load('/textures/door/color.jpg')
const alpha = textureLoader.load('/textures/door/alpha.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normal = textureLoader.load('/textures/door/normal.jpg')
const metaTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbient = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormal = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughness = textureLoader.load('/textures/bricks/roughness.jpg')

const grassTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbient = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormal = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughness = textureLoader.load('/textures/grass/roughness.jpg')

grassTexture.repeat.set(8,8)
grassAmbient.repeat.set(8,8)
grassNormal.repeat.set(8,8)
grassRoughness.repeat.set(8,8)

grassTexture.wrapS = THREE.RepeatWrapping
grassAmbient.wrapS = THREE.RepeatWrapping
grassNormal.wrapS = THREE.RepeatWrapping
grassRoughness.wrapS = THREE.RepeatWrapping

grassTexture.wrapT = THREE.RepeatWrapping
grassAmbient.wrapT = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping
/**
 * House
 */

const house = new THREE.Group()
scene.add(house)

const walls = new THREE.Mesh(
    new  THREE.BoxBufferGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map: bricksTexture,
        aoMap: bricksAmbient,
        normalMap: bricksNormal,
        roughnessMap: bricksRoughness
    })
)
walls.position.y = 2.5/2
walls.geometry.setAttribute('uv2', 
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
)

house.add(walls)
const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.5,1,4),
    new THREE.MeshStandardMaterial({color:'#b35f45'})
)
roof.position.y = 2.5+ 1/2
roof.rotation.y = Math.PI/4


house.add(roof)

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2,2,10,10),
    new THREE.MeshStandardMaterial({
        map: doorTexture,
        transparent: true,
        alphaMap:alpha,
        aoMap:ambientOcclusionTexture,
        displacementMap:heightTexture,
        displacementScale:0.1,
        normalMap: normal,
        metalnessMap:metaTexture,
        roughnessMap: roughnessTexture
    })
)
door.geometry.setAttribute('uv2', 
    new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
)
door.position.z = 2+0.01
door.position.y= 1
house.add(door)


// bushes : bui cay

const bushGeometry = new THREE.SphereGeometry(1,16,16)
const bushMaterial = new THREE.MeshStandardMaterial({color:'#89c854'})

const bush = new THREE.Mesh(bushGeometry,bushMaterial)
bush.scale.set(0.5,0.5,0.5)
bush.position.set(0.8,0.2,2.2)
const bush1 = new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(0.25,0.25,0.25)
bush1.position.set(1.4,0.1,2.1)
const bush2 = new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.4,0.4,0.4)
bush2.position.set(-0.8,0.1,2.1)
house.add(bush,bush1,bush2)


const graves = new THREE.Group()
scene.add(graves)

const gravesGeometry = new THREE.BoxBufferGeometry(0.6,0.8,0.2)
const gravesMaterial = new THREE.MeshStandardMaterial({color:'#b2b6b1'})

for(let i = 0; i <50; i++){
    const angle  = Math.random() * Math.PI*2
    const radius = 3 + Math.random() *6
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius

    const grave = new THREE.Mesh(gravesGeometry, gravesMaterial)
    grave.position.set(x,0.4,z)
    grave.rotation.y =(Math.random() - 0.5)*0.4
    grave.rotation.z =(Math.random() - 0.5)*0.4
    grave.castShadow = true
    graves.add(grave)
}
// Temporary sphere
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial({ roughness: 0.7 })
// )
// sphere.position.y = 1
// scene.add(sphere)

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({ 
        map: grassTexture,
        aoMap: grassAmbient,
        normalMap: grassNormal,
        roughnessMap: grassRoughness
    })
)

floor.geometry.setAttribute('uv2', 
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)


// door lights

const doorLight =new THREE.PointLight('#ff7d46', 1,7)
doorLight.position.set(0,2.2,2.7)
house.add(doorLight)


const ghost1 = new THREE.PointLight('#ff00ff', 2,3)
scene.add(ghost1)
const ghost2 = new THREE.PointLight('#00ffff', 2,3)
scene.add(ghost2)
const ghost3 = new THREE.PointLight('#ffff00', 2,3)
scene.add(ghost3)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')


renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

moonLight.castShadow = true
doorLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

walls.castShadow = true
bush2.castShadow = true
bush1.castShadow = true
bush.castShadow = true

floor.receiveShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256
doorLight.shadow.mapSize.far = 7

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.mapSize.far = 7

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.mapSize.far = 7

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.mapSize.far = 7
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime*0.5
    ghost1.position.x = Math.cos(ghost1Angle)*4
    ghost1.position.z = Math.sin(ghost1Angle)*4
    ghost1.position.y = Math.sin(ghost1Angle)*3

    const ghost2Angle = -elapsedTime*0.32
    ghost2.position.x = Math.cos(ghost2Angle)*5
    ghost2.position.z = Math.sin(ghost2Angle)*5
    ghost2.position.y = Math.sin(ghost2Angle)*3

    const ghost3Angle = -elapsedTime*0.18
    ghost3.position.x = Math.cos(ghost3Angle)* (7+Math.sin(elapsedTime *0.32))
    ghost3.position.z = Math.sin(ghost3Angle)* (7+Math.sin(elapsedTime *0.5))
    ghost3.position.y = Math.sin(ghost3Angle)* (5+Math.sin(elapsedTime *0.25))
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()