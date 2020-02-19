import ApplicationAdapter from './application';

export default ApplicationAdapter.extend({

  updateRecord(store, type, snapshot) {
    const userId = snapshot.adapterOptions.userId;
    const url = `${this.host}/${this.namespace}/users/${userId}/update-current-organization`;
    const data = this.serialize(snapshot);
    return this.ajax(url, 'PUT', { data });
  },

  urlForCreateRecord() {
    return `${this.host}/${this.namespace}/organization-user-informations`;
  }

});
