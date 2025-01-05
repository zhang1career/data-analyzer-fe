import {checkEmpty, deepCopyFrom} from '@/utils/MapUtil.ts';

describe('checkEmpty', () => {
  it('normal map', () => {
    const actualResult = checkEmpty(new Map([['hello', 'world']]));
    const expectedResult = false;
    expect(actualResult).toEqual(expectedResult);
  });

  it('null map', () => {
    const actualResult = checkEmpty(null);
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });

  it('undefined map', () => {
    const actualResult = checkEmpty(undefined);
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });

  it('empty map', () => {
    const actualResult = checkEmpty(new Map());
    const expectedResult = true;
    expect(actualResult).toEqual(expectedResult);
  });
});


describe('deepCopyFrom', () => {
  it('simple value', () => {
    const actualResult = deepCopyFrom('hello');
    const expectedResult = 'hello';
    expect(actualResult).toEqual(expectedResult);
  });

  it('normal object', () => {
    const actualResult = deepCopyFrom({hello: 'world'});
    const expectedResult = new Map([['hello', 'world']]);
    expect(actualResult).toEqual(expectedResult);
  });

  it('array object', () => {
    const actualResult = deepCopyFrom({hello: ['world']});
    const expectedResult = new Map([['hello', ['world']]]);
    expect(actualResult).toEqual(expectedResult);
  });

  it('nested object', () => {
    const actualResult = deepCopyFrom({
      key1: 'value1',
      key2: {
        key3: 'value3',
        key4: {
          key5: 'value5'
        }
      }
    });
    const expectedResult = new Map<string, any>([
      ['key1', 'value1'],
      ['key2', new Map<string, any>([
        ['key3', 'value3'],
        ['key4', new Map<string, any>([
          ['key5', 'value5']
        ])]
      ])]
    ]);
    expect(actualResult).toEqual(expectedResult);
  });

  it('null object', () => {
    const actualResult = deepCopyFrom(null);
    const expectedResult = new Map();
    expect(actualResult).toEqual(expectedResult);
  });

  it('undefined object', () => {
    const actualResult = deepCopyFrom(undefined);
    const expectedResult = new Map();
    expect(actualResult).toEqual(expectedResult);
  });

  it('empty object', () => {
    const actualResult = deepCopyFrom({});
    const expectedResult = new Map();
    expect(actualResult).toEqual(expectedResult);
  });
});