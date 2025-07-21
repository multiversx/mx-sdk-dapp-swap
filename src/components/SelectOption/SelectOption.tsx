import React from 'react';
import { EsdtType } from 'types';
import { meaningfulFormatAmount, roundAmount } from 'utils';

interface SelectOptionType {
  label: string;
  value: string;
  token: EsdtType;
  isDisabled: boolean;
  inDropdown?: boolean;
  handleDisabledOptionClick?: any;
}

export const SelectOption = ({
  value,
  token,
  isDisabled,
  inDropdown = false,
  handleDisabledOptionClick
}: SelectOptionType) => {
  const handleOnClick = (e: any) => {
    return;
    if (isDisabled && handleDisabledOptionClick) {
      handleDisabledOptionClick(e);
    }
  };

  const tokenStyle = {
    flexShrink: 0,
    display: 'flex',
    width: '3.25rem',
    height: '3.25rem',
    borderRadius: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2b2d2e',
    border: '1px solid #49494d'
  };

  return (
    <div
      className={`dapp-core-swap-select-option ${isDisabled ? 'disabled' : ''}`}
      onClick={handleOnClick}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row'
        }}
      >
        <div
          className='token-image'
          style={{ marginRight: '8px', display: 'flex' }}
        >
          <img
            alt={value}
            style={tokenStyle}
            className='token-symbol'
            src={token?.assets?.svgUrl}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {token.ticker}{' '}
          <small style={{ color: '#49494d' }}>
            {roundAmount(token.price ?? '0')}
          </small>
        </div>
      </div>

      {inDropdown && (
        <div
          style={{
            display: 'flex',
            alignItems: 'end',
            marginLeft: '16px',
            flexDirection: 'column'
          }}
        >
          {meaningfulFormatAmount({
            amount: token.balance ?? '',
            decimals: token.decimals
          })}

          {/* {token.totalUsdPrice && (
            <small style={{ color: '#49494d' }}>
              {token.totalUsdPrice !== '$0' ? <>≈&nbsp;</> : <></>}
              {token.totalUsdPrice}
            </small>
          )} */}
        </div>
      )}
    </div>
  );
};
