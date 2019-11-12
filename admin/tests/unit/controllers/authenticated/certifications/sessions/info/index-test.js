import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
// import Service from '@ember/service';
import sinon from 'sinon';

module('Unit | Controller | authenticated/certifications/sessions/info/index', function(hooks) {

  setupTest(hooks);

  let controller;

  hooks.beforeEach(function() {
    controller = this.owner.lookup('controller:authenticated/certifications/sessions/info/index');
  });

  module('#downloadSessionResultFile', function() {

    test('should launch the download of result file', function(assert) {
      assert.expect(1);

      // given
      controller.set('sessionInfoService');
      const sessionInfoServiceMock = sinon.mock(controller.get('sessionInfoService'), 'downloadSessionExportFile');
      const model = {}; // this.model ... ?

      // when
      controller.actions.downloadSessionResultFile.call(controller);
      // ou ?
      // controller.send('downloadSessionResultFile');

      // then
      sinon.assert.calledWithExactly(sessionInfoServiceMock, model);
    });

    // test('should show an error', function() {
    //   // given
    //   const notificationsMock = sinon.mock(controller.get('notifications'), 'error');
    //   controller.set(notificationsMock);
    //   const error = 'an error';
    //
    //   // when
    //   controller.actions.downloadSessionResultFile.call(controller);
    //
    //   // then
    //   sinon.assert.calledWithExactly(notificationsMock, error);
    // });
  });

});
