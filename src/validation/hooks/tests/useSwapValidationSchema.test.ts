import { renderHook } from '@testing-library/react';
import { EsdtType } from 'types';
import { useSwapValidationSchema } from '../useSwapValidationSchema';

const token = {
  identifier: 'MEX-455c57',
  decimals: 18,
  balance: '1000000000000000000' // 1 MEX
} as EsdtType;

const firstToken = { value: token.identifier, label: token.identifier, token };
const secondToken = { value: 'USDC-c76f1f', label: 'USDC-c76f1f' };

const activeRoute = { amountIn: '1', tokenInID: token.identifier };

const renderSchema = (props = {}) =>
  renderHook(() =>
    useSwapValidationSchema({ firstToken, secondToken, ...props })
  ).result.current;

describe('useSwapValidationSchema', () => {
  it('accepts a fully valid form', async () => {
    const schema = renderSchema();

    await expect(
      schema.validate({ firstAmount: '0.5', secondAmount: '2', activeRoute })
    ).resolves.toBeDefined();
  });

  it('rejects a missing amount with the amount rule message', async () => {
    const schema = renderSchema();

    await expect(
      schema.validate({ firstAmount: '', secondAmount: '2', activeRoute })
    ).rejects.toThrow('Amount required');
  });

  it('rejects a non-numeric amount', async () => {
    const schema = renderSchema();

    await expect(
      schema.validate({ firstAmount: '1.2.3', secondAmount: '2', activeRoute })
    ).rejects.toThrow('Only digits and one . allowed');
  });

  it('rejects an amount above the token balance', async () => {
    const schema = renderSchema();

    await expect(
      schema.validate({ firstAmount: '2', secondAmount: '2', activeRoute })
    ).rejects.toThrow('Insufficient funds');
  });

  it('rejects an amount below the minimum accepted amount', async () => {
    const schema = renderSchema({ minAcceptedAmount: 0.5 });

    await expect(
      schema.validate({ firstAmount: '0.1', secondAmount: '2', activeRoute })
    ).rejects.toThrow('Minimum amount: 0.5');
  });

  it('rejects a missing active route', async () => {
    const schema = renderSchema();

    await expect(
      schema.validate({ firstAmount: '0.5', secondAmount: '2' })
    ).rejects.toThrow('Required');
  });

  it('applies caller-supplied validations', async () => {
    const schema = renderSchema({
      firstTokenValidations: [
        {
          name: 'custom',
          message: 'Custom rule failed',
          test: (value?: string) => value !== '0.5'
        }
      ]
    });

    await expect(
      schema.validate({ firstAmount: '0.5', secondAmount: '2', activeRoute })
    ).rejects.toThrow('Custom rule failed');
  });
});
