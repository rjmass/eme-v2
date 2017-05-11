import { emailLoadThunk, emailUpdateThunk,
  emailValidationErrorThunk, emailDeleteThunk,
  emailCloneThunk, emailReimportThunk, emailLockCreateThunk
} from 'redux/modules/emails';
import EmailConfirmDeleteDialog from './EmailConfirmDeleteDialog';
import EmailConfirmCloneDialog from './EmailConfirmCloneDialog';
import EmailSendPreviewDialog from './EmailSendPreviewDialog';
import EmailSendConfirmationDialog from './EmailSendConfirmationDialog';
import EmailConfirmSendDialog from './EmailConfirmSendDialog';
import EmailConfirmSaveDialog from './EmailConfirmSaveDialog';
import { replaceCustomTags } from '../Preview/previewContent';
import plainTextConverter from 'helpers/plainTextConverter';
import { accountUpdateThunk } from 'redux/modules/auth';
import { tabs, dirtycheck, dialogs } from 'decorators';
import validator from 'components/Validator/validator';
import { initialize, getValues } from 'redux-form';
import EmailSendDialog from './EmailSendDialog';
import { BaseComponent } from 'components/Base';
import stringToColor from 'helpers/stringToColor';
import { Preview } from 'components/Preview';
import { Message } from 'components/Message';
import { Spinner } from 'components/Spinner';
import { Row, Col } from 'react-bootstrap';
import EmailActions from './EmailActions';
import { push } from 'react-router-redux';
import React, { PropTypes } from 'react';
import { ConfirmDialog } from '../Modal';
import { connect } from 'react-redux';
import EmailForm from './EmailForm';
import isEqual from 'lodash/isEqual';
import fields from './email.fields';
import schema from './email.schema';
import config from 'config';

const FORM_NAME = 'emailForm';

@tabs({ content: 'html', field: 'email-properties' })
@dialogs()
@dirtycheck()
class EmailDetails extends BaseComponent {

  static propTypes = {
    email: PropTypes.object
  }

  componentDidMount() {
    const { params: { id } } = this.props;
    this.fetchEmail(id);
  }

  componentWillReceiveProps(nextProps) {
    const { params: { id: oldId }, dispatch, list: oldList } = this.props;
    const { params: { id: nextId }, list: nextList } = nextProps;

    const currentEmail = oldList[oldId];
    const nextEmail = nextList[nextId];

    if (!isEqual(currentEmail, nextEmail)) {
      dispatch(initialize(FORM_NAME, nextEmail, fields));
    }
  }

  isEmailDirty() {
    const { form: { emailForm } } = this.props;
    return this.isFormDirty(emailForm);
  }

  async handleTemplateReimport() {
    const { dispatch, params: { id }, form } = this.props;
    const emailDirty = this.isEmailDirty();
    if (emailDirty) {
      const email = getValues(form.emailForm);
      await dispatch(emailUpdateThunk(id, email));
    }
    return await dispatch(emailReimportThunk(id));
  }

  async saveForm(pref) {
    const { user, dispatch, form, params: { id } } = this.props;
    if (pref) {
      dispatch(accountUpdateThunk(user._id, { preferences: { confirmEmailSave: false } }));
    }
    let email = getValues(form.emailForm);
    if (email.autogeneratePlain) {
      const htmlWithFields = replaceCustomTags(email.htmlBody, email.htmlFields);
      email = Object.assign({}, email, { plainBody: plainTextConverter(htmlWithFields) });
    }

    const emailValid = validator.validate(email, schema);
    if (!emailValid) {
      dispatch(emailValidationErrorThunk(validator.error));
      return false;
    }
    await dispatch(emailUpdateThunk(id, email));
    dispatch(initialize(FORM_NAME, email, fields));
    return true;
  }

  async handleFormSave() {
    const { user } = this.props;
    if (user.preferences.confirmEmailSave) {
      return this.openDialog('saveConfirm');
    }
    return await this.saveForm();
  }

  async handleEmailDelete() {
    const { params: { id }, dispatch } = this.props;
    await dispatch(emailDeleteThunk(id));
    await dispatch(push(`${config.urlInfix}/emails`));
  }

  async cloneEmail() {
    const { dispatch, params: { id } } = this.props;
    const clonedEmail = await dispatch(emailCloneThunk(id));
    await dispatch(push(`${config.urlInfix}/emails/${clonedEmail._id}`));
  }

  async handleSaveAndClone() {
    const { dispatch, form, params: { id } } = this.props;
    const newEmail = getValues(form.emailForm);
    const valid = validator.validate(newEmail, schema);
    this.closeDialog('clone');
    if (valid) {
      await dispatch(emailUpdateThunk(id, newEmail));
      await dispatch(initialize(FORM_NAME, newEmail, fields));
      return await this.cloneEmail();
    }
    return dispatch(emailValidationErrorThunk(validator.error));
  }

  async handleLockEmailAction() {
    const { dispatch, params: { id } } = this.props;
    await dispatch(emailLockCreateThunk(id));
  }

  async handleCloneAction() {
    if (this.isEmailDirty()) {
      return this.openDialog('clone');
    }
    return await this.cloneEmail();
  }

  async handleSendConfirm() {
    this.closeDialog('send');
    return await this.openDialog('sendConfirm');
  }

  async handleSaveAndSend(dialogSave, dialogSend) {
    this.closeDialog(dialogSave);
    if (await this.saveForm()) {
      return await this.openDialog(dialogSend);
    }
    return null;
  }

  async handleSendPreviewAction() {
    if (this.isEmailDirty()) {
      return this.openDialog('savePreview');
    }
    return await this.openDialog('preview');
  }

  async handleSendAction() {
    if (this.isEmailDirty()) {
      return this.openDialog('saveSend');
    }
    return this.openDialog('send');
  }

