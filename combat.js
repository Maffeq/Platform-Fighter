export function hitboxIntersectsPlayer(hitbox, player) {

    return (
        hitbox.x < player.x + player.width &&
        hitbox.x + hitbox.width > player.x &&
        hitbox.y < player.y + player.height &&
        hitbox.y + hitbox.height > player.y
    )

}