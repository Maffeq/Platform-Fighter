export class Stage {
    constructor() {
        this.platforms = [
            { x: 0, y: 400, width: 800, height: 20, type: "solid" },
            { x: 0, y: 400, width: 20, height: 1400, type: "solid" },
            { x: 800, y: 400, width: 20, height: 1400, type: "solid" },
            { x: 100, y: 250, width: 200, height: 15, type: "platform"},
            { x: 500, y: 250, width: 200, height: 15, type: "platform"},

        ]
        this.blastZone = {
            left:-600,
            right:1600,
            top:-600,
            bottom:900
        }
    }

    draw(ctx) {
        ctx.fillStyle = "#888"
        for (const p of this.platforms) {
            ctx.fillRect(p.x, p.y, p.width, p.height)
        }
    }
}