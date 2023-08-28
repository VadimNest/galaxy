import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 360 })

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//galaxy
const parametrs = {}
parametrs.count = 100000
parametrs.size = 0.01
parametrs.radius = 5
parametrs.branches = 5
parametrs.spin = 0.7
parametrs.randomness = 0.2
parametrs.randomnessPower = 3
parametrs.insideColor = '#ff6030'
parametrs.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {

    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    //geometry
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(parametrs.count * 3)
    const colors = new Float32Array(parametrs.count * 3)

    const colorInside = new THREE.Color(parametrs.insideColor)
    const colorOutside = new THREE.Color(parametrs.outsideColor)

    for (let i = 0; i < parametrs.count; i++) {
        const i3 = i * 3

        //position
        const radius = Math.random() * parametrs.radius
        const spinAngle = radius * parametrs.spin
        const branchAngle = (i % parametrs.branches) / parametrs.branches * Math.PI * 2

        const randomX = Math.pow(Math.random(), parametrs.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomY = Math.pow(Math.random(), parametrs.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)
        const randomZ = Math.pow(Math.random(), parametrs.randomnessPower) * (Math.random() < 0.5 ? 1 : -1)

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ


        //color
        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / parametrs.radius)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    )

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colors, 3)
    )

    //material

    material = new THREE.PointsMaterial({
        size: parametrs.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
    })


    //points
    points = new THREE.Points(geometry, material)
    scene.add(points)


}
generateGalaxy()


gui.add(parametrs, 'count').min(100).max(500000).step(100).onFinishChange(generateGalaxy)
gui.add(parametrs, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(parametrs, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parametrs, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parametrs, 'spin').min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(parametrs, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parametrs, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parametrs, 'insideColor').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parametrs, 'outsideColor').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
