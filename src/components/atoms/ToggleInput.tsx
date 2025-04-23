import React from "react";
import { WrappedFieldProps } from "redux-form";
import Toggle from "./Toggle";

type Props = WrappedFieldProps &
  React.InputHTMLAttributes<HTMLInputElement> & {
    confirmation?: (checked: boolean) => void;
    smallSize?: boolean;
  };

const ToggleInput = (props: Props) => {
  const { input, confirmation, tabIndex, disabled, smallSize } = props;
  return (
    <Toggle
      checked={!!input.value}
      onChange={(checked) => {
        if (confirmation) {
          confirmation(checked);
        } else {
          input.onChange(checked);
        }
      }}
      tabIndex={tabIndex}
      disabled={disabled}
      smallSize={smallSize}
    />
  );
};

export default ToggleInput;
