import { Player1 } from "./player.js" 
export function applyKnockback(target, hitbox, attacker) {
    const direction = attacker.facing

    target.percent += hitbox.damage
    target.hitstop = 5

    const scale = 1 + target.percent / 120

    target.kbX = target.kbX * 0.5 + direction * hitbox.baseKnockbackX * scale
    target.kbY = target.kbY * 0.5 + hitbox.baseKnockbackY * scale
    target.hitstun = Math.max(target.hitstun, hitbox.hitstun || 0)
}