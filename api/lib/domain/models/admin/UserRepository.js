class UserRepository {
  get(/* id */) {
    throw new Error('Method #get(id) must be overridden');
  }
}

module.exports = UserRepository;
