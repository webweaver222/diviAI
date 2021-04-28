const validator = require("validator");
const UserMapper = require("../dataAccess/UserMapper");

const v = {
  errors: {},

  validateSignIn: async function (userData) {
    this.errors = {};

    /*validation rules for signup and singin */
    if (!validator.isEmail(userData.email)) {
      this.errors["email"] = [];
      this.errors["email"].push("Email is not valid");
    }

    if (validator.isEmpty(userData.email)) {
      if (!this.errors.hasOwnProperty("email")) this.errors["email"] = [];
      this.errors["email"].push("Empty Email");
    }

    if (validator.isEmpty(userData.password)) {
      this.errors["password"] = [];
      this.errors["password"].push("No password provided");
    }
  },

  validateSignUp: async function (userData) {
    this.validateSignIn(userData);

    if (validator.isEmpty(userData.username)) {
      this.errors["username"] = [];
      this.errors["username"].push("No username provided");
    }

    try {
      const user = await UserMapper.findByEmail(userData.email);

      if (user) {
        if (!this.errors.hasOwnProperty("email")) this.errors["email"] = [];
        this.errors["email"].push("That email is already exist");
      }
    } catch {}
  },
};

module.exports = v;
