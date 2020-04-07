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
}

const Judy1 = new Person('alex1', 'male')

console.log(Person.prototype)