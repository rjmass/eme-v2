import { expect } from 'chai';

import getLodashVars from '../../helpers/getLodashVars';

describe('Lodash Template Variable Getter', () => {
  it('it should return an empty array if template has no vars', () => {
    expect(getLodashVars('')).to.be.empty;
    expect(getLodashVars('hello')).to.be.empty;
  });

  it('it should retrieve interpolated vars', () => {
    const oneVarWithoutSpaces = getLodashVars('<%=hello%>');
    const oneVarWithSpaces = getLodashVars('<%= hello %>');
    const twoVarsMixedSpacing = getLodashVars('<%= hello %><%=bye%>');
    const threeVarsWithoutSpaces = getLodashVars('<%=hello%><%=bye%><%=world%>');
    const threeVarsWithSpaces = getLodashVars('<%= hello %><%= bye %><%= world %>');

    expect(oneVarWithoutSpaces).to.eql(['hello']);
    expect(oneVarWithSpaces).to.eql(['hello']);
    expect(twoVarsMixedSpacing).to.eql(['hello', 'bye']);
    expect(threeVarsWithoutSpaces).to.eql(['hello', 'bye', 'world']);
    expect(threeVarsWithSpaces).to.eql(['hello', 'bye', 'world']);
  });

  it('it should retrieve escaped vars', () => {
    const oneVarWithoutSpaces = getLodashVars('<%-hello%>');
    const oneVarWithSpaces = getLodashVars('<%- hello %>');
    const twoVarsMixedSpacing = getLodashVars('<%- hello %><%-bye%>');
    const threeVarsWithoutSpaces = getLodashVars('<%-hello%><%-bye%><%-world%>');
    const threeVarsWithSpaces = getLodashVars('<%- hello %><%- bye %><%- world %>');

    expect(oneVarWithoutSpaces).to.eql(['hello']);
    expect(oneVarWithSpaces).to.eql(['hello']);
    expect(twoVarsMixedSpacing).to.eql(['hello', 'bye']);
    expect(threeVarsWithoutSpaces).to.eql(['hello', 'bye', 'world']);
    expect(threeVarsWithSpaces).to.eql(['hello', 'bye', 'world']);
  });

  it('it should retrieve vars from truthy conditions', () => {
    const ifVarWithoutSpaces = getLodashVars('<%if(name){%>');
    const ifVarWithSpaces = getLodashVars('<% if ( name ) { %>');

    expect(ifVarWithoutSpaces).to.eql(['name']);
    expect(ifVarWithSpaces).to.eql(['name']);
  });

  it('it should remove duplicates', () => {
    const twoUniques = getLodashVars('<%=hello%><%=bye%><%-bye%><%=hello%>');

    expect(twoUniques).to.eql(['hello', 'bye']);
  });
});
