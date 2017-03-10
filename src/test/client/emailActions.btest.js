import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon/pkg/sinon';
import * as actions from 'redux/modules/emails';
import email from 'test/fixtures/email';
import emails from 'test/fixtures/emails';
// use require for fetcher for sinon/object
const fetcher = require('helpers/fetcher');

const sandbox = sinon.sandbox.create();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Email action creators', () => {
  describe('Synchronous', () => {
    describe('Single Email creates an action', () => {
      it('to load an email', () => {
        const id = '123';
        const expectedAction = { type: actions.EMAIL_LOAD, id };
        expect(actions.emailLoad(id)).to.eql(expectedAction);
      });

      it('when an email is loaded', () => {
        const expectedAction = { type: actions.EMAIL_LOADED, email };
        expect(actions.emailLoaded(email)).to.eql(expectedAction);
      });

      it('when an email is deleted', () => {
        const expectedAction = { type: actions.EMAIL_DELETED, id: email._id };
        expect(actions.emailDeleted(email._id)).to.eql(expectedAction);
      });

      it('when email validation fails', () => {
        const error = { message: 'Validation Failed' };
        const expectedAction = { type: actions.EMAIL_VALIDATION_ERROR, error };
        expect(actions.emailValidationError(error)).to.eql(expectedAction);
      });
    });

    describe('Multiple Emails creates an action', () => {
      it('to load emails', () => {
        const expectedAction = { type: actions.EMAILS_LOAD };
        expect(actions.emailsLoad()).to.eql(expectedAction);
      });

      it('when emails are loaded', () => {
        const expectedAction = { type: actions.EMAILS_LOADED, emails };
        expect(actions.emailsLoaded(emails)).to.eql(expectedAction);
      });

      it('when emails are filtered', () => {
        const filter = 'searchString';
        const expectedAction = { type: actions.EMAILS_FILTER, filter };
        expect(actions.emailsFilter(filter)).to.eql(expectedAction);
      });
    });
  });

  describe('Asynchronous', () => {
    let store;
    beforeEach(() => {
      store = mockStore({ emails: [] });
    });
    afterEach(() => {
      sandbox.restore();
    });

    describe('CREATE', () => {
      it('creates EMAIL_LOADED when creating email is done', () => {
        const resEmail = { entities: { emails: { newemailid: email } } };
        sandbox.stub(fetcher, 'fetcher').returns(resEmail);
        const expectedAction = { type: actions.EMAIL_LOADED, email };

        return store.dispatch(actions.emailCreateThunk(email))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if creating email fails', () => {
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.emailCreateThunk(email))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('DELETE', () => {
      it('creates EMAIL_DELETED when deleting email is done', () => {
        sandbox.stub(fetcher, 'fetcher').returns({});
        const id = email._id;
        const expectedAction = { type: actions.EMAIL_DELETED, id };

        return store.dispatch(actions.emailDeleteThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[2]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if deleting email fails', () => {
        sandbox.stub(fetcher, 'fetcher').throws();
        const id = email._id;

        return store.dispatch(actions.emailDeleteThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('CLONE', () => {
      it('creates EMAIL_LOADED when cloning email is done', () => {
        const resEmail = { entities: { emails: { newemailid: email } } };
        const id = email._id;
        sandbox.stub(fetcher, 'fetcher').returns(resEmail);
        const expectedAction = { type: actions.EMAIL_LOADED, email };

        return store.dispatch(actions.emailCloneThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if cloning email fails', () => {
        const id = email._id;
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.emailCloneThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('UPDATE', () => {
      it('creates EMAIL_UPDATED when updating email is done', () => {
        const id = email._id;
        const resEmail = { entities: { emails: { [id]: email } } };
        sandbox.stub(fetcher, 'fetcher').returns(resEmail);
        const expectedAction = { type: actions.EMAIL_UPDATED, email };

        return store.dispatch(actions.emailUpdateThunk(id, email))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[2]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if updating email fails', () => {
        const id = email._id;
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.emailUpdateThunk(id, email))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('LOAD', () => {
      describe('Single Email', () => {
        it('creates EMAIL_LOADED when loading email is done', () => {
          const id = email._id;
          const resEmail = { entities: { emails: { [id]: email } } };
          sandbox.stub(fetcher, 'fetcher').returns(resEmail);
          const expectedActions = [
            { type: actions.EMAIL_LOAD, id },
            { type: actions.EMAIL_LOADED, email }
          ];

          return store.dispatch(actions.emailLoadThunk(id))
            .then(() => {
              expect(store.getActions()).to.eql(expectedActions);
            });
        });

        it('creates error notification if loading email fails', () => {
          const id = email._id;
          sandbox.stub(fetcher, 'fetcher').throws();

          return store.dispatch(actions.emailLoadThunk(id))
            .then(() => {
              const actionList = store.getActions();
              expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
              expect(actionList[2]).to.have.property('type', actions.EMAIL_SERVER_ERROR);
            });
        });
      });

      describe('Multiple Emails', () => {
        it('creates EMAILS_LOADED when loading emails is done', () => {
          const id = email._id;
          const resEmails = { entities: { emails: { [id]: email } } };
          sandbox.stub(fetcher, 'fetcher').returns(resEmails);
          const expectedActions = [
            { type: actions.EMAILS_LOAD },
            { type: actions.EMAILS_LOADED, emails: resEmails.entities.emails }
          ];

          return store.dispatch(actions.emailsLoadThunk())
            .then(() => {
              expect(store.getActions()).to.eql(expectedActions);
            });
        });

        it('creates error notification if loading emails fails', () => {
          sandbox.stub(fetcher, 'fetcher').throws();

          return store.dispatch(actions.emailsLoadThunk())
            .then(() => {
              const actionList = store.getActions();
              expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
              expect(actionList[2]).to.have.property('type', actions.EMAIL_SERVER_ERROR);
            });
        });
      });
    });
  });
});
