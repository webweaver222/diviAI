const test = function() {
    this.prop1 = '1'
    console.log(this.prop1)
    new test()
    this.prop2 = '2'
    this.method1 = function() {
        const a = new test()
    }
}

const a = new test()