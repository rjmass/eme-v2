import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon/pkg/sinon';
import * as actions from 'redux/modules/substitutions';
import substitutions from 'test/fixtures/substitutions';
// use require for fetcher for sinon/object
const fetcher = require('helpers/fetcher');

const sandbox = sinon.sandbox.create();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);
const [substitution] = substitutions;

describe('Substitution action creators', () => {
  describe('Synchronous', () => {
    describe('Single Substitution creates an action', () => {
      it('to load an substitution', () => {
        const expectedAction = { type: actions.SUBSTITUTION_LOAD };
        expect(actions.substitutionLoad()).to.eql(expectedAction);
      });

      it('when an substitution is loaded', () => {
        const expectedAction = { type: actions.SUBSTITUTION_LOADED, substitution };
        expect(actions.substitutionLoaded(substitution)).to.eql(expectedAction);
      });

      it('when a substitution is deleted', () => {
        const expectedAction = { type: actions.SUBSTITUTION_DELETED, id: substitution._id };
        expect(actions.substitutionDeleted(substitution._id)).to.eql(expectedAction);
      });

      it('when substitution validation fails', () => {
        const error = { message: 'Validation Failed' };
        const expectedAction = { type: actions.SUBSTITUTION_VALIDATION_ERROR, error };
        expect(actions.substitutionValidationError(error)).to.eql(expectedAction);
      });
    });

    describe('Multiple Substitutions creates an action', () => {
      it('to load substitutions', () => {
        const expectedAction = { type: actions.SUBSTITUTIONS_LOAD };
        expect(actions.substitutionsLoad()).to.eql(expectedAction);
      });

      it('when substitutions are loaded', () => {
        const expectedAction = { type: actions.SUBSTITUTIONS_LOADED, substitutions };
        expect(actions.substitutionsLoaded(substitutions)).to.eql(expectedAction);
      });

      it('when substitutions are filtered', () => {
        const filter = { name: 'searchString' };
        const expectedAction = { type: actions.SUBSTITUTIONS_FILTER, filter };
        expect(actions.substitutionsFilter(filter)).to.eql(expectedAction);
      });
    });
  });

  describe('Asynchronous', () => {
    let store;
    beforeEach(() => {
      store = mockStore({ substitutions: [] });
    });
    afterEach(() => {
      sandbox.restore();
    });

    describe('CREATE', () => {
      it('creates SUBSTITUTION_LOADED when creating substitution is done', () => {
        const resSubstitution = { entities: { substitutions: { newid: substitution } } };
        sandbox.stub(fetcher, 'fetcher').returns(resSubstitution);
        const expectedAction = { type: actions.SUBSTITUTION_LOADED, substitution };

        return store.dispatch(actions.substitutionCreateThunk(substitution))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if creating substitution fails', () => {
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.substitutionCreateThunk(substitution))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('DELETE', () => {
      it('creates SUBSTITUTION_DELETED when deleting substitution is done', () => {
        sandbox.stub(fetcher, 'fetcher').returns({});
        const id = substitution._id;
        const expectedAction = { type: actions.SUBSTITUTION_DELETED, id };

        return store.dispatch(actions.substitutionDeleteThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if deleting substitution fails', () => {
        sandbox.stub(fetcher, 'fetcher').throws();
        const id = substitution._id;

        return store.dispatch(actions.substitutionDeleteThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('UPDATE', () => {
      it('creates SUBSTITUTION_LOADED when updating substitution is done', () => {
        const id = substitution._id;
        const resSubstitution = { entities: { substitutions: { [id]: substitution } } };
        sandbox.stub(fetcher, 'fetcher').returns(resSubstitution);
        const expectedAction = { type: actions.SUBSTITUTION_LOADED, substitution };

        return store.dispatch(actions.substitutionUpdateThunk(id, substitution))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[2]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if updating substitution fails', () => {
        const id = substitution._id;
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.substitutionUpdateThunk(id, substitution))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('LOAD', () => {
      describe('Single Substitution', () => {
        it('creates SUBSTITUTION_LOADED when loading substitution is done', () => {
          const id = substitution._id;
          const resSubstitution = { entities: { substitutions: { [id]: substitution } } };
          sandbox.stub(fetcher, 'fetcher').returns(resSubstitution);
          const expectedActions = [
            { type: actions.SUBSTITUTION_LOAD },
            { type: actions.SUBSTITUTION_LOADED, substitution }
          ];

          return store.dispatch(actions.substitutionLoadThunk(id))
            .then(() => {
              expect(store.getActions()).to.eql(expectedActions);
            });
        });

        it('creates error notification if loading substitution fails', () => {
          const id = substitution._id;
          sandbox.stub(fetcher, 'fetcher').throws();

          return store.dispatch(actions.substitutionLoadThunk(id))
            .then(() => {
              const actionList = store.getActions();
              expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
              expect(actionList[2]).to.have.property('type', actions.SUBSTITUTION_SERVER_ERROR);
            });
        });
      });

      describe('Multiple Substitutions', () => {
        it('creates SUBSTITUTIONS_LOADED when loading substitutions is done', () => {
          const id = substitution._id;
          const resSubstitutions = { entities: { substitutions: { [id]: substitution } } };
          sandbox.stub(fetcher, 'fetcher').returns(resSubstitutions);
          const expectedActions = [
            { type: actions.SUBSTITUTIONS_LOAD },
            { type: actions.SUBSTITUTIONS_LOADED,
              substitutions: resSubstitutions.entities.substitutions }
          ];

          return store.dispatch(actions.substitutionsLoadThunk())
            .then(() => {
              expect(store.getActions()).to.eql(expectedActions);
            });
        });

        it('creates error notification if loading substitutions fails', () => {
          sandbox.stub(fetcher, 'fetcher').throws();

          return store.dispatch(actions.substitutionsLoadThunk())
            .then(() => {
              const actionList = store.getActions();
              expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
              expect(actionList[2]).to.have.property('type', actions.SUBSTITUTION_SERVER_ERROR);
            });
        });
      });
    });
  });
});
