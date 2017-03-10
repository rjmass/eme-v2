import { expect } from 'chai';
import reducer, * as actions from 'redux/modules/substitutions';
import substitutions from 'test/fixtures/substitutions';
import substitutionsNormalized from 'test/fixtures/substitutionsNormalized';

const initialState = actions.initialState;
const [substitution] = substitutions;

describe('Substitution reducer', () => {
  it('returns an initial state', () => {
    expect(reducer(undefined, {})).to.eql(initialState);
  });

  it('handles SUBSTITUTIONS_LOAD', () => {
    const expectedState = { ...initialState, substitutionsLoading: true };
    expect(reducer(initialState, { type: actions.SUBSTITUTIONS_LOAD })).to.eql(expectedState);
  });

  it('handles SUBSTITUTION_LOADED', () => {
    const expectedState = {
      ...initialState,
      list: { ...initialState.list, [substitution._id]: substitution },
      error: null,
      substitutionLoading: false
    };
    expect(
      reducer(initialState, { type: actions.SUBSTITUTION_LOADED, substitution })
    ).to.eql(expectedState);
  });

  it('handles SUBSTITUTIONS_LOADED', () => {
    const expectedState = {
      ...initialState,
      list: substitutionsNormalized,
      error: null,
      substitutionsLoading: false
    };
    expect(
      reducer(initialState, { type: actions.SUBSTITUTIONS_LOADED,
        substitutions: substitutionsNormalized })
    ).to.eql(expectedState);
  });

  it('handles SUBSTITUTIONS_FILTER', () => {
    const filter = { name: 'example' };
    const expectedState = { ...initialState, filter };
    expect(
      reducer(initialState, { type: actions.SUBSTITUTIONS_FILTER, filter })
    ).to.eql(expectedState);
  });

  it('handles SUBSTITUTION_LOAD', () => {
    const expectedState = { ...initialState, substitutionLoading: true };
    expect(reducer(initialState, { type: actions.SUBSTITUTION_LOAD })).to.eql(expectedState);
  });


  it('handles SUBSTITUTION_VALIDATION_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.SUBSTITUTION_VALIDATION_ERROR, error })
    ).to.eql(expectedState);
  });

  it('handles SUBSTITUTION_SERVER_ERROR', () => {
    const error = { message: 'problem' };
    const expectedState = { ...initialState, error };
    expect(
      reducer(initialState, { type: actions.SUBSTITUTION_SERVER_ERROR, error })
    ).to.eql(expectedState);
  });

  it('handles SUBSTITUTION_DELETED', () => {
    const id = substitution._id;
    const startingState = reducer(initialState,
      { type: actions.SUBSTITUTIONS_LOADED, substitutions: substitutionsNormalized });
    const deletedState = reducer(startingState,
      { type: actions.SUBSTITUTION_DELETED, id });
    expect(Object.keys(startingState.list).length).to.eql(2);
    expect(Object.keys(deletedState.list).length).to.eql(1);
    expect(deletedState.list[id]).to.not.exist;
  });
});
