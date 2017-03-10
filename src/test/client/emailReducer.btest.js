import { expect } from 'chai';
import reducer, * as actions from 'redux/modules/emails';
import email from 'test/fixtures/email';
import emails from 'test/fixtures/emails';
import emailsNormalized from 'test/fixtures/emailsNormalized';

const initialState = actions.initialState;

describe('Email reducer', () => {
  it('returns an initial state', () => {
    expect(reducer(undefined, {})).to.eql(initialState);
  });

  it('handles EMAILS_LOAD', () => {
    const expectedState = { ...initialState, listLoading: true };
    expect(reducer(initialState, { type: actions.EMAILS_LOAD })).to.eql(expectedState);
  });

  it('handles EMAILS_LOADED', () => {
    const expectedState = { ...initialState, list: emails, error: null, listLoading: false };
    expect(
      reducer(initialState, { type: actions.EMAILS_LOADED, emails })
    ).to.eql(expectedState);
  });

  it('handles EMAILS_FILTER', () => {
    const filter = { name: 'example' };
    const expectedState = { ...initialState, filter };
    expect(
      reducer(initialState, { type: actions.EMAILS_FILTER, filter })
    ).to.eql(expectedState);
  });

  it('handles EMAIL_LOAD', () => {
    const id = '123';
    const expectedState = { ...initialState, emailLoading: true, currentEmailId: id };
    expect(reducer(initialState, { type: actions.EMAIL_LOAD, id })).to.eql(expectedState);
  });

  it('handles EMAIL_LOADED', () => {
    const expectedState = {
      ...initialState,
      list: { ...initialState.list, [email._id]: email },
      error: null,
      currentContentPanel: '0',
      emailLoading: false
    };
    expect(
      reducer(initialState, { type: actions.EMAIL_LOADED, email })
    ).to.eql(expectedState);
  });

  it('handles EMAIL_CONTENT_PANEL_CHANGED', () => {
    const newPanelKey = 2;
    const startingState = reducer(initialState, { type: actions.EMAIL_LOADED, email });
    const expectedState = { ...startingState, currentContentPanel: newPanelKey };
    expect(
      reducer(startingState, { type: actions.EMAIL_CONTENT_PANEL_CHANGED, panelKey: newPanelKey }))
      .to.eql(expectedState);
  });

  it('handles EMAIL_DELETED', () => {
    const id = emails[0]._id;
    const startingState = reducer(initialState,
      { type: actions.EMAILS_LOADED, emails: emailsNormalized });
    const deletedState = reducer(startingState,
      { type: actions.EMAIL_DELETED, id });
    expect(Object.keys(startingState.list).length).to.eql(2);
    expect(Object.keys(deletedState.list).length).to.eql(1);
    expect(deletedState.list[id]).to.not.exist;
  });

  it('handles EMAIL_VALIDATION_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.EMAIL_VALIDATION_ERROR, error })
    ).to.eql(expectedState);
  });

  it('handles EMAIL_SERVER_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.EMAIL_SERVER_ERROR, error })
    ).to.eql(expectedState);
  });
});
