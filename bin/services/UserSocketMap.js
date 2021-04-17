class UserSocketMap extends Map {
  set(key, value) {
    return super.set(key, value);
  }
}

module.exports = new UserSocketMap();
