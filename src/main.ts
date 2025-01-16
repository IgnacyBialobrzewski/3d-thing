import "./style.css"
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Mesh,
    BoxGeometry,
    DirectionalLight,
    MeshPhongMaterial,
    Vector3,
} from "three"

const boxScaleEl = document.querySelector<HTMLInputElement>("#scale")!
const boxSpinEl = document.querySelector<HTMLInputElement>("#spin")!
const boxSpeedEl = document.querySelector<HTMLInputElement>("#speed")!
const boxColorEl = document.querySelector<HTMLInputElement>("#color")!
const boxResetEl = document.querySelector<HTMLButtonElement>("#reset")!
const boxWidthEl = document.querySelector<HTMLInputElement>("#width")!
const boxHeightEl = document.querySelector<HTMLInputElement>("#height")!
const boxDepthEl = document.querySelector<HTMLInputElement>("#depth")!

const scene = new Scene()
const camera = new PerspectiveCamera(50, window.innerWidth / window.innerHeight)
const renderer = new WebGLRenderer()

document.getElementById("app")!.append(renderer.domElement)

function makeBox(width: number, height: number, depth: number) {
    const geometry = new BoxGeometry(width, height, depth)
    const material = new MeshPhongMaterial({ color: 0x22adfb })
    const mesh = new Mesh(geometry, material)

    return mesh
}

let myBox = makeBox(boxWidthEl.valueAsNumber, 1, 1)
const light = new DirectionalLight(0xffffff, 3)

light.position.set(-1, 2, 4)
light.lookAt(myBox.position)

scene.add(light)
scene.add(myBox)

camera.lookAt(myBox.position)

let mouseX = 0
let mouseY = 0
let mouseDtX = 0
let mouseDtY = 0
let scrollDtY = 0
let isMouseDown = false
let boxColor = 0x22adfb

let theta = 0

function onRender() {
    if (boxSpinEl.checked) {
        myBox.rotation.set(theta, theta, 0)
        theta += 0.01 * boxSpeedEl.valueAsNumber
    }

    myBox.material.setValues({ color: boxColor })

    myBox.scale.lerp(
        new Vector3(
            boxScaleEl.valueAsNumber * boxWidthEl.valueAsNumber,
            boxScaleEl.valueAsNumber * boxHeightEl.valueAsNumber,
            boxScaleEl.valueAsNumber * boxDepthEl.valueAsNumber,
        ),
        0.1,
    )

    if (isMouseDown && !boxSpinEl.checked) {
        myBox.rotateY(-(mouseDtX / window.innerWidth) * 2)
        myBox.rotateX(-(mouseDtY / window.innerHeight) * 2)
    }

    const scaleZ = Math.min(Math.max(5, camera.position.z + scrollDtY / 10), 20)

    camera.position.lerp(
        new Vector3(camera.position.x, camera.position.y, scaleZ),
        0.1,
    )

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
}

function updateMousePosition(ev: MouseEvent) {
    mouseDtX = mouseX - ev.pageX
    mouseDtY = mouseY - ev.pageY
    mouseX = ev.pageX
    mouseY = ev.pageY
}

boxResetEl.addEventListener("click", () => {
    scene.remove(myBox)
    myBox = makeBox(1, 1, 1)
    myBox.material.setValues({ color: 0x22adfb })
    scene.add(myBox)
})

boxColorEl.oninput = () =>
    (boxColor = parseInt(boxColorEl.value.replace("#", "0x")))

window.addEventListener("wheel", (ev) => (scrollDtY = ev.deltaY))
window.addEventListener("mousedown", () => (isMouseDown = true))
window.addEventListener("mouseup", () => (isMouseDown = false))
window.addEventListener("mousemove", updateMousePosition)
renderer.setAnimationLoop(onRender)
