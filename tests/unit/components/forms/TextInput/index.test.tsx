import React from 'react';
import { render } from '@testing-library/react';
import TextInput from '../../../../../src/components/forms/TextInput';

const getDefaultProps = (): any => {
  return {
    required: true,
    testId: 'textInputTestId',
    label: 'TextInput',
    displayMode: false
  };
};

describe('Test Text Input component', () => {
  test('TextInput Component renders with required', () => {
    const props = getDefaultProps();
    const TextInputComponent = render(<TextInput {...props} />);
    expect(TextInputComponent.getByTestId('textInputTestId')).toHaveAttribute('required');

    props.required = false;
    TextInputComponent.rerender(<TextInput {...props} />);
    expect(TextInputComponent.getByTestId('textInputTestId')).not.toHaveAttribute('required');
  });

  test('TextInput Component renders with disabled', () => {
    const props = getDefaultProps();
    props.disabled = true;
    const TextInputComponent = render(<TextInput {...props} />);
    expect(TextInputComponent.getByTestId('textInputTestId')).toHaveAttribute('disabled');

    props.disabled = false;
    TextInputComponent.rerender(<TextInput {...props} />);
    expect(TextInputComponent.getByTestId('textInputTestId')).not.toHaveAttribute('disabled');
  });

  test('TextInput Component renders with readonly', () => {
    const props = getDefaultProps();
    props.readOnly = true;
    const TextInputComponent = render(<TextInput {...props} />);
    expect(TextInputComponent.getByTestId('textInputTestId')).toHaveAttribute('readonly');

    props.readOnly = false;
    TextInputComponent.rerender(<TextInput {...props} />);
    expect(TextInputComponent.getByTestId('textInputTestId')).not.toHaveAttribute('readonly');
  });

  test('TextInput Component renders with label', () => {
    const props = getDefaultProps();
    const { getByText } = render(<TextInput {...props} />);
    const labelDiv = getByText('TextInput');
    expect(labelDiv).toBeVisible();
  });

  test('TextInput Component renders with displayMode as LabelsLeft', () => {
    const props = getDefaultProps();
    props.value = 'Hi there!';
    props.displayMode = 'LABELS_LEFT';
    const { getByText } = render(<TextInput {...props} />);
    const readOnlySpan = getByText('Hi there!');
    expect(readOnlySpan).toBeVisible();
  });
});
