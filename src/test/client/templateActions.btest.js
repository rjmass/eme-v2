import { expect } from 'chai';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon/pkg/sinon';
import * as actions from 'redux/modules/templates';
import template from 'test/fixtures/template';
import templates from 'test/fixtures/templates';
// use require for fetcher for sinon/object
const fetcher = require('helpers/fetcher');

const sandbox = sinon.sandbox.create();
const middleware = [thunk];
const mockStore = configureMockStore(middleware);

describe('Template action creators', () => {
  describe('Synchronous', () => {
    describe('Single Template creates an action', () => {
      it('to load a template', () => {
        const expectedAction = { type: actions.TEMPLATE_LOAD };
        expect(actions.templateLoad()).to.eql(expectedAction);
      });

      it('when a template is loaded', () => {
        const expectedAction = { type: actions.TEMPLATE_LOADED, template };
        expect(actions.templateLoaded(template)).to.eql(expectedAction);
      });

      it('when a template is deleted', () => {
        const expectedAction = { type: actions.TEMPLATE_DELETED, id: template._id };
        expect(actions.templateDeleted(template._id)).to.eql(expectedAction);
      });

      it('when template validation fails', () => {
        const error = { message: 'Validation Failed' };
        const expectedAction = { type: actions.TEMPLATE_VALIDATION_ERROR, error };
        expect(actions.templateValidationError(error)).to.eql(expectedAction);
      });
    });

    describe('Multiple Templates creates an action', () => {
      it('to load templates', () => {
        const expectedAction = { type: actions.TEMPLATES_LOAD };
        expect(actions.templatesLoad()).to.eql(expectedAction);
      });

      it('when templates are loaded', () => {
        const expectedAction = { type: actions.TEMPLATES_LOADED, templates };
        expect(actions.templatesLoaded(templates)).to.eql(expectedAction);
      });

      it('when templates are filtered', () => {
        const filter = { name: 'searchString' };
        const expectedAction = { type: actions.TEMPLATES_FILTER, filter };
        expect(actions.templatesFilter(filter)).to.eql(expectedAction);
      });
    });
  });

  describe('Asynchronous', () => {
    let store;
    beforeEach(() => {
      store = mockStore({ templates: [] });
    });
    afterEach(() => {
      sandbox.restore();
    });

    describe('CREATE', () => {
      it('creates TEMPLATE_LOADED when creating template is done', () => {
        const resTemplate = { entities: { templates: { newtemplateid: template } } };
        sandbox.stub(fetcher, 'fetcher').returns(resTemplate);
        const expectedAction = { type: actions.TEMPLATE_LOADED, template };

        return store.dispatch(actions.templateCreateThunk(template))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if creating template fails', () => {
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.templateCreateThunk(template))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('DELETE', () => {
      it('creates TEMPLATE_DELETED when deleting template is done', () => {
        sandbox.stub(fetcher, 'fetcher').returns({});
        const id = template._id;
        const expectedAction = { type: actions.TEMPLATE_DELETED, id };

        return store.dispatch(actions.templateDeleteThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if deleting template fails', () => {
        sandbox.stub(fetcher, 'fetcher').throws();
        const id = template._id;

        return store.dispatch(actions.templateDeleteThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('CLONE', () => {
      it('creates TEMPLATE_LOADED when cloning template is done', () => {
        const resTemplate = { entities: { templates: { newtemplateid: template } } };
        const id = template._id;
        sandbox.stub(fetcher, 'fetcher').returns(resTemplate);
        const expectedAction = { type: actions.TEMPLATE_LOADED, template };

        return store.dispatch(actions.templateCloneThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if cloning template fails', () => {
        const id = template._id;
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.templateCloneThunk(id))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('UPDATE', () => {
      it('creates TEMPLATE_LOADED when updating template is done', () => {
        const id = template._id;
        const resTemplate = { entities: { templates: { [id]: template } } };
        sandbox.stub(fetcher, 'fetcher').returns(resTemplate);
        const expectedAction = { type: actions.TEMPLATE_LOADED, template };

        return store.dispatch(actions.templateUpdateThunk(id, template))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList).to.contain(expectedAction);
            expect(actionList[1]).to.have.deep.property('payload.kind', 'success');
          });
      });

      it('creates error notification if updating template fails', () => {
        const id = template._id;
        sandbox.stub(fetcher, 'fetcher').throws();

        return store.dispatch(actions.templateUpdateThunk(id, template))
          .then(() => {
            const actionList = store.getActions();
            expect(actionList[0]).to.have.deep.property('payload.kind', 'danger');
          });
      });
    });

    describe('LOAD', () => {
      describe('Single Template', () => {
        it('creates TEMPLATE_LOADED when loading template is done', () => {
          const id = template._id;
          const resTemplate = { entities: { templates: { [id]: template } } };
          sandbox.stub(fetcher, 'fetcher').returns(resTemplate);
          const expectedActions = [
            { type: actions.TEMPLATE_LOAD },
            { type: actions.TEMPLATE_LOADED, template }
          ];

          return store.dispatch(actions.templateLoadThunk(id))
            .then(() => {
              expect(store.getActions()).to.eql(expectedActions);
            });
        });

        it('creates error notification if loading template fails', () => {
          const id = template._id;
          sandbox.stub(fetcher, 'fetcher').throws();

          return store.dispatch(actions.templateLoadThunk(id))
            .then(() => {
              const actionList = store.getActions();
              expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
              expect(actionList[2]).to.have.property('type', actions.TEMPLATE_SERVER_ERROR);
            });
        });
      });

      describe('Multiple Templates', () => {
        it('creates TEMPLATES_LOADED when loading templates is done', () => {
          const id = template._id;
          const resTemplates = { entities: { templates: { [id]: template } } };
          sandbox.stub(fetcher, 'fetcher').returns(resTemplates);
          const expectedActions = [
            { type: actions.TEMPLATES_LOAD },
            { type: actions.TEMPLATES_LOADED, templates: resTemplates.entities.templates }
          ];

          return store.dispatch(actions.templatesLoadThunk())
            .then(() => {
              expect(store.getActions()).to.eql(expectedActions);
            });
        });

        it('creates error notification if loading templates fails', () => {
          sandbox.stub(fetcher, 'fetcher').throws();

          return store.dispatch(actions.templatesLoadThunk())
            .then(() => {
              const actionList = store.getActions();
              expect(actionList[1]).to.have.deep.property('payload.kind', 'danger');
              expect(actionList[2]).to.have.property('type', actions.TEMPLATE_SERVER_ERROR);
            });
        });
      });
    });
  });
});
