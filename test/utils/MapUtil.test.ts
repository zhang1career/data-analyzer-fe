import {deepCopyFrom} from '@/utils/MapUtil.ts';

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