import React from "react";
import { createFilter, components } from "react-select";
import CreatableSelect from "react-select/creatable";
import { WrappedFieldProps } from "redux-form";

import { ValueType, ActionMeta, InputActionMeta } from "react-select/src/types";
import { StylesConfig } from "react-select/src/styles";
import { removePictograph } from "../../lib/commonUtil";
import color from "../../styles/colorStyle";

export type OptionType = { label: string; value: string; isDisabled?: boolean; isSelected?: boolean };

type Props = WrappedFieldProps & {
  tabIndex?: number;
  options: Array<OptionType>;
  width: number | string;
  height?: number | string;
  maxLength?: number;
  placeholder?: string;
  isForceError?: boolean;
  isShadowOnFocus?: boolean;
  isShowEditedColor?: boolean;
  disabled?: boolean;
  onSelect?: (inputValue?: string) => void;
  autoFocus?: boolean; // FlightSearchFormでtrueにすると、FlightSearchFormでsearchTypeを切り替えできなくなる。
  innerRef?: React.RefObject<CreatableSelect<OptionType>>;
  maxMenuHeight?: number;
};

class SuggestSelectBox extends React.Component<Props> {
  optionHeight: number = 34 as number;
  selectRef: React.RefObject<CreatableSelect<OptionType>>;
  doFocusOnUpdated: boolean = false as boolean;
  isFocusOut: boolean = false as boolean;

  constructor(props: Props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleMenuOpen = this.handleMenuOpen.bind(this);
    this.handleMenuClose = this.handleMenuClose.bind(this);
    this.selectRef = props.innerRef || React.createRef<CreatableSelect<OptionType>>();
  }

  componentDidUpdate() {
    if (this.isFocusOut) {
      return;
    }
    if (this.doFocusOnUpdated || this.props.autoFocus) {
      if (this.selectRef.current) {
        this.selectRef.current.focus();
      }
      this.doFocusOnUpdated = false;
    }
  }

  componentWillUnmount() {
    this.isFocusOut = false;
  }

  handleChange = (inputValue: ValueType<OptionType, boolean>, actionMeta: ActionMeta<OptionType>) => {
    // console.log("handleChange inputValue:" + inputValue + "action: " + actionMeta.action);
    this.doFocusOnUpdated = true;
    const value = inputValue ? removePictograph((inputValue as OptionType).value.replace(/ /, "").toUpperCase()) : "";
    this.props.input.onChange(value);
    if (
      inputValue &&
      this.props.onSelect &&
      (actionMeta.action === "create-option" || actionMeta.action === "select-option" || actionMeta.action === "clear")
    ) {
      if (value !== this.props.input.value) {
        this.props.onSelect(value);
      }
    }
  };

  handleInputChange = (_inputValue: string, _inputActionMeta: InputActionMeta) => {
    //  console.log("handleInputChange value: " + inputValue + "action: " +inputActionMeta.action);
  };

  handleFocus = () => {
    // console.log("handleFocus");
    this.isFocusOut = false;
  };

  handleBlur = () => {
    if (this.selectRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { inputValue } = this.selectRef.current.state;
      if (inputValue) {
        const value = removePictograph((inputValue as string).replace(/ /, "").toUpperCase());
        this.props.input.onChange(value);
        if (this.props.onSelect) {
          if (value !== this.props.input.value) {
            this.props.onSelect(value);
          }
        }
      }
    }
    this.isFocusOut = true;
  };

  handleMenuOpen = () => {};

  handleMenuClose = () => {};

  render() {
    const {
      tabIndex,
      options,
      width,
      height,
      input,
      maxLength,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      meta: { error, touched, submitFailed, dirty },
      isForceError,
      isShadowOnFocus,
      isShowEditedColor,
      placeholder = "",
      disabled = false,
      autoFocus = false,
      maxMenuHeight,
    } = this.props;

    let mergedOptions: Array<OptionType> = [];

    if (input.value && !options.some((e) => e.label === input.value)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      mergedOptions = [{ value: "", label: "" }, { value: input.value, label: input.value }, ...options];
    } else {
      mergedOptions = [{ value: "", label: "" }, ...options];
    }

    const customFilter = createFilter({
      matchFrom: "start",
    });

    // eslint-disable-next-line react/no-unstable-nested-components, @typescript-eslint/no-explicit-any
    const Input = (props: any) => <components.Input {...props} maxLength={maxLength} />;

    // eslint-disable-next-line react/no-unstable-nested-components
    const SingleValue = ({ children, ...props }: React.ComponentProps<typeof components.SingleValue>) => (
      <components.SingleValue {...props}>{children || <span className="placeholder">{placeholder}</span>}</components.SingleValue>
    );

    // eslint-disable-next-line react/no-unstable-nested-components
    const DropdownIndicator = (props: React.ComponentProps<typeof components.DropdownIndicator>) => (
      <components.DropdownIndicator {...props}>
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
      }),
      control: (_providedStyles, state) => ({
        display: "flex",
        height: height || 44,
        border:
          (error && touched && submitFailed) || (isForceError && touched)
            ? `1px solid ${color.border.ERROR}`
            : isShadowOnFocus && state.isFocused
            ? "1px solid #2e85c8"
            : `1px solid ${color.border.PRIMARY}`,
        boxShadow: isShadowOnFocus && state.isFocused ? "0px 0px 7px #60B7FA" : "none",
        borderRadius: 1,
        opacity: state.isDisabled ? 0.6 : 1,
        background: isShowEditedColor
          ? state.isDisabled
            ? "#EBEBE4"
            : dirty && !input.value
            ? color.background.DELETED
            : "#FFF"
          : state.isDisabled
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
        height: this.optionHeight,
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
      menu: (providedStyles) => ({
        ...providedStyles,
        marginTop: 0,
        marginBottom: 0,
      }),
      menuList: (providedStyles) => ({
        ...providedStyles,
        paddingTop: 0,
        paddingBottom: 0,
        color: "#000",
      }),
    };

    return (
      <CreatableSelect
        ref={this.selectRef}
        tabIndex={String(tabIndex)}
        components={{ Input, SingleValue, ClearIndicator, DropdownIndicator, IndicatorSeparator }}
        styles={customStyles}
        options={mergedOptions}
        filterOption={customFilter}
        placeholder={placeholder}
        isClearable
        isDisabled={disabled}
        autoFocus={autoFocus}
        formatCreateLabel={(value) => removePictograph(value.replace(/ /, "").toUpperCase())}
        value={mergedOptions.filter(({ value }) => value === input.value)}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onMenuOpen={this.handleMenuOpen}
        onMenuClose={this.handleMenuClose}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        blurInputOnSelect={false}
        closeMenuOnScroll
        maxMenuHeight={maxMenuHeight || this.optionHeight * 7}
      />
    );
  }
}

export default SuggestSelectBox;
