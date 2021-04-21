const UserService = require("./UserService");

class Auth {
  async signup(cred) {
    let user = UserService.createUser(cred);

    user = await user.save();

    const token = await UserService.generateAuthToken(user);

    return {
      user,
      token,
    };
  }

  async signin(cred) {
    const user = await UserService.findByCred(cred.email, cred.password);

    const { username, email, avatarUrl } = user;

    const token = await UserService.generateAuthToken(user);

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
}

module.exports = new Auth();
