import { Input } from "./input.js"
import { Collision } from "./collision.js"
import { StateMachine } from "./stateMachine.js"
import { Hitbox } from "./hitbox.js"
const ControlMaps = {
    p1: {
        left: "p1Left",
        right: "p1Right",
        down: "p1Down",
        up: "p1Up",
        jump: "p1Jump",
        jumpPressed: "p1JumpPressed",
        attack: "p1Attack",
        attackPressed: "p1AttackPressed",
        light:"p1Light",
        lightPressed:"p1LightPressed",
        special:"p1Special",
        specialPressed:"p1SpecialPressed",
    },
    p2: {
        left: "p2Left",
        right: "p2Right",
        down: "p2Down",
        up: "p2Up",
        jump: "p2Jump",
        jumpPressed: "p2JumpPressed",
        attack: "p2Attack",
        attackPressed: "p2AttackPressed",
        light:"p2Light",
        lightPressed:"p2LightPressed",
        special:"p2Special",
        specialPressed:"p2SpecialPressed"
    }
}

// Stats tuning per player
const PlayerStats = {
    p1: {
        acceleration: 0.6,
        airAcceleration: 0.4,
        maxSpeed: 6,
        friction: 0.5,
        gravity: 0.6,
        jumpForce: 14,  
        maxFallSpeed: 12,
        maxJumps: 2

    },
    p2: {
        acceleration: 0.8,
        airAcceleration: 0.5,
        maxSpeed: 7,
        friction: 0.4,
        gravity: 0.7,
        jumpForce: 12, 
        maxFallSpeed: 14,
        maxJumps: 2
    }
}

