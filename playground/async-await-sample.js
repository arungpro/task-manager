const add = (a,b) => {
    return new Promise( (success, failure) => {
        setTimeout( () => {
            success(a + b)
        },2000)
    })
}

const asynChain = async () => {
    const r1 = await add(10, 20)
    const r2 = await add(r2, 20)
}

console.log(asynChain())