class BaseAssertionError extends Error { }

class SystemError extends BaseAssertionError { }
class UserError extends BaseAssertionError { }
class PeerError extends BaseAssertionError { }

module.exports = {
  system: (condition, message) => {
    if (!condition) throw new SystemError(message);
  },
  user: (condition, message) => {
    if (!condition) throw new UserError(message);
  },
  peer: (condition, message) => {
    if (!condition) throw new PeerError(message);
  },
};
