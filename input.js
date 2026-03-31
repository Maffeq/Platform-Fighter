export const Input = {

    p1Left:false,
    p1Right:false,
    p1Jump:false,
    p1JumpPressed:false,
    p1Attack:false,
    p1AttackPressed:false,
    p1Down:false,
    p1Up:false,
    p1Light:false, 
    p1LightPressed:false,
    p1Special:false,
    p1SpecialPressed:false,

    p2Left:false,
    p2Right:false,
    p2Jump:false,
    p2JumpPressed:false,
    p2Attack:false,
    p2AttackPressed:false,
    p2Down:false,
    p2Up:false,
    p2Light:false,
    p2LightPressed:false,
    p2Special:false,
    p2SpecialPressed:false,
}

window.addEventListener("keydown",(e)=>{

    

    if(e.code==="KeyA") Input.p1Left=true
    if(e.code==="KeyD") Input.p1Right=true
    if(e.code==="KeyS") Input.p1Down=true
    if(e.code==="KeyW") Input.p1Up=true
    
    if(e.code==="Space"){
        if(!Input.p1Jump) Input.p1JumpPressed=true
        Input.p1Jump=true
    }
    
    if(e.code==="KeyF"){
        if(!Input.p1Attack) Input.p1AttackPressed=true
        Input.p1Attack=true
    }
    if(e.code === "KeyG"){
        if(!Input.p1Light) Input.p1LightPressed = true
        Input.p1Light = true
    }
    if(e.code === "KeyH"){
        if(!Input.p1Special) Input.p1SpecialPressed = true
        Input.p1Special = true
    }

    
    if(e.code==="ArrowUp") Input.p2Up=true
    if(e.code==="ArrowLeft") Input.p2Left=true
    if(e.code==="ArrowRight") Input.p2Right=true
    if(e.code==="ArrowDown") Input.p2Down=true
    
    if(e.code==="AltRight"){
        if(!Input.p2Jump) Input.p2JumpPressed=true
        Input.p2Jump=true
    }
    
    if(e.code==="Slash"){
        if(!Input.p2Attack) Input.p2AttackPressed=true
        Input.p2Attack=true
    }
    if(e.code==="ShiftRight"){
        if(!Input.p2Light) Input.p2LightPressed=true
        Input.p2Light=true
    }
    if(e.code === "Quote"){
        if(!Input.p2Special) Input.p2SpecialPressed = true
        Input.p2Special = true
    }

})

window.addEventListener("keyup",(e)=>{

    // player 1
    if(e.code==="KeyW") Input.p1Up=false
    if(e.code==="KeyA") Input.p1Left=false
    if(e.code==="KeyD") Input.p1Right=false
    if(e.code==="KeyS") Input.p1Down=false
    if(e.code==="Space") Input.p1Jump=false
    if(e.code==="KeyF") Input.p1Attack=false
    if(e.code==="KeyG") Input.p1Light=false
    if(e.code==="KeyH") Input.p1Special=false

    // player 2
    if(e.code==="ArrowUp") Input.p2Up=false
    if(e.code==="ArrowLeft") Input.p2Left=false
    if(e.code==="ArrowRight") Input.p2Right=false
    if(e.code==="ArrowDown") Input.p2Down=false
    if(e.code==="AltRight") Input.p2Jump=false
    if(e.code==="Slash") Input.p2Attack=false
    if(e.code==="ShiftRight") Input.p2Light=false
    if(e.code==="Quote") Input.p2Special=false

})


export function resetPressed(){
    Input.p1JumpPressed=false
    Input.p1AttackPressed=false

    Input.p2JumpPressed=false
    Input.p2AttackPressed=false

    Input.p1LightPressed = false
    Input.p2LightPressed = false

    Input.p1SpecialPressed = false
    Input.p2SpecialPressed = false
}