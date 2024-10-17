import { generateLinkedList } from './index';

describe('generateLinkedList', () => {
  const input = ['a', 'b', 'c'];
  // Check match by expect(...).toStrictEqual(...)
  test('should generate linked list from values 1', () => {
    const expectedLinkedList = {
      value: 'a',
      next: {
        value: 'b',
        next: {
          value: 'c',
          next: {
            value: null,
            next: null,
          },
        },
      },
    };

    const result = generateLinkedList(input);
    expect(result).toStrictEqual(expectedLinkedList);
  });

  // Check match by comparison with snapshot
  test('should generate linked list from values 2', () => {
    const resultList = generateLinkedList(input);
    expect(resultList).toMatchSnapshot();
  });
});
