import {checkEmpty} from '@/utils/StrUtil.ts';

describe('checkEmpty', () => {
  it('normal string', () => {
    const actualResult = checkEmpty('hello');
    const expectedResult = false;
    expect(actualResult).toEqual(expectedResult);
  });

  it('null string', () => {
    const actualResult = checkEmpty(null);
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });

  it('undefined string', () => {
    const actualResult = checkEmpty(undefined);
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });

  it('empty string', () => {
    const actualResult = checkEmpty('');
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });
});