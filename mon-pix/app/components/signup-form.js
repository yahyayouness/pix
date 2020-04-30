import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import classic from 'ember-classic-decorator';
import isEmailValid from 'mon-pix/utils/email-validator';
import isPasswordValid from '../utils/password-validator';
import ENV from 'mon-pix/config/environment';

const ERROR_INPUT_MESSAGE_MAP = {
  firstName: 'signup-form.fields.firstname.error',
  lastName: 'signup-form.fields.lastname.error',
  email: 'signup-form.fields.email.error',
  password: 'signup-form.fields.password.error'
};

@classic
export default class SignupForm extends Component {

  @service session;
  @service intl;

  @tracked _notificationMessage = null;
  @tracked isLoading = false;
  @tracked validation;

  urlHome = ENV.APP.HOME_HOST;
  isRecaptchaEnabled = ENV.APP.IS_RECAPTCHA_ENABLED;

  _tokenHasBeenUsed = null;

  constructor() {
    super(...arguments);
    // this._resetValidationFields();
  }

  _getErrorMessage(status, key) {
    return (status === 'error') ? this.intl.t(ERROR_INPUT_MESSAGE_MAP[key]) : null;
  }

  _getValidationStatus(isValidField) {
    return (isValidField) ? 'error' : 'success';
  }

  _isValuePresent(value) {
    return value.trim() ? true : false;
  }

  _updateValidationStatus(key, status, message) {
    const statusObject = 'validation.' + key + '.status';
    const messageObject = 'validation.' + key + '.message';
    // this.set(statusObject, status);
    // this.set(messageObject, message);
  }

  _getModelAttributeValueFromKey(key) {
    const userModel = this.args.user;
    return userModel.get(key);
  }

  _resetValidationFields() {
    const defaultValidationObject = {
      lastName: {
        status: 'default',
        message: null
      },
      firstName: {
        status: 'default',
        message: null
      },
      email: {
        status: 'default',
        message: null
      },
      password: {
        status: 'default',
        message: null
      },
      cgu: {
        status: 'default',
        message: null
      },
      recaptchaToken: {
        status: 'default',
        message: null
      }
    };

    this.validation = defaultValidationObject;
  }

  _updateInputsStatus() {
    const errors = this.args.user.errors;
    errors.forEach(({ attribute, message }) => {
      this._updateValidationStatus(attribute, 'error', message);
    });
  }

  _executeFieldValidation(key, isValid) {
    const modelAttrValue = this._getModelAttributeValueFromKey(key);
    const isValidInput = !isValid(modelAttrValue);
    const status = this._getValidationStatus(isValidInput);
    const message = this._getErrorMessage(status, key);
    this._updateValidationStatus(key, status, message);
  }

  _trimNamesAndEmailOfUser() {
    const { firstName, lastName, email } = this.args.user;
    this.args.user.firstName = firstName.trim();
    this.args.user.lastName = lastName.trim();
    this.args.user.email = email.trim();
  }

  @action
  resetTokenHasBeenUsed() {
    this._tokenHasBeenUsed = false;
  }

  @action
  validateInput(key) {
    this._executeFieldValidation(key, this._isValuePresent);
  }

  @action
  validateInputEmail(key) {
    this._executeFieldValidation(key, isEmailValid);
  }

  @action
  validateInputPassword(key) {
    this._executeFieldValidation(key, isPasswordValid);
  }

  @action
  signup() {
    this._notificationMessage = null;
    this.isLoading = true;

    this._trimNamesAndEmailOfUser();

    this.args.user.save().then(() => {
      const credentials = { login: this.args.user.email, password: this.args.user.password };
      this.authenticateUser(credentials);
      this._tokenHasBeenUsed = true;
      this.user.password = null;
    }).catch(() => {
      this._updateInputsStatus();
      this._tokenHasBeenUsed = true;
      this.isLoading = false;
    });
  }
}