  fetchEmail(id) {
    const { dispatch } = this.props;
    dispatch(emailLoadThunk(id));
  }

  render() {
    const { params: { id }, error, form, emailLoading } = this.props;
    const email = this.props.list[id] || {};
    const { tab } = this.state;
    const { emailForm: { htmlFields = {} } = {} } = form;
    const isSpinning = !email.htmlBody && emailLoading;
    return (
      <Row>
        <Spinner text={"Loading email..."} isVisible={isSpinning} />
        <Col className={isSpinning ? 'hidden' : 'show'} xs={12}>
          <div className="help-block" />
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Row>
                <Col xs={8}>
                  <h4>Editing: {email.name}</h4>
                    {email.campaignName ?
                      <div>
                        <h4>
                          <i
                            className="fa fa-bookmark fa-lg"
                            style={{ color: stringToColor(email.campaign) }}
                          />&nbsp;
                          {email.campaignName}
                        </h4>
                      </div>
                      : ''}
                </Col>
                <Col xs={4}>
                  <EmailActions
                    className="pull-right"
                    onLockEmail={() => this.handleLockEmailAction()}
                    onClone={() => this.handleCloneAction()}
                    onSendPreview={() => this.handleSendPreviewAction()}
                    onSendEmail={() => this.handleSendAction()}
                    onDelete={() => this.openDialog('delete')}
                    onTemplateReimport={() => this.openDialog('reimport')}
                  />
                  {this.state.dialogs.delete &&
                    <EmailConfirmDeleteDialog
                      show={this.state.dialogs.delete}
                      onCancel={() => this.closeDialog('delete')}
                      onConfirm={() => this.handleEmailDelete()}
                    />}
                  {this.state.dialogs.reimport &&
                    <ConfirmDialog
                      show={this.state.dialogs.reimport}
                      text={'This will reimport template in to this email, continue?'}
                      onCancel={() => this.closeDialog('reimport')}
                      onConfirm={() => this.handleTemplateReimport()}
                    />}
                  {this.state.dialogs.clone &&
                    <EmailConfirmCloneDialog
                      show={this.state.dialogs.clone}
                      onCancel={() => this.closeDialog('clone')}
                      onConfirm={() => this.handleSaveAndClone()}
                    />}
                  {this.state.dialogs.savePreview &&
                    <EmailConfirmSendDialog
                      show={this.state.dialogs.savePreview}
                      onCancel={() => this.closeDialog('savePreview')}
                      onConfirm={() => this.handleSaveAndSend('savePreview', 'preview')}
                    />}
                  {this.state.dialogs.preview &&
                    <EmailSendPreviewDialog
                      show={this.state.dialogs.preview}
                      id={id}
                      onHide={() => this.closeDialog('preview')}
                    />}
                  {this.state.dialogs.saveSend &&
                    <EmailConfirmSendDialog
                      show={this.state.dialogs.saveSend}
                      onCancel={() => this.closeDialog('saveSend')}
                      onConfirm={() => this.handleSaveAndSend('saveSend', 'send')}
                    />}
                  {this.state.dialogs.saveConfirm &&
                    <EmailConfirmSaveDialog
                      show={this.state.dialogs.saveConfirm}
                      autogeneratePlain={email.autogeneratePlain}
                      onCancel={() => this.closeDialog('saveConfirm')}
                      onConfirm={(pref) => {
                        this.closeDialog('saveConfirm');
                        this.saveForm(pref);
                      }}
                    />}
                  {this.state.dialogs.send &&
                    <EmailSendDialog
                      show={this.state.dialogs.send}
                      id={id}
                      email={email}
                      onCancel={() => this.closeDialog('send')}
                      onConfirm={() => this.handleSendConfirm()}
                    />}
                  {this.state.dialogs.sendConfirm &&
                    <EmailSendConfirmationDialog
                      show={this.state.dialogs.sendConfirm}
                      id={id}
                      email={email}
                      onHide={() => this.closeDialog('sendConfirm')}
                    />}
                </Col>
              </Row>
              <div className="help-block" />
            </Col>
            <Col xs={6} sm={6} md={3} lg={3}>
              <div>
                <i className="fa fa-floppy-o" /> Saved {email.updatedAt}
              </div>
              <div className="help-block" />
              <div>
                <i className="fa fa-check-circle" /> Everything looks fine
              </div>
            </Col>
            <Col xs={6} sm={6} md={3} lg={3}>
              <div>
                <i className="fa fa-user-times" /> Not submitted for subediting
              </div>
              <div className="help-block" />
              <div>
                <i className="fa fa-paper-plane-o" /> Sent {email.updatedAt}
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={6} lg={6}>
              {error
                  ? <Message type="danger" text={error.message} />
                  : null}
              <EmailForm
                activeFieldTab={tab.field}
                activeContentTab={tab.content}
                onContentTabSelect={(key) => {
                  this.handleTabSelect({ content: key, field: tab.field });
                }}
                onFieldTabSelect={(key) => {
                  this.handleTabSelect({ content: tab.content, field: key });
                }}
                email={email}
                onSubmit={(emailToSave) => this.handleFormSave(emailToSave)}
              />
            </Col>
            <Col xs={12} sm={12} md={6} lg={6}>
              <Preview
                activeTab={tab.content}
                onTabSelect={(key) => this.handleTabSelect({ content: key, field: tab.field })}
                html={email.htmlBody}
                htmlFields={htmlFields.value}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}

@connect((state) => ({
  form: state.form,
  user: state.auth.user,
  list: state.emails.list,
  error: state.emails.error,
  emailLoading: state.emails.emailLoading
}))
export default class EmailDetailsConnected
  extends EmailDetails { }
