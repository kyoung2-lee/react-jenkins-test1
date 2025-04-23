import React, { useEffect, useRef, useState } from "react";
import { WrappedFieldProps } from "redux-form";
import Select, { createFilter, components } from "react-select";
import { ValueType, ActionMeta } from "react-select/src/types";
import { StylesConfig } from "react-select/src/styles";
import color from "../../styles/colorStyle";

export type OptionType = { label: string; value: string | boolean; isDisabled?: boolean; color?: string; isSelected?: boolean };

type Props = WrappedFieldProps & {
  tabIndex?: number;
  options: Array<OptionType>;
  width: number | string;
  height?: number | string;
  placeholder?: string;
  menuWidth?: number;
  menuLeft?: number;
  hasBlank?: boolean;
  isForceError?: boolean;
  isShadowOnFocus?: boolean;
  isShowEditedColor?: boolean;
  disabled?: boolean;
  disabledSimpleColor?: boolean; // disabledの場合、黒枠にする
  onSelect?: () => void;
  autoFocus?: boolean;
  maxMenuHeight?: number;
  isSearchable?: boolean;
  isMulti?: boolean;
  componentOnKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
  onFocus?: () => void;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
};

const SelectBox: React.FC<Props> = (props) => {
  const optionHeight = 34;
  const selectRef = useRef<Select<OptionType>>(null);
  const [doFocusOnUpdated, setDoFocusOnUpdated] = useState(false);

  const {
    tabIndex,
    options,
    width,
    height,
    input,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    meta: { error, touched, submitFailed, dirty },
    isForceError,
    isShadowOnFocus,
    isShowEditedColor,
    menuWidth,
    menuLeft,
    placeholder = "",
    hasBlank = false,
    disabled = false,
    disabledSimpleColor = false,
    isSearchable = false,
    maxMenuHeight,
    isMulti,
    autoFocus,
    fontFamily,
    fontSize,
    fontWeight,
  } = props;

  useEffect(() => {
    if (doFocusOnUpdated) {
      if (selectRef.current) {
        selectRef.current.focus();
      }
      setDoFocusOnUpdated(false);
    }
  }, [doFocusOnUpdated]);

  const handleChange = (inputValue: ValueType<OptionType, boolean>, actionMeta: ActionMeta<OptionType>) => {
    setDoFocusOnUpdated(true);

    if (isMulti) {
      input.onChange(inputValue);
    } else if (inputValue) {
      const { value } = inputValue as OptionType;
      input.onChange(value);
    } else {
      input.onChange("");
    }

    if (props.onSelect) {
      if (actionMeta.action === "select-option" && (inputValue as OptionType).value !== input.value) {
        props.onSelect();
      } else if (actionMeta.action === "clear" && input.value) {
        props.onSelect();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (props.componentOnKeyDown && selectRef.current && !selectRef.current.state.menuIsOpen && e.key === "Enter") {
      props.componentOnKeyDown(e);
    }
  };

  let mergedOptions: Array<OptionType>;
  if (hasBlank && (options.length === 0 || (options.length > 0 && options[0].label !== ""))) {
    mergedOptions = [{ value: "", label: "" }, ...options];
  } else {
    mergedOptions = options;
  }

  const customFilter = createFilter({
    matchFrom: "start",
  });

  // eslint-disable-next-line react/no-unstable-nested-components
  const SingleValue = ({ children, ...selectProps }: React.ComponentProps<typeof components.SingleValue>) => (
    <components.SingleValue {...selectProps}>{children || <span className="placeholder">{placeholder}</span>}</components.SingleValue>
  );

  // eslint-disable-next-line react/no-unstable-nested-components
  const DropdownIndicator = (selectProps: React.ComponentProps<typeof components.DropdownIndicator>) => (
    <components.DropdownIndicator {...selectProps}>
      <div />
    </components.DropdownIndicator>
  );

  // eslint-disable-next-line react/no-unstable-nested-components
  const ClearIndicator = () => <></>;
  // eslint-disable-next-line react/no-unstable-nested-components
  const IndicatorSeparator = () => <></>;

  const customStyles: StylesConfig<OptionType, boolean> = {
    container: (providedStyles, _state) => ({
      ...providedStyles,
      width,
      fontFamily,
      fontSize,
      fontWeight,
    }),
    control: (_providedStyles, state) => ({
      display: "flex",
      minHeight: height || 44,
      border:
        state.isDisabled && disabledSimpleColor
          ? "1px solid #222222"
          : (error && touched && submitFailed) || (isForceError && touched)
          ? `1px solid ${color.border.ERROR}`
          : isShadowOnFocus && state.isFocused
          ? "1px solid #2e85c8"
          : `1px solid ${color.border.PRIMARY}`,
      boxShadow: isShadowOnFocus && state.isFocused ? "0px 0px 7px #60B7FA" : "none",
      borderRadius: 1,
      opacity: state.isDisabled && !disabledSimpleColor ? 0.6 : 1,
      background: isShowEditedColor
        ? state.isDisabled && !disabledSimpleColor
          ? "#EBEBE4"
          : dirty && !input.value
          ? color.background.DELETED
          : "#FFF"
        : state.isDisabled && !disabledSimpleColor
        ? "#EBEBE4"
        : "#FFF",
      "> div": {
        ":first-of-type": {
          paddingLeft: 6,
        },
      },
    }),
    option: (providedStyles, state) => ({
      ...providedStyles,
      height: optionHeight,
      color: state.isDisabled ? "#000" : providedStyles.color,
    }),
    dropdownIndicator: (providedStyles, state) => ({
      ...providedStyles,
      width: 20,
      height: "100%",
      padding: 0,
      justifyContent: "center",
      alignItems: "center",
      "> div": !state.isDisabled
        ? {
            marginBottom: 3,
            padding: 0,
            width: 7,
            height: 7,
            borderRight: "2px solid #289ac6",
            borderBottom: "2px solid #289ac6",
            transform: "rotate(45deg)",
          }
        : {},
      "&:hover > div": !state.isDisabled
        ? {
            borderRightColor: "hsl(0,0%,60%)",
            borderBottomColor: "hsl(0,0%,60%)",
          }
        : {},
    }),
    placeholder: (providedStyles) => ({
      ...providedStyles,
      color: color.PLACEHOLDER,
    }),
    singleValue: (providedStyles, _state) => ({
      ...providedStyles,
      color: isShowEditedColor ? (dirty ? color.text.CHANGED : "#000") : "#000",
      overflow: "visible",
      ".placeholder": {
        color: color.PLACEHOLDER,
      },
    }),
    multiValue: (providedStyles, { data }: { data: OptionType }) => ({
      ...providedStyles,
      backgroundColor: data.color,
      color: data.color ? "#FFF" : providedStyles.color,
    }),
    multiValueLabel: (providedStyles) => ({
      ...providedStyles,
      color: "#fff",
    }),
    menu: (providedStyles) => ({
      ...providedStyles,
      marginTop: 0,
      marginBottom: 0,
      width: menuWidth || providedStyles.width,
      left: menuLeft || providedStyles.left,
    }),
    menuList: (providedStyles) => ({
      ...providedStyles,
      paddingTop: 0,
      paddingBottom: 0,
      color: "#000",
    }),
  };

  const currentValue = mergedOptions.filter(({ value }) =>
    isMulti
      ? typeof input.value === "object" &&
        (input.value as { value: string }[]).filter((iv: { value: string }) => iv.value === value).length > 0
      : value === input.value
  );

  return (
    <Select
      ref={selectRef}
      isMulti={isMulti}
      tabIndex={String(tabIndex)}
      components={{ SingleValue, ClearIndicator, DropdownIndicator, IndicatorSeparator }}
      styles={customStyles}
      options={mergedOptions}
      filterOption={customFilter}
      placeholder={placeholder}
      isSearchable={isSearchable}
      isClearable={!!hasBlank}
      isDisabled={disabled}
      value={currentValue}
      onChange={handleChange}
      blurInputOnSelect={false}
      closeMenuOnScroll
      maxMenuHeight={maxMenuHeight || optionHeight * 7}
      onKeyDown={handleKeyDown}
      onFocus={props.onFocus}
      noOptionsMessage={() => null}
      autoFocus={autoFocus}
    />
  );
};

export default SelectBox;
