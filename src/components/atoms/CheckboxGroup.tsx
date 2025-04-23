import React from "react";
import { WrappedFieldProps } from "redux-form";
import styled from "styled-components";
import { CheckBox } from "./CheckBoxInput";

type Props = WrappedFieldProps & {
  tabIndex?: number;
  options: Array<{ label: string; value: string }>;
};

const CheckboxGroup: React.FC<Props> = (props: Props) => {
  const { tabIndex, options, input } = props;
  const { name, onChange } = input;
  const inputValue = input.value as string;

  const checkboxes = options.map(({ label, value }, index) => {
    const handleChange = (event?: React.ChangeEvent<HTMLInputElement>) => {
      const arr = [...inputValue];
      if (event && event.target.checked) {
        arr.push(value);
      } else {
        arr.splice(arr.indexOf(value), 1);
      }

      return onChange(arr);
    };

    const checked = inputValue.includes(value);
    const indexConst = index;
    return (
      <label key={`checkbox-${indexConst}`}>
        <CheckBox
          type="checkbox"
          name={`${name}[${indexConst}]`}
          tabIndex={tabIndex}
          value={value}
          checked={checked}
          onChange={handleChange}
          disabled={false}
          isShowEditedColor={false}
          dirty={false}
          isShadowOnFocus
        />
        <span>{label}</span>
      </label>
    );
  });

  return <Wrapper>{checkboxes}</Wrapper>;
};

const Wrapper = styled.div`
  > label {
    margin-right: 20px;
  }
`;

export default CheckboxGroup;
