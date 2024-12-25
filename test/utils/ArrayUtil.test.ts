import {checkEmpty} from '@/utils/ArrayUtil.ts';

describe('checkEmpty', () => {
  it('normal array', () => {
    const actualResult = checkEmpty(['hello', 'world']);
    const expectedResult = false;
    expect(actualResult).toEqual(expectedResult);
  });

  it('null array', () => {
    const actualResult = checkEmpty(null);
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });

  it('undefined array', () => {
    const actualResult = checkEmpty(undefined);
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });

  it('empty array', () => {
    const actualResult = checkEmpty([]);
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });
});