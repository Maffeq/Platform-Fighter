import { Game } from "./game.js"
import { Player1 } from "./player.js"
import { Stage } from "./stage.js"
import { Camera } from "./camera.js"

const canvas = document.getElementById("game")
canvas.width = 800
canvas.height = 600
const ctx = canvas.getContext("2d")

const player1 = new Player1(300, 200, "p1")

const player2 = new Player1(500, 200, "p2")
const stage = new Stage()
const camera = new Camera(canvas)

const game = new Game([player1, player2], stage, ctx, camera)
game.start()