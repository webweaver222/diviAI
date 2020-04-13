const Person = function (name, gender) {
  this.name = name
  this.gender = gender
  this.walk = function () {
    console.log(this)
  }
}

Person.prototype.fuck = function() {
  console.log('fuck')
}

const Judy = function(name, gender) {
  Person.call(this, name, gender)
  console.log(this)
}

const Judy1 = new Judy('alex1', 'male')

const a = [1,2,3,4,6,7,8]

console.log(a.splice(1,2))