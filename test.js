var a = [3,1,5,6,78,9,0]
let max = a[1];
a.forEach(n => {
    if (n > max) {
      max = n
    }
})

console.log(max)