export class Player1 {
    constructor(x, y, type) {
        this.x = x
        this.y = y
        this.type = type
        this.controls = ControlMaps[type] 
    
        this.width = 40
        this.height = 60
    
        this.vx = 0
        this.vy = 0
        this.kbX = 0
        this.kbY = 0
        this.stocks = 3
        this.lockedFacing = 1
    
        const stats = PlayerStats[type]
        this.acceleration = stats.acceleration
        this.airAcceleration = stats.airAcceleration
        this.maxSpeed = stats.maxSpeed
        this.friction = stats.friction
        this.gravity = stats.gravity
        this.jumpForce = stats.jumpForce
        this.maxFallSpeed = stats.maxFallSpeed
        this.maxJumps = stats.maxJumps
        this.jumpsRemaining = this.maxJumps
    
        this.jumpCutMultiplier = 0.5
        this.onGround = false
        this.fastFallSpeed = 28
        this.fastFalling = false
        this.prevY = 0
        this.prevX = 0
        this.baseMaxFallSpeed = this.maxFallSpeed
        this.inFreeFall = false
        this.lockedHorizontal = false
    
        this.currentMove = null
        this.moveFrame = 0
        this.frame = 0
        this.stateMachine = new StateMachine(this, this.controls)
        this.hitboxes = []
        this.facing = 1
        this.hitstun = 0
        this.percent = 0 
        this.endlag = 0
        this.moveConnected = false
        this.combo = false
        this.hitstop = 0
        this.comboCounter = 0
        this.startUp = 0
        
        
if (this.type === "p1") {
    this.moves = {
        jab: {
            name: "p1Jab",
            startup: 2,
            active: 6,
            endlag: 11,
            hitboxes: [
                {
                    frame: 3,
                    offsetX: this.width,
                    offsetY: 15,
                    width: 35,
                    height: 18,
                    duration: 6,
                    kbX: 7,
                    kbY: -10,
                    hitstun: 10,
                    damage: 6,
                }
            ]
        },
        dashAttack: {
            name: "p1dashAttack",
            startup: 3,
            active: 4,
            endlag: 6,
            maxSpeed: 100,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 40,
                    height: 50,
                    duration: 4,
                    kbX: 8,
                    kbY: -20,
                    hitstun: 30,
                    damage: 8,
                }
            ]

        },
        forwardTilt: {
            name: "p1forwardTilt",
            startup: 3,
            active: 6,
            endlag: 14,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 60,
                    height: 25,
                    duration: 6,
                    kbX: 12,
                    kbY: -12,
                    hitstun: 25,
                    damage: 7,
                }
            ]

        },
        downTilt: {
            name: "p1downTilt",
            startup: 3,
            active: 6,
            endlag: 10,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 30,
                    width: 60,
                    height: 25,
                    duration: 6,
                    kbX: 13,
                    kbY: -8,
                    hitstun: 25,
                    damage: 7,
                }
            ]

        },
        upTilt: {
            name: "p1upTilt",
            startup: 3,
            active: 9,
            endlag: 14,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: -10,
                    offsetY: 0,
                    width: this.width + 20,
                    height: 70,
                    duration: 3,
                    kbX: 0,
                    kbY: -10,
                    hitstun: 10,
                    damage: 1,
                },
                {
                    frame: 3,
                    offsetX: -20,
                    offsetY: -40,
                    width: this.width + 40,
                    height: 40,
                    duration: 6,
                    kbX: 2,
                    kbY: -16,
                    hitstun: 25,
                    damage: 7,
                }
            ]

        },
        forwardAir: {
            name: "p1forwardAir",
            startup: 3,
            active: 6,
            endlag: 14,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 60,
                    height: 60,
                    duration: 6,
                    kbX: 20,
                    kbY: -15,
                    hitstun: 25,
                    damage: 13,
                }
            ]

        },
        backAir: {
            name: "p1backAir",
            startup: 3,
            active: 6,
            endlag: 14,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 100,
                    height: 25,
                    duration: 6,
                    kbX: 27,
                    kbY: -25,
                    hitstun: 25,
                    damage: 16
                }
            ]

        },
        neutralAir: {
            name: "p1neutralAir",
            startup: 3,
            active: 6,
            endlag: 14,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: 0,
                    offsetY: 0,
                    width: 60,
                    height: 70,
                    duration: 6,
                    kbX: 15,
                    kbY: 0,
                    hitstun: 25,
                    damage: 10,
                }
            ]

        },
        upAir: {
            name: "p1upAir",
            startup: 8,
            active: 13,
            endlag: 10,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: -20,
                    offsetY: -20,
                    width: this.width + 40,
                    height: 30,
                    duration: 2,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 1,
                },
                {
                    frame: 3,
                    offsetX: -20,
                    offsetY: -20,
                    width: this.width + 40,
                    height: 30,
                    duration: 2,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 1,
                },
                {
                    frame: 5,
                    offsetX: -20,
                    offsetY: -20,
                    width: this.width + 40,
                    height: 30,
                    duration: 2,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 1,
                },
                {
                    frame: 7,
                    offsetX: -20,
                    offsetY: -20,
                    width: this.width + 40,
                    height: 30,
                    duration: 2,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 1,
                },
                {
                    frame: 9,
                    offsetX: -20,
                    offsetY: -20,
                    width: this.width + 40,
                    height: 30,
                    duration: 2,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 1,
                },
                {
                    frame: 11,
                    offsetX: -40,
                    offsetY: -40,
                    width: this.width + 80,
                    height: 55,
                    duration: 2,
                    kbX: 8,
                    kbY: -25,
                    hitstun: 25,
                    damage: 7,
                }
            ]

        },
        downAir: {
            name: "p1downAir",
            startup: 9,
            active: 30,
            endlag: 10,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: 45,
                    offsetY: 30,
                    width: this.width,
                    height: 70,
                    duration: 12,
                    kbX: 12,
                    kbY: -4,
                    hitstun: 5,
                    damage: 6,
                },
                {
                    frame: 12,
                    offsetX: 0,
                    offsetY: 30,
                    width: this.width,
                    height: 70,
                    duration: 6,
                    kbX: 0,
                    kbY: 15,
                    hitstun: 10,
                    damage: 12,
                },
                {
                    frame: 18,
                    offsetX: -45,
                    offsetY: 30,
                    width: this.width,
                    height: 70,
                    duration: 12,
                    kbX: 6,
                    kbY: -20,
                    hitstun: 5,
                    damage: 6,
                },

            ]

        }, 
        neutralSpecial: {
            name: "p1neutralSpecial",
            startup: 25,
            active: 36,
            endlag: 45,
            maxSpeed: 0,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 30,
                    height: 30,
                    duration: 7,
                    kbX: 0,
                    kbY: -3,
                    hitstun: 25,
                    damage: 4,
                },
                {
                    frame: 8,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 30,
                    height: 30,
                    duration: 7,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },
                {
                    frame: 15,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 30,
                    height: 30,
                    duration: 7,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },
                {
                    frame: 22,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 30,
                    height: 30,
                    duration: 7,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },
                {
                    frame: 29,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 30,
                    height: 30,
                    duration: 7,
                    kbX: 20,
                    kbY: -10,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },
                {
                    frame: 36,
                    offsetX: this.width + 100,
                    offsetY: -70,
                    width: 150,
                    height: 150,
                    duration: 15,
                    kbX: 50,
                    kbY: -50,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },

            ]
        },

        sideSpecial: {
            name: "p1sideSpecial",
            startup: 7,
            active: 63,
            endlag: 0,
            maxSpeed: 2,
            freeFall: true,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 0,
                    width: 100,
                    height: 60,
                    duration: 20,
                    kbX: 0,
                    kbY: -4.4,
                    hitstun: 25,
                    damage: 4,
                },
                {
                    frame: 20,
                    offsetX: this.width,
                    offsetY: 0,
                    width: 100,
                    height: 60,
                    duration: 20,
                    kbX: 0,
                    kbY: -4.4,
                    hitstun: 25,
                    damage: 4,
                },
                {
                    frame: 40,
                    offsetX: this.width,
                    offsetY: 0,
                    width: 100,
                    height: 60,
                    duration: 20,
                    kbX: 0,
                    kbY: -4.4,
                    hitstun: 25,
                    damage: 4,
                },
                {
                    frame: 60,
                    offsetX: this.width,
                    offsetY: 0,
                    width: 100,
                    height: 60,
                    duration: 3,
                    kbX: 0,
                    kbY: -30,
                    hitstun: 25,
                    damage: 8,
                },
            ]

        },
        upSpecial: {
            name: "p1upSpecial",
            startup: 3,
            active: 30,
            endlag: 0,
            ignoreGravity: true,
            freeFall: true,
            lockHorizontal: true,
            velocityFrames: [
                { frame: 1, vy: -10},
            ],
            hitboxes: [
                {
                    frame: 1,
                    offsetX: -10,
                    offsetY: -10,
                    width: 60,
                    height: 70,
                    duration: 33,
                    kbX: 10,
                    kbY: -14,
                    hitstun: 25,
                    damage: 10,
                }
            ]

        },
        downSpecial: {
            name: "p1downSpecial",
            startup: 10,
            active: 37,
            endlag: 0,
            ignoreGravity: true,
            lockHorizontal: true,
            velocityFrames: [
                { frame: 1, vy: -2, vx: 2},

            ],
            hitboxes: [
                {
                    frame: 1,
                    offsetX: -10,
                    offsetY: 0,
                    width: this.width + 20,
                    height: 70,
                    duration: 8,
                    kbX: 4,
                    kbY: -5,
                    hitstun: 25,
                    damage: 3,
                },
                {
                    frame: 9,
                    offsetX: -10,
                    offsetY: 0,
                    width: this.width + 20,
                    height: 70,
                    duration: 8,
                    kbX: 4,
                    kbY: -5,
                    hitstun: 25,
                    damage: 3,
                },
                {
                    frame: 17,
                    offsetX: -10,
                    offsetY: 0,
                    width: this.width + 20,
                    height: 70,
                    duration: 8,
                    kbX: 2,
                    kbY: -2,
                    hitstun: 25,
                    damage: 3,
                },
                {
                    frame: 25,
                    offsetX: -10,
                    offsetY: 0,
                    width: this.width + 20,
                    height: 70,
                    duration: 8,
                    kbX: 2,
                    kbY: -2,
                    hitstun: 25,
                    damage: 3,
                },
                {
                    frame: 33,
                    offsetX: this.width,
                    offsetY: 20,
                    width: 50,
                    height: 40,
                    duration: 4,
                    kbX: 25,
                    kbY: -15,
                    hitstun: 25,
                    damage: 1,
                },
                {
                    frame: 33,
                    offsetX: -this.width - 10,
                    offsetY: 20,
                    width: 50,
                    height: 40,
                    duration: 4,
                    kbX: 25,
                    kbY: -15,
                    hitstun: 25,
                    damage: 1,
                },
                {
                    frame: 33,
                    offsetX: -10,
                    offsetY: 0,
                    width: this.width + 20,
                    height: 70,
                    duration: 4,
                    kbX: 25,
                    kbY: -15,
                    hitstun: 25,
                    damage: 1,
                },
            ]

        },
    }
} else if (this.type === "p2") {
    this.moves = {
        jab: {
            name: "p2Jab",
            startup: 10,
            active: 8,
            endlag: 12,
            hitboxes: [
                {
                    frame: 8,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 80,
                    height: 20,
                    duration: 7,
                    kbX: 8,
                    kbY: -12,
                    hitstun: 30,
                    damage: 12,
                }
            ]

        },
        dashAttack: {
            name: "p2dashAttack",
            startup: 15,
            active: 10,
            endlag: 20,
            hitboxes: [
                {
                    frame: 10,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 100,
                    height: 50,
                    duration: 10,
                    kbX: 25,
                    kbY: -3,
                    hitstun: 25,
                    damage: 16,
                }
            ]

        },
        forwardTilt: {
            name: "p2forwardTilt",
            startup: 19,
            active: 20,
            endlag: 25,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 60,
                    height: 40,
                    duration: 6,
                    kbX: 1,
                    kbY: -1,
                    hitstun: 15,
                    damage: 2
                },
                {
                    frame: 7,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 60,
                    height: 40,
                    duration: 6,
                    kbX: 1,
                    kbY: -1,
                    hitstun: 15,
                    damage: 2,
                },
                {
                    frame: 13,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 60,
                    height: 40,
                    duration: 6,
                    kbX: 1,
                    kbY: -1,
                    hitsunt: 15,
                    damage: 2,
                },
                {
                    frame: 19,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 60,
                    height: 40,
                    duration: 1,
                    kbX: 1,
                    kbY: -1,
                    hitstun: 15,
                    damage: 2,
                },
                {
                    frame: 20,
                    offsetX: this.width + 30,
                    offsetY: -this.height + 20,
                    width: 50,
                    height: 100,
                    duration: 6,
                    kbX: 15,
                    kbY: -25,
                    hitstun: 30,
                    damage: 12,
                },
            ]

        },
        upTilt: {
            name: "p2upTilt",
            startup: 19,
            active: 8,
            endlag: 10,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: -30,
                    width: 50,
                    height: 90,
                    duration: 8,
                    kbX: -12,
                    kbY: -20,
                    hitstun: 35,
                    damage: 10

                },
            ]
            },
        downTilt: {
            name: "p2downTilt",
            startup: 14,
            active: 20,
            endlag: 25,
            maxSpeed: 0,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 30,
                    width: 90,
                    height: 30,
                    duration: 14,
                    kbX: 10,
                    kbY: -5,
                    hitstun: 15,
                    damage: 7

                },
                {
                    frame: 15,
                    offsetX: this.width + 100,
                    offsetY: 25,
                    width: 50,
                    height: 50,
                    duration: 5,
                    kbX: 20,
                    kbY: -10,
                    hitstun: 15,
                    damage: 8

                },
            ]
            },
        neutralAir: {
            name: "p2neutralAir",
            startup: 3,
            active: 12,
            endlag: 6,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 20,
                    width: 70,
                    height: 40,
                    duration: 6,
                    kbX: 5,
                    kbY: -5,
                    hitstun: 25,
                    damage: 7,
                },
                {
                    frame: 7,
                    offsetX: this.width,
                    offsetY: 0,
                    width: 70,
                    height: 40,
                    duration: 6,
                    kbX: 15,
                    kbY: -10,
                    hitstun: 25,
                    damage: 13,
                },
            ]

        },
        forwardAir: {
            name: "p2forwardAir",
            startup: 5,
            active: 14,
            endlag: 14,
            ignoreGravity: true,

            velocityFrames:[
                {frame: 1, vx: 25}
            ],
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 0,
                    width: 80,
                    height: 40,
                    duration: 14,
                    kbX: 10,
                    kbY: -10,
                    hitstun: 25,
                    damage: 14,
                },
                {
                    frame: 7,
                    offsetX: this.width + 30,
                    offsetY: -10,
                    width: 40,
                    height: 60,
                    duration: 7,
                    kbX: 15,
                    kbY: -5,
                    hitstun: 25,
                    damage: 14,
                },

            ]

        },
        backAir: {
            name: "p2backAir",
            startup: 15,
            active: 6,
            endlag: 20,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: 40,
                    offsetY: 20,
                    width: 80,
                    height: 40,
                    duration: 6,
                    kbX: 30,
                    kbY: -20,
                    hitstun: 25,
                    damage: 21,
                }
            ]

        },
        upAir: {
            name: "p2upAir",
            startup: 3,
            active: 22,
            endlag: 14,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: 15,
                    offsetY: -this.height,
                    width: 40,
                    height: 80,
                    duration: 11,
                    kbX: 9,
                    kbY: -30,
                    hitstun: 25,
                    damage: 14,
                },
                {
                    frame: 12,
                    offsetX: -15,
                    offsetY: -this.height,
                    width: 30,
                    height: 90,
                    duration: 10,
                    kbX: 30,
                    kbY: -9,
                    hitstun: 25,
                    damage: 17,
                },
            ]

        },
        downAir: {
            name: "p2downAir",
            startup: 13,
            active: 30,
            endlag: 12,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: 0,
                    offsetY: 60,
                    width: 40,
                    height: 40,
                    duration: 6,
                    kbX: 0,
                    kbY: 5,
                    hitstun: 25,
                    damage: 21,
                },
                {
                    frame: 6,
                    offsetX: 0,
                    offsetY: 90,
                    width: 40,
                    height: 40,
                    duration: 6,
                    kbX: 0,
                    kbY: 5,
                    hitstun: 25,
                    damage: 21,
                },
                {
                    frame: 12,
                    offsetX: 0,
                    offsetY: 120,
                    width: 40,
                    height: 40,
                    duration: 6,
                    kbX: 0,
                    kbY: 5,
                    hitstun: 25,
                    damage: 21,
                },
                {
                    frame: 18,
                    offsetX: 0,
                    offsetY: 150,
                    width: 40,
                    height: 40,
                    duration: 6,
                    kbX: 0,
                    kbY: 5,
                    hitstun: 25,
                    damage: 21,
                },
                {
                    frame: 24,
                    offsetX: -10,
                    offsetY: 180,
                    width: 60,
                    height: 60,
                    duration: 6,
                    kbX: 0,
                    kbY: 15,
                    hitstun: 25,
                    damage: 21,
                },
            ]

        },
        neutralSpecial: {
            name: "p2neutralSpecial",
            startup: 25,
            active: 36,
            endlag: 45,
            maxSpeed: 0,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 15,
                    width: 30,
                    height: 30,
                    duration: 7,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 4,
                },
                {
                    frame: 8,
                    offsetX: this.width,
                    offsetY: 15,
                    width: 80,
                    height: 30,
                    duration: 7,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },
                {
                    frame: 15,
                    offsetX: this.width,
                    offsetY: 15,
                    width: 80,
                    height: 30,
                    duration: 7,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },
                {
                    frame: 22,
                    offsetX: this.width,
                    offsetY: 15,
                    width: 80,
                    height: 30,
                    duration: 7,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },
                {
                    frame: 29,
                    offsetX: this.width,
                    offsetY: 15,
                    width: 80,
                    height: 30,
                    duration: 2,
                    kbX: 20,
                    kbY: -10,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },
                {
                    frame: 40,
                    offsetX: 160,
                    offsetY: -70,
                    width: 150,
                    height: 150,
                    duration: 15,
                    kbX: 50,
                    kbY: -50,
                    hitstun: 25,
                    damage: 4,
                    requiresConnection: true,
                },

            ]
        },
        sideSpecial: {
            name: "p2sideSpecial",
            startup: 25,
            active: 3,
            endlag: 30,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: this.width,
                    offsetY: 0,
                    width: 140,
                    height: 50,
                    duration: 3,
                    kbX: 0,
                    kbY: 0,
                    hitstun: 55,
                    damage: 8,
                }
            ]

        },
        upSpecial: {
            name: "p2upSpecial",
            startup: 25,
            active: 31,
            endlag: 10,
            ignoreGravity: true,
            freeFall: true,
            lockHorizontal: true,
            velocityFrames:[ 
                {frame: 1, vx: 0}, 
                {frame: 10, vy: -35},
                {frame: 20, vy: 0}
            ],
            hitboxes: [
                {
                    frame: 1,
                    offsetX: -20,
                    offsetY: 0,
                    width: this.width + 40,
                    height: 60,
                    duration: 10,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 10,
                },
                {
                    frame: 11,
                    offsetX: this.width,
                    offsetY: 10,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                {
                    frame: 13,
                    offsetX: this.width,
                    offsetY: 50,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                {
                    frame: 15,
                    offsetX: this.width - 30,
                    offsetY: 60,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                {
                    frame: 17,
                    offsetX: this.width - 60,
                    offsetY: 60,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                {
                    frame: 19,
                    offsetX: -this.width, 
                    offsetY: 50,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                {
                    frame: 21,
                    offsetX: -this.width, 
                    offsetY: 10,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                {
                    frame: 23,
                    offsetX: -this.width, 
                    offsetY: -20,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                {
                    frame: 25,
                    offsetX: -this.width + 10,
                    offsetY: -40,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                {
                    frame: 27,
                    offsetX: -this.width + 50,
                    offsetY: -40,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                {
                    frame: 29,
                    offsetX: this.width,
                    offsetY: -10,
                    width: 40,
                    height: 40,
                    duration: 2,
                    kbX: 0,
                    kbY: -20,
                    hitstun: 30,
                    damage: 3,
                },
                
            ],

        },
        downSpecial: {
            name: "p2downSpecial",
            startup: 50,
            active: 15,
            endlag: 40,
            maxSpeed: 0,
            hitboxes: [
                {
                    frame: 1,
                    offsetX: -60,
                    offsetY: 30,
                    width: this.width + 120,
                    height: 50,
                    duration: 14,
                    kbX: 40,
                    kbY: -25,
                    hitstun: 55,
                    damage: 30,
                }
            ]

        },
    }
}
}

    update(stage) {
    this.prevY = this.y
    this.prevX = this.x
    if (this.hitstun <= 0){
    this.handleHorizontal()
    this.handleJump()
 }
 if ((this.currentMove?.name === "p1sideSpecial" && !this.onGround && !this.inFreeFall) || ((this.currentMove?.name === "p1neutralSpecial" || this.currentMove?.name === "p2neutralSpecial" ) && !this.onGround && this.moveConnected)) {
    this.vx = 0
    this.vy = 0
}

if (this.hitstop > 0) {
    this.hitstop--
    this.vx = 0
    this.vy = 0

    return
}
    this.applyGravity()
    this.applyMovement()
    if (this.hitstop === 0){ // tænk over at ændre hitstop pr move eller scale det med hvor stærkt movet er (også få lavet maxspeed og rigtige moves til alt)
    this.kbX *= 0.9
    this.kbY *= 0.9
    }
    this.handleCollisions(stage)
    this.handleFastFall()

    this.stateMachine.update()
    
    this.updateHitboxes()
    this.checkBlastZone(stage)
    if (this.hitstun > 0){
         this.hitstun--
         this.combo = true
         this.comboCounter += 1/this.hitstun
        } else {
            this.combo = false
            this.comboCounter = 0
            
        }
    this.frame++
    }

    updateHitboxes() {

        for (let i = this.hitboxes.length - 1; i >= 0; i--) {
    
            const h = this.hitboxes[i]
            h.update()
            if (h.duration <= 0) {
                this.hitboxes.splice(i, 1)
            }
    
        }
    
    }

    handleHorizontal() {
        if (this.lockedHorizontal) return
        const isAttacking = this.currentMove !== null

        let accel;

        if (this.onGround) {
            accel = this.acceleration
        } else if (this.inFreeFall) {
            accel = this.airAcceleration * 0.5
        } else {
            accel = this.airAcceleration
        }
    
        if (Input[this.controls.left]) {
            this.vx -= accel
            if(!isAttacking) this.facing = -1
        }
    
        if (Input[this.controls.right]) {
            this.vx += accel
            if(!isAttacking) this.facing = 1
        }
        if(this.inFreeFall)
        accel = this.airAcceleration * 0.3
    
        // Friction
        if (!Input[this.controls.left] && !Input[this.controls.right] && this.onGround) {
            if (this.vx > 0) {
                this.vx -= this.friction
                if (this.vx < 0) this.vx = 0
            } else if (this.vx < 0) {
                this.vx += this.friction
                if (this.vx > 0) this.vx = 0
            }
        }
        
        if (isAttacking && this.onGround) {
            const max = this.currentMove.maxSpeed ?? 2
            this.vx = Math.max(-max, Math.min(max, this.vx))
        }
        // Clamp speed
        if (this.vx > this.maxSpeed) this.vx = this.maxSpeed
        if (this.vx < -this.maxSpeed) this.vx = -this.maxSpeed
    }

    handleJump() {
        if (this.currentMove !== null) return
        if (this.inFreeFall) return
        if (Input[this.controls.jumpPressed] && this.jumpsRemaining > 0) {
            this.vy = -this.jumpForce
            this.jumpsRemaining--
            this.onGround = false
        }
    
        // variable jump height
        if (!Input[this.controls.jump] && this.vy < 0) {
            this.vy *= this.jumpCutMultiplier
        }
    }

    handleCollisions(stage) {

        this.onGround = false
    
        for (const platform of stage.platforms) {
    
            const collisionType = Collision.resolvePlatform(this, platform)
    
            if (collisionType === "top") {
                this.onGround = true
                this.inFreeFall = false
            }
        }
    
        if (Math.abs(this.kbY) > 0.5) {
            this.onGround = false
        }
    
        if (this.onGround) {
            this.jumpsRemaining = this.maxJumps
        }
    }

    handleFastFall() {
        if (this.currentMove?.name.includes("downAir")) {
            this.maxFallSpeed = 8
        } else {
            this.maxFallSpeed = this.baseMaxFallSpeed
        }
    
        if (!this.onGround && Input[this.controls.down] && this.vy > 0 && !this.fastFalling) {
            this.vy = this.fastFallSpeed
            this.fastFalling = true
        }
    
        if (this.onGround) {
            this.fastFalling = false
        }
    }

    checkBlastZone(stage){

        const b = stage.blastZone
        
        if(
            this.x < b.left ||
            this.x > b.right ||
            this.y < b.top ||
            this.y > b.bottom
        ){
            this.die()
        }
        
        }

        createJab() {

            if (this.type === "p1") {
                this.createP1Jab()
            }
        
            if (this.type === "p2") {
                this.createP2Jab()
            }
        
        }

        startMove(name) {
            this.currentMove = this.moves[name]
            this.moveFrame = 0
            this.lockedFacing = this.facing
            this.moveConnected = false
        }


        
        spawnHitbox(config) {
            const hitbox = new Hitbox(
                this,
                config.offsetX,
                config.offsetY,
                config.width,
                config.height,
                config.duration,
                config.kbX,
                config.kbY,
                config.startup,
                config.hitstun,
                config.damage,
            )
        
            
            hitbox.ownerType = this.type

            this.hitboxes.push(hitbox)
        }

    applyGravity() {
        if(this.currentMove?.ignoreGravity) return
        if ((this.currentMove?.name === "p1sideSpecial" && !this.onGround) || ((this.currentMove?.name === "p1neutralSpecial" || this.currentMove?.name === "p2neutralSpecial") && this.moveConnected)) {
            return  
        }
        this.vy += this.gravity
        if (this.vy > this.maxFallSpeed) {
            this.vy = this.maxFallSpeed
        }
    }

    applyMovement() {
        this.x += this.vx + this.kbX
        this.y += this.vy + this.kbY
    }

    die(){

        this.stocks--
        
        console.log("stocks left:",this.stocks)
        
        this.respawn()
        
        }

        respawn(){

            this.x = 400
            this.y = 200
            
            this.vx = 0
            this.vy = 0
            
            this.jumpsRemaining = this.maxJumps
            this.percent = 0
            this.kbX = 0
            this.kbY = 0
            this.applyGravity()
            
            }

    draw(ctx) {
          if (this.type === "p1") {
        ctx.fillStyle = "blue"
    } else if (this.type === "p2") {
        ctx.fillStyle = "green"
    }
        ctx.fillRect(this.x, this.y, this.width, this.height)
        for (const h of this.hitboxes) {
            h.draw(ctx)
            
        }
    }
}