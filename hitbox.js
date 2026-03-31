export class Hitbox {
    constructor(owner, offsetX, offsetY, width, height, duration, baseKnockbackX, baseKnockbackY, startup, hitstun, damage,) {
        this.owner = owner
        this. offsetX = offsetX
        this.offsetY = offsetY
        this.width = width
        this.height = height
        this.duration = duration
        this.baseKnockbackX = baseKnockbackX
        this.baseKnockbackY = baseKnockbackY
        this.startup = startup
        this.hitstun = hitstun
        this.damage = damage

        this.x = 0
        this.y = 0

        this.hasHit = false
        this.comboCounter = 0
       
    }

    update() {
        const dir = this.owner.lockedFacing

        this.x = dir === 1
    ? this.owner.x + this.offsetX
    : this.owner.x + this.owner.width - this.width - this.offsetX

        this.y = this.owner.y + this.offsetY

        if (this.startup > 0) {
            this.startup--
        } else {
            this.duration--
        }
    }
    
    isActive() {
        return this.startup <= 0 && this.duration > 0
    }

    draw(ctx) {
        ctx.fillStyle = "rgba(255,0,0,0.4)"
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}