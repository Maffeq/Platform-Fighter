import { Input } from "./input.js"

export class StateMachine {
    constructor(player, controls,) {
        this.player = player
        this.controls = controls
        this.state = "idle"
    }

    changeState(newState) {

        if (this.state !== newState) {
    
            if (newState === "attack") {
                console.log("Attack started")

            }
            if (newState === "jump"){
                this.player.lockedFacing = this.player.facing
            }
    
            this.state = newState
        }
    
    
}

    update() {
         if (this.player.hitstun > 0) return
        switch (this.state) {

            case "idle":
                this.handleIdle()
                break

            case "run":
                this.handleRun()
                break

            case "jump":
                this.handleJump()
                break

            case "attack":
                this.handleAttack()
                break
        }

    }

    handleIdle() {
        if (this.player.inFreeFall) return
        switch (true) {
        
        case Input[this.controls.lightPressed] && Input[this.controls.up]:
            this.player.startMove("upTilt")
            this.changeState("attack")
            break
    
        case Input[this.controls.lightPressed] && Input[this.controls.down]:
            this.player.startMove("downTilt")
            this.changeState("attack")
            break

        case Input[this.controls.attackPressed]:
            this.player.startMove("jab")
            this.changeState("attack")
            break
      
        case Input[this.controls.left] || Input[this.controls.right]:
            this.changeState("run")
            break

        case Input[this.controls.specialPressed] && Input[this.controls.up]:
            this.player.startMove("upSpecial")
            this.changeState("attack")
            break
        case Input[this.controls.specialPressed] && Input[this.controls.down]:
            this.player.startMove("downSpecial")
            this.changeState("attack")
            break
        case Input[this.controls.specialPressed]:
            this.player.startMove("neutralSpecial")
            this.changeState("attack")
            break
        
    
        case !this.player.onGround:
            this.changeState("jump")
            break
        
        }
    }

    handleRun() {
        if (this.player.inFreeFall) return
        switch (true) {
        case Input[this.controls.attackPressed]: 
            this.player.startMove("dashAttack")
            this.changeState("attack")
            break

        case Input[this.controls.specialPressed]:
            this.player.startMove("sideSpecial")
            this.changeState("attack")
            break

            case Input[this.controls.lightPressed]:
                this.player.startMove("forwardTilt")
                this.changeState("attack")
                break
    
        case !Input[this.controls.left] && !Input[this.controls.right]:
            this.changeState("idle")
            break
        
    
        case !this.player.onGround: 
            this.changeState("jump")
        break
        }
    }

    handleJump() {
        if (this.player.inFreeFall) return
        const facing = this.player.lockedFacing
    
        switch (true) {

            case (Input[this.controls.attackPressed] || Input[this.controls.lightPressed]) && Input[this.controls.up]:
                this.player.startMove("upAir")
                this.changeState("attack")
                break
        
                case (Input[this.controls.attackPressed] || Input[this.controls.lightPressed]) && Input[this.controls.down]:
                this.player.startMove("downAir")
                this.changeState("attack")
                break

            case Input[this.controls.attackPressed] || Input[this.controls.lightPressed]:
    
                const holdingLeft = Input[this.controls.left]
                const holdingRight = Input[this.controls.right]
    
                const isHoldingBack =
                    (facing === 1 && holdingLeft) ||
                    (facing === -1 && holdingRight)
    
                if (isHoldingBack) {
                    this.player.startMove("backAir")
                } else if (
                    (facing === 1 && holdingRight) ||
                    (facing === -1 && holdingLeft)
                ) {
                    this.player.startMove("forwardAir")
                } else {
                    this.player.startMove("neutralAir")
                }
    
                console.log("LockedFacing:", facing, "BackAir:", isHoldingBack)
    
                this.changeState("attack")
                break  

                case Input[this.controls.specialPressed] && (Input[this.controls.left] || Input[this.controls.right]):
                    this.player.startMove("sideSpecial")
                    this.changeState("attack")
                    break

                case Input[this.controls.specialPressed] && Input[this.controls.up]:
                    this.player.startMove("upSpecial")
                    this.changeState("attack")
                    break
                case Input[this.controls.specialPressed] && Input[this.controls.down]:
                    this.player.startMove("downSpecial")
                    this.changeState("attack")
                    break
                case Input[this.controls.specialPressed]:
                    this.player.startMove("neutralSpecial")
                    this.changeState("attack")
                    break
    
            case this.player.onGround: 
                this.changeState("idle")
                break
        }
    }
    handleAttack() {
        
        const p = this.player
        const move = p.currentMove
        const dir = p.lockedFacing
        p.moveFrame++
        // spawn hitboxes
        for (const hb of move.hitboxes) {
            if (p.moveFrame >= move.startup && hb.frame === (p.moveFrame - move.startup)) {
                if (hb.requiresConnection && !p.moveConnected) continue
                const newHB = p.spawnHitbox({
                    offsetX: hb.offsetX,
                    offsetY: hb.offsetY,
                    width: hb.width,
                    height: hb.height,
                    duration: hb.duration,
                    kbX: hb.kbX,
                    kbY: hb.kbY,
                    startup: 0,
                    hitstun: hb.hitstun,
                    damage: hb.damage,
                })
        
            }
        }
    
        const totalFrames = move.startup + move.active + move.endlag

        if (move.velocityFrames) {
            for (const vf of move.velocityFrames) {
                if (p.moveFrame - move.startup === vf.frame) {
                    if (vf.vx !== undefined) {
                        p.vx = vf.vx * p.lockedFacing
                    }
                    if (vf.vy !== undefined) {
                        p.vy = vf.vy
                        
                    }
                    if (vf.y !== undefined) {
                        p.y = vf.y
                    }
                }
            }
        }
        if (move.lockHorizontal){
            p.lockedHorizontal = true
        }
        if (p.moveFrame >= totalFrames) {

            p.lockedHorizontal = false

            if (p.currentMove.freeFall) {
                p.inFreeFall = true
            }
        
            p.currentMove = null
        
            if (p.onGround) {
                this.changeState("idle")
            } else {
                this.changeState("jump")
            }
        }
    }
}
