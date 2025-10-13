import React from 'react';
import { FormikErrors, FormikTouched } from 'formik';

type SwapFormInputValidationErrorDisplayProps = {
  fieldName: string;
  className?: string;
  errors: FormikErrors<object>;
  touched: FormikTouched<object>;
};

export const SwapFormInputValidationErrorDisplay: React.FC<SwapFormInputValidationErrorDisplayProps> =
  ({
    errors,
    touched,
    fieldName,
    className = 'swap-form-input-validation-error-display'
  }) => {
    return (
      <small
        className={className}
        style={{ display: 'flex', flexDirection: 'column' }}
      >
        {fieldName in errors && fieldName in touched && (
          <div
            className='invalid-feedback'
            data-testid={`invalid-${fieldName}`}
            style={{ display: 'flex', marginTop: '8px' }}
          >
            {(errors as any)[fieldName]}
          </div>
        )}
      </small>
    );
  };
