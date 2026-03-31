import { Input } from "./input.js"
export class Collision {

    static AABB(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        )
    }

    static resolvePlatform(player, platform) {

        if (!Collision.AABB(player, platform)) return null
    
        const wasAbove = player.prevY + player.height <= platform.y
        const wasBelow = player.prevY >= platform.y + platform.height
        const isFalling = (player.vy + player.kbY) >= 0
        const isRising = (player.vy + player.kbY) < 0
    
        const controls = player.controls
        const isDropping = Input[controls.down] && Input[controls.attack]
    
        if (platform.type === "solid") {
    
            if (wasAbove && isFalling) {
                player.y = platform.y - player.height
                player.vy = 0
                player.kbY = 0
                return "top"
            }
    
            if (wasBelow && isRising) {
                player.y = platform.y + platform.height
                player.vy = 0
                player.kbY = 0
                return "bottom"
            }
    
            const wasLeft = player.prevX + player.width <= platform.x
            const wasRight = player.prevX >= platform.x + platform.width


            if (wasLeft) {
                player.x = platform.x - player.width
                player.vx = 0
                player.kbX = 0
                return "side"
}


            if (wasRight) {
                player.x = platform.x + platform.width
                player.vx = 0
                player.kbX = 0
                return "side"
}
        }

        if (platform.type === "platform") {
    
            if (isDropping) return null
    
            if (wasAbove && isFalling) {
                player.y = platform.y - player.height
                player.vy = 0
                player.kbY = 0
                return "top"
            }
        }
    
        return null
    }

}