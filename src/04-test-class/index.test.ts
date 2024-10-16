import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
} from './index';

import { random } from 'lodash';
jest.mock('lodash');
beforeEach(() => {
  jest.clearAllMocks();
});

const initialBalance = 1000;
describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const account = getBankAccount(initialBalance);
    const balance = account.getBalance();
    expect(balance).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const account = getBankAccount(initialBalance);
    expect(() => account.withdraw(initialBalance + 100)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const accountFrom = getBankAccount(initialBalance);
    const accountTo = getBankAccount(initialBalance);
    expect(() => accountFrom.transfer(initialBalance + 200, accountTo)).toThrow(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring to the same account', () => {
    const account = getBankAccount(initialBalance);
    expect(() => account.transfer(100, account)).toThrow(TransferFailedError);
  });

  test('should deposit money', () => {
    const deposit = 500;
    const account = getBankAccount(initialBalance);
    account.deposit(deposit);
    expect(account.getBalance()).toBe(initialBalance + deposit);
  });

  test('should withdraw money', () => {
    const withdrawalAmount = 200;
    const account = getBankAccount(initialBalance);
    account.withdraw(withdrawalAmount);
    expect(account.getBalance()).toBe(initialBalance - withdrawalAmount);
  });

  test('should transfer money', () => {
    const transferAmount = 300;
    const accountFrom = getBankAccount(initialBalance);
    const accountTo = getBankAccount(initialBalance);
    accountFrom.transfer(transferAmount, accountTo);
    expect(accountFrom.getBalance()).toBe(initialBalance - transferAmount);
    expect(accountTo.getBalance()).toBe(initialBalance + transferAmount);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const expectedBalance = 100;
    (random as jest.Mock)
      .mockReturnValueOnce(expectedBalance)
      .mockReturnValueOnce(1);

    const account = getBankAccount(initialBalance);
    const balance = await account.fetchBalance();
    expect(balance).toBe(expectedBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const expectedBalance = 100;
    (random as jest.Mock)
      .mockReturnValueOnce(expectedBalance)
      .mockReturnValueOnce(1);

    const account = getBankAccount(initialBalance);
    await account.synchronizeBalance();
    const balance = account.getBalance();

    expect(balance).toBe(expectedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    (random as jest.Mock).mockReturnValueOnce(0).mockReturnValueOnce(0);

    const account = getBankAccount(initialBalance);
    await expect(account.synchronizeBalance()).rejects.toThrow(
      SynchronizationFailedError,
    );
  });
});
