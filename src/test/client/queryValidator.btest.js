import { expect } from 'chai';
import { validate } from 'components/Validator/queryValidator';

const validQueries = [{ type: 'CAPI', variableName: 'test', query: 'test', limit: '1DAY' }];

describe('Query validator', () => {
  it('returns true with no error if all validations pass', () => {
    expect(validate(validQueries)).to.eql([true, null]);
  });

  it('returns true with no error if there are no queries', () => {
    expect(validate([])).to.eql([true, null]);
  });

  it('returns false with error if a query has no variable name ', () => {
    const invalid = [{ ...validQueries[0], variableName: null }];
    const result = validate(invalid);
    expect(result).to.contain(false);
    expect(result[1]).to.be.instanceOf(Error);
  });

  it('returns false with error if a variable name has non-alpha characters', () => {
    const invalid = [{ ...validQueries[0], variableName: 'a134' }];
    const result = validate(invalid);
    expect(result).to.contain(false);
    expect(result[1]).to.be.instanceOf(Error);
  });

  it('returns false with error if a variables name is less than 3 chars', () => {
    const invalid = [{ ...validQueries[0], variableName: 'aa' }];
    const result = validate(invalid);
    expect(result).to.contain(false);
    expect(result[1]).to.be.instanceOf(Error);
  });

  it('returns false with error if a variable name is duplicated', () => {
    const invalid = [{ ...validQueries[0] }, { ...validQueries[0] }];
    const result = validate(invalid);
    expect(result).to.contain(false);
    expect(result[1]).to.be.instanceOf(Error);
  });

  it('returns false with error if a query does not exist', () => {
    const invalid = [{ ...validQueries[0], query: null }];
    const result = validate(invalid);
    expect(result).to.contain(false);
    expect(result[1]).to.be.instanceOf(Error);
  });

  it('returns false with error if a query is less than 3 chars', () => {
    const invalid = [{ ...validQueries[0], query: 's' }];
    const result = validate(invalid);
    expect(result).to.contain(false);
    expect(result[1]).to.be.instanceOf(Error);
  });
});
