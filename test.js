let a = [44, 96, 75, 96]  
let b = [1936, 9216, 5625, 9217]



for(let i =0; i < a.length; i++) {
    let number = Math.pow(a[i],2)
    if (b.includes(number)) {
        let index = b.indexOf(number)
        b[index] = null
        console.log('+')}
    else console.log('-')
}