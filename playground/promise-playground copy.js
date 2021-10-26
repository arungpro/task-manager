var add = (a,b) => {
    return new Promise( (success, failure) => {
        setTimeout( () => {
            success(a + b)
        },2000)
    })
}

const sub = (a, b) => {
    return new Promise( (resolve, reject) => {
        setTimeout(() => {
            resolve(a - b)
        }, 2000)
    })
}


add(10, 20).then( (res) => {
    console.log(res)
    return sub(res, 30)
}).then( (res) => {
    console.log(res)
    return add(res, 7)
}).then( (res) => {
    console.log(res)
}).catch( (e) => {
    console.log(e)
})