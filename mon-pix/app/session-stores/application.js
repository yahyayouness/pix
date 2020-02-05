import LocalStorageStore from 'ember-simple-auth/session-stores/local-storage';

export default LocalStorageStore.extend({
  _currentURLContainsToken() {
    return /^\?token=/.test(window.location.search);
  },

  restore() {
    if (this._currentURLContainsToken()) {
      this.clear();
    }
    return this._super(...arguments);
  },
});

