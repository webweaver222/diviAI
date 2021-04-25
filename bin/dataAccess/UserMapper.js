const User = require("../models/User");

const bcrypt = require("bcryptjs");

module.exports = {
  createUser: function (data) {
    return new User(data);
  },

  findById: function (id, projection = null) {
    return User.findById(id, projection);
  },

  getUser: function (post) {
    return post
      .populate("user", { _id: 1, username: 1, avatarUrl: 1, timestamp: 1 })
      .execPopulate();
  },

  findByName: function (name, projection = null) {
    return User.findOne({ username: name }, projection);
  },
  findByEmail: function (email, projection = null) {
    return User.findOne({ email: email }, projection);
  },
  // define method to find user by his credentials
  findByCred: async function (email, password) {
    const user = await User.findOne(
      { email }
      //{ username: 1, email: 1, avatarUrl: 1, password: 1 }
    );

    if (!user) throw new Error("Wrong email or password");

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new Error("Wrong email or password");

    return user;
  },
};
