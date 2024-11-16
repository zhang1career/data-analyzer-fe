import {checkEmpty, getValueSafely} from '@/utils/ObjUtil.ts';

describe('checkEmpty', () => {
  it('normal object', () => {
    const actualResult = checkEmpty({hello: 'world'});
    const expectedResult = false;
    expect(actualResult).toEqual(expectedResult);
  });

  it('null object', () => {
    const actualResult = checkEmpty(null);
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });

  it('undefined object', () => {
    const actualResult = checkEmpty(undefined);
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });

  it('empty object', () => {
    const actualResult = checkEmpty({});
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });
});


describe('getValueSafely', () => {
  it('normal property', () => {
    const actualResult = getValueSafely({hello: 'world'}, 'hello');
    const expectedResult = 'world';
    expect(actualResult).toEqual(expectedResult);
  });

  it('empty object', () => {
    const actualResult = getValueSafely({hello: ''}, 'hello');
    const expectedResult = '';
    expect(actualResult).toEqual(expectedResult);
  });

  it('null property', () => {
    const actualResult = getValueSafely({hello: null}, 'hello');
    const expectedResult = '';
    expect(actualResult).toEqual(expectedResult);
  });

  it('undefined property', () => {
    const actualResult = getValueSafely({hello: undefined}, 'hello');
    const expectedResult = '';
    expect(actualResult).toEqual(expectedResult);
  });

  it('not exist property', () => {
    const actualResult = getValueSafely({foo: 'bar'}, 'hello');
    const expectedResult = '';
    expect(actualResult).toEqual(expectedResult);
  });

  it('null object', () => {
    const actualResult = getValueSafely(null, 'hello');
    const expectedResult = '';
    expect(actualResult).toEqual(expectedResult);
  });

  it('undefined object', () => {
    const actualResult = getValueSafely(undefined, 'hello');
    const expectedResult = '';
    expect(actualResult).toEqual(expectedResult);
  });

  it('empty object', () => {
    const actualResult = getValueSafely({}, 'hello');
    const expectedResult = '';
    expect(actualResult).toEqual(expectedResult);
  });
});