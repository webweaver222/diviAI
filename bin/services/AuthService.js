const UserMapper = require("../dataAccess/UserMapper");
const jwt = require("jsonwebtoken");

class Auth {
  async signup(cred) {
    let user = UserService.createUser(cred);

    user = await user.save();

    const token = await this.generateAuthToken(user);

    return {
      user,
      token,
    };
  }

  async signin(cred) {
    const user = await UserMapper.findByCred(cred.email, cred.password);

    const { username, email, avatarUrl } = user;

    const token = await this.generateAuthToken(user);

    return {
      username,
      email,
      avatarUrl,
      token,
    };
  }

  async logout(user, userToken) {
    user.tokens = user.tokens.filter((token) => {
      return token.token != userToken;
    });
    return await user.save();
  }

  async generateAuthToken(user) {
    const token = jwt.sign({ _id: user._id.toString() }, "omaha222");
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  }
}

module.exports = new Auth();
