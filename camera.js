export class Camera {
    constructor(canvas) {
        this.canvas = canvas

        this.x = 0
        this.y = 0
        this.zoom = 1

        this.minZoom = 0.6
        this.maxZoom = 1.4
    }

    update(players) {

        // center between players
        const midX = (players[0].x + players[1].x) / 2
        const midY = (players[0].y + players[1].y) / 2

        // distance between players
        const dx = players[0].x - players[1].x
        const dy = players[0].y - players[1].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // zoom based on distance
        const targetZoom = 1.2 - distance / 1400

        this.zoom += (targetZoom - this.zoom) * 0.1

        // camera position
        this.x += (midX - this.x) * 0.1 
        this.y += (midY - this.y) * 0.1
    }

    apply(ctx) {

        ctx.setTransform(
            this.zoom,
            0,
            0,
            this.zoom,
            this.canvas.width / 2 - this.x * this.zoom,
            this.canvas.height / 2 - this.y * this.zoom
        )

    }

    reset(ctx) {
        ctx.setTransform(1,0,0,1,0,0)
    }
}