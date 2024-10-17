import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import path from 'path';
import {
  readFileAsynchronously,
  doStuffByTimeout,
  doStuffByInterval,
} from './index';

jest.mock('fs', () => ({
  existsSync: jest.fn(),
}));
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));
jest.mock('path', () => ({
  join: jest.fn().mockReturnValue('mockedPath'),
}));

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const timeout = 1000;

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, timeout);

    expect(jest.getTimerCount()).toBe(1);
    jest.runOnlyPendingTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();
    jest.runAllTimers();
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  const interval = 1000;

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, interval);

    jest.advanceTimersByTime(3000);
    expect(callback).toHaveBeenCalledTimes(3);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();
    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    await readFileAsynchronously('file.txt');
    expect(path.join).toHaveBeenCalledWith(__dirname, 'file.txt');
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    const result = await readFileAsynchronously('file.txt');
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    const content = 'Hello world';
    const mockContent = Buffer.from(content);
    (readFile as jest.Mock).mockResolvedValue(mockContent);

    const result = await readFileAsynchronously('file.txt');
    expect(result).toBe(content);
  });
});
