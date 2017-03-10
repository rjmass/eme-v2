import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon/pkg/sinon';
import * as actions from 'redux/modules/snippets';
import snippet from 'test/fixtures/snippet';
import snippets from 'test/fixtures/snippets';
// use require for fetcher for sinon/object
const fetcher = require('helpers/fetcher');

const sandbox = sinon.sandbox.create();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Snippet action creators', () => {
  describe('Synchronous', () => {
    describe('Single Snippet creates an action', () => {
      it('to load an snippet', () => {
        const expectedAction = { type: actions.SNIPPET_LOAD };
        expect(actions.snippetLoad()).to.eql(expectedAction);
      });

      it('when an snippet is loaded', () => {
        const expectedAction = { type: actions.SNIPPET_LOADED, snippet };
        expect(actions.snippetLoaded(snippet)).to.eql(expectedAction);
      });

      it('when an snippet is deleted', () => {
        const expectedAction = { type: actions.SNIPPET_DELETED, id: snippet._id };
        expect(actions.snippetDeleted(snippet._id)).to.eql(expectedAction);
      });

      it('when snippet validation fails', () => {
        const error = { message: 'Validation Failed' };
        const expectedAction = { type: actions.SNIPPET_VALIDATION_ERROR, error };
        expect(actions.snippetValidationError(error)).to.eql(expectedAction);
      });
    });

    describe('Multiple Snippets creates an action', () => {
      it('to load snippets', () => {
        const expectedAction = { type: actions.SNIPPETS_LOAD };
        expect(actions.snippetsLoad()).to.eql(expectedAction);
      });

      it('when snippets are loaded', () => {
        const expectedAction = { type: actions.SNIPPETS_LOADED, snippets };
        expect(actions.snippetsLoaded(snippets)).to.eql(expectedAction);
      });

      it('when snippets are filtered', () => {
        const filter = { name: 'searchString' };
        const expectedAction = { type: actions.SNIPPETS_FILTER, filter };
        expect(actions.snippetsFilter(filter)).to.eql(expectedAction);
      });
    });
  });

  describe('Asynchronous', () => {
    let store;
    beforeEach(() => {
      store = mockStore({ snippets: [] });
    });
    afterEach(() => {
      sandbox.restore();
    });

    describe('CREATE', () => {
      it('creates SNIPPET_LOADED when creating snippet is done', () => {
        const resSnippet = { entities: { snippets: { newsnippetid: snippet } } };
        sandbox.stub(fetcher, 'fetcher').returns(resSnippet);
        const expectedAction = { type: actions.SNIPPET_LOADED, snippet };

        return store.dispatch(actions.snippetCreateThunk(snippet))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if creating snippet fails', () => {
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.snippetCreateThunk(snippet))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('DELETE', () => {
      it('creates SNIPPET_DELETED when deleting snippet is done', () => {
        sandbox.stub(fetcher, 'fetcher').returns({});
        const id = snippet._id;
        const expectedAction = { type: actions.SNIPPET_DELETED, id };

        return store.dispatch(actions.snippetDeleteThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if deleting snippet fails', () => {
        sandbox.stub(fetcher, 'fetcher').throws();
        const id = snippet._id;

        return store.dispatch(actions.snippetDeleteThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('CLONE', () => {
      it('creates SNIPPET_LOADED when cloning snippet is done', () => {
        const resSnippet = { entities: { snippets: { newsnippetid: snippet } } };
        const id = snippet._id;
        sandbox.stub(fetcher, 'fetcher').returns(resSnippet);
        const expectedAction = { type: actions.SNIPPET_LOADED, snippet };

        return store.dispatch(actions.snippetCloneThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if cloning snippet fails', () => {
        const id = snippet._id;
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.snippetCloneThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('UPDATE', () => {
      it('creates SNIPPET_LOADED when updating snippet is done', () => {
        const id = snippet._id;
        const resSnippet = { entities: { snippets: { [id]: snippet } } };
        sandbox.stub(fetcher, 'fetcher').returns(resSnippet);
        const expectedAction = { type: actions.SNIPPET_LOADED, snippet };

        return store.dispatch(actions.snippetUpdateThunk(id, snippet))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if updating snippet fails', () => {
        const id = snippet._id;
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.snippetUpdateThunk(id, snippet))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('LOAD', () => {
      describe('Single Snippet', () => {
        it('creates SNIPPET_LOADED when loading snippet is done', () => {
          const id = snippet._id;
          const resSnippet = { entities: { snippets: { [id]: snippet } } };
          sandbox.stub(fetcher, 'fetcher').returns(resSnippet);
          const expectedActions = { type: actions.SNIPPET_LOADED, snippet };

          return store.dispatch(actions.snippetLoadThunk(id))
            .then(() => {
              expect(store.getActions()).to.contain(expectedActions);
            });
        });

        it('creates error notification if loading snippet fails', () => {
          const id = snippet._id;
          sandbox.stub(fetcher, 'fetcher').throws();

          return store.dispatch(actions.snippetLoadThunk(id))
            .then(() => {
              const actionList = store.getActions();
              expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
              expect(actionList[1]).to.have.property('type', actions.SNIPPET_SERVER_ERROR);
            });
        });
      });

      describe('Multiple Snippets', () => {
        it('creates SNIPPETS_LOADED when loading snippets is done', () => {
          const id = snippet._id;
          const resSnippets = { entities: { snippets: { [id]: snippet } } };
          sandbox.stub(fetcher, 'fetcher').returns(resSnippets);
          const expectedActions = [
            { type: actions.SNIPPETS_LOAD },
            { type: actions.SNIPPETS_LOADED, snippets: resSnippets.entities.snippets }
          ];

          return store.dispatch(actions.snippetsLoadThunk())
            .then(() => {
              expect(store.getActions()).to.eql(expectedActions);
            });
        });

        it('creates error notification if loading snippets fails', () => {
          sandbox.stub(fetcher, 'fetcher').throws();

          return store.dispatch(actions.snippetsLoadThunk())
            .then(() => {
              const actionList = store.getActions();
              expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
              expect(actionList[2]).to.have.property('type', actions.SNIPPET_SERVER_ERROR);
            });
        });
      });
    });
  });
});
