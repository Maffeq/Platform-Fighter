import { resetPressed } from "./input.js"
import { hitboxIntersectsPlayer } from "./combat.js"
import { applyKnockback } from "./physics.js"
export class Game {
    constructor(players, stage, ctx, camera,) {
        this.players = players
        this.stage = stage
        this.ctx = ctx
        this.camera = camera

        this.lastTime = 0
        this.accumulator = 0
        this.fixedDelta = 1000 / 60
    }

    start() {
        requestAnimationFrame(this.loop.bind(this))
    }

    loop(timestamp) {
        const delta = timestamp - this.lastTime
        this.lastTime = timestamp
        this.accumulator += delta
    

        while (this.accumulator >= this.fixedDelta) {
            this.update()
            this.accumulator -= this.fixedDelta
        }

        this.render()
        requestAnimationFrame(this.loop.bind(this))
    }

    update() {
        for (const p of this.players) {
            p.update(this.stage)
        }
        this.handleCombat()
        this.camera.update(this.players)
    
        resetPressed()
    
    }

    render() {

        this.ctx.clearRect(0, 0, 800, 600)
    
        this.camera.apply(this.ctx)
    
        this.stage.draw(this.ctx)
    
        for (const p of this.players) {
            p.draw(this.ctx)
        }
    
        this.camera.reset(this.ctx)
        
        this.ctx.fillStyle="black"
        this.ctx.font="20px Arial"
        
        this.ctx.fillText("P1 Stocks: "+this.players[0].stocks,20,30)
        this.ctx.fillText("P2 Stocks: "+this.players[1].stocks,650,30)
        this.ctx.fillText("P1: " + this.players[0].percent + "%", 20, 55)
        this.ctx.fillText("P2: " + this.players[1].percent + "%", 650, 55)
        /* (Dette blev brugt til at teste hitstun)
        this.ctx.fillText("P1: " + this.players[0].hitstun, 20, 80)
        this.ctx.fillText("P2: " + this.players[1].hitstun, 650, 80)
        this.ctx.fillText("Combo on P1: " + this.players[0].combo + " " +this.players[0].comboCounter, 20, 105)
        this.ctx.fillText("Combo on P2: " + this.players[1].combo + " " + this.players[1].comboCounter, 580, 105)
        */
    }
    
    handleCombat(){

        for (const attacker of this.players) {
    
        for (const hitbox of attacker.hitboxes) {
    
        for (const target of this.players) {
    
        if (attacker === target) continue
    
        if (!hitbox.hasHit && hitboxIntersectsPlayer(hitbox, target)) {
    
        applyKnockback(target, hitbox, attacker)
    
        hitbox.hasHit = true
        this.players.comboCounter += 1
        attacker.moveConnected = true
    
            }
    
         }
    
    }
    
 }
 }
}