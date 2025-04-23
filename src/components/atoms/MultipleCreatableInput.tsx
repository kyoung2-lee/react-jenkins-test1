import React, { Component, CSSProperties } from "react";
import CreatableSelect from "react-select/creatable";
import { InputActionMeta, ActionMeta } from "react-select/src/types";
import { StylesConfig } from "react-select/src/styles";
import { ThemeConfig } from "react-select/src/theme";
import { components as defaultComponents } from "react-select";
import { WrappedFieldProps } from "redux-form";
import isEmpty from "lodash.isempty";
import color from "../../styles/colorStyle";

interface OptionType {
  value: unknown;
  label: string;
  color?: string;
}

interface Props {
  tabIndex?: number;
  name: string;
  placeholder?: string;
  disabled?: boolean;
  width?: number | string;
  maxHeight?: number;
  maxValLength: number;
  filterValue?: (value: string) => string; // 入力する文字を限定する
  formatValues?: (values: unknown[]) => unknown[]; // 入力値に対して変換処理を行う（フォーマット変換）
  componentOnBlur?: (event: React.FocusEvent<HTMLElement>, values: string[] | undefined) => void;
  initialJobCd?: string | undefined;
  isForceError?: boolean;
  isShadowOnFocus?: boolean;
  isShowEditedColor?: boolean;
  autoFocus?: boolean;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
}

interface State {
  inputValue: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Input = (props: any) => {
  const { Input: DefaultInput } = defaultComponents;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const { onPaste } = props.selectProps;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  return <DefaultInput {...props} onPaste={onPaste} />;
};

const components = {
  ...defaultComponents,
  DropdownIndicator: null,
  Input,
};

const createOption = (value: string) => ({
  label: value,
  value,
});

class MultipleCreatableInput extends Component<WrappedFieldProps & Props, State> {
  entered = false;

  constructor(props: WrappedFieldProps & Props) {
    super(props);

    this.state = {
      inputValue: "",
    };
  }

  get isError() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, touched, submitFailed } = this.props.meta;
    const { isForceError } = this.props;
    return (!!error && touched && submitFailed) || (isForceError && touched);
  }

  container: StylesConfig<OptionType, boolean>["container"] = (base: CSSProperties, _state) => ({
    ...base,
    width: this.props.width || "100%",
    maxHeight: this.props.maxHeight,
    minHeight: "44px",
    border: "none",
    fontFamily: this.props.fontFamily,
    fontSize: this.props.fontSize,
    fontWeight: this.props.fontWeight,
  });

  control: StylesConfig<OptionType, boolean>["control"] = (base: CSSProperties, state) => {
    const borderStyle = `1px solid ${
      this.isError ? color.border.ERROR : this.props.isShadowOnFocus && state.isFocused ? "#2e85c8" : color.border.PRIMARY
    }`;
    return {
      ...base,
      width: "100%",
      height: "100%",
      padding: "0 8px 0 6px",
      border: borderStyle,
      boxShadow: this.props.isShadowOnFocus && state.isFocused ? "0px 0px 7px #60B7FA" : "none",
      "&:hover": { border: borderStyle },
      borderRadius: "1px",
      minHeight: "42px",
      opacity: this.props.disabled ? 0.6 : 1,
      background: this.props.disabled
        ? "#EBEBE4"
        : this.props.isShowEditedColor && this.props.meta.dirty && isEmpty(this.props.input.value)
        ? color.background.DELETED
        : color.WHITE,
      overflowY: "auto",
    };
  };

  option: StylesConfig<OptionType, boolean>["option"] = (base: CSSProperties) => ({
    ...base,
    height: 34,
    color: this.props.disabled ? "#000" : base.color,
  });

  theme: ThemeConfig = (theme) => ({
    ...theme,
    borderRadius: 1,
    colors: {
      ...theme.colors,
      primary: "#346181",
    },
  });

  menu: StylesConfig<OptionType, boolean>["menu"] = (menu: CSSProperties) => ({
    ...menu,
    marginTop: 0,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange = (value: any, action: ActionMeta<OptionType>, jobCode: string | undefined, previous: any[]) => {
    if (action.action === "select-option" && this.props.maxValLength) {
      if (previous.length >= this.props.maxValLength) {
        return;
      }
    }
    if (action.action === "pop-value" && action.removedValue && action.removedValue.label === jobCode) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let next = value;
    if (action.action === "clear") {
      next = previous.filter((v: OptionType) => v.label === jobCode);
    }
    this.props.input.onChange(next ? (next as OptionType[]).map((v) => v.value) : []);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleInputChange = (inputValue: string, action: InputActionMeta, previous: any[]) => {
    if (action.action === "input-change") {
      if (previous.length >= this.props.maxValLength || this.entered) {
        return;
      }
    }
    const { filterValue } = this.props;
    if (action.action !== "input-blur" && action.action !== "menu-close") {
      this.setState({ inputValue: filterValue ? filterValue(inputValue) : inputValue });
    }
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const {
      state: { inputValue },
      props: {
        maxValLength,
        formatValues,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        input: { onChange, value },
      },
    } = this;

    if (this.entered && event.key !== "Enter" && event.key !== "Tab") {
      this.entered = false;
    }

    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab": {
        this.setState({ inputValue: "" });
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        let next = [...new Set([...value, inputValue])];
        next = formatValues ? formatValues(next) : next;
        next = [...new Set(next)];
        if (maxValLength >= next.length) {
          onChange(next);
        }
        this.entered = true;
        event.preventDefault();
        break;
      }
      default:
        break;
    }
  };

  handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const {
      state: { inputValue },
      props: {
        maxValLength,
        formatValues,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        input: { onChange, value },
        filterValue,
      },
    } = this;
    event.preventDefault();
    const clipboard = event.clipboardData.getData("Text").trim();
    if (!clipboard) {
      return;
    }
    const values = clipboard
      .split(/[\s,]+/)
      .map((v) => v.trim())
      .map((v) => (filterValue ? filterValue(v) : v))
      .filter((v) => v);
    this.setState({ inputValue: "" });
    let next = [
      ...new Set(!this.entered && !!inputValue ? [...(value as string[]), inputValue, ...values] : [...(value as string[]), ...values]),
    ];
    next = formatValues ? (formatValues(next) as string[]) : next;
    next = [...new Set(next)].slice(0, maxValLength);
    onChange(next);
    this.entered = true;
  };

  parseValue = (value: string[] | undefined) => {
    if (!value) {
      return [];
    }
    return value.map((v) => createOption(v));
  };

  // 項目をxボタンで削除した場合に枠の一部が残ってしまう問題があったが、「transform: 'translateZ(0)'」を付けることで解消
  multiValue: StylesConfig<OptionType, boolean>["multiValue"] = (base: CSSProperties, value) =>
    value.data.label === this.props.initialJobCd
      ? { ...base, backgroundColor: "gray", fontSize: "20px", borderRadius: "2px" }
      : {
          ...base,
          backgroundColor: "#FFF",
          border: "1px solid rgb(84, 84, 84)",
          fontSize: "20px",
          borderRadius: "2px",
          transform: "translateZ(0)",
        };

  multiValueLabel: StylesConfig<OptionType, boolean>["multiValueLabel"] = (base: CSSProperties, value) =>
    value.data.label === this.props.initialJobCd
      ? {
          ...base,
          color: "white",
          paddingRight: 6,
        }
      : {
          ...base,
          color: this.props.isShowEditedColor && this.props.meta.dirty ? color.text.CHANGED : base.color,
        };

  multiValueRemove: StylesConfig<OptionType, boolean>["multiValueRemove"] = (base: CSSProperties, value) =>
    value.data.label === this.props.initialJobCd ? { ...base, display: "none" } : base;

  valueContainer: StylesConfig<OptionType, boolean>["valueContainer"] = (base: CSSProperties) => ({ ...base, padding: "2px 0 2px" });

  clearIndicator: StylesConfig<OptionType, boolean>["clearIndicator"] = (clearIndicator: CSSProperties) => ({
    ...clearIndicator,
    color: "#4198C9",
  });

  dropdownIndicator: StylesConfig<OptionType, boolean>["dropdownIndicator"] = (dropdownIndicator: CSSProperties) => ({
    ...dropdownIndicator,
    color: "#4198C9",
  });

  placeholderStyle: StylesConfig<OptionType, boolean>["placeholder"] = (placeholder: CSSProperties) => ({
    ...placeholder,
    color: color.PLACEHOLDER,
  });

  onComponentBlur = (event: React.FocusEvent<HTMLElement>, values: string[] | undefined) => {
    const {
      state: { inputValue },
      props: {
        maxValLength,
        formatValues,
        componentOnBlur,
        input: { onChange },
      },
    } = this;
    if (componentOnBlur) {
      componentOnBlur(event, values);
    }
    if (inputValue) {
      let next = [...new Set([...(values || []), inputValue])];
      next = formatValues ? (formatValues(next) as string[]) : next;
      next = [...new Set(next)];
      if (maxValLength >= next.length) {
        onChange(next);
        this.setState({ inputValue: "" });
      }
    }
    event.preventDefault();
  };

  render() {
    const {
      container,
      control,
      option,
      theme,
      menu,
      multiValue,
      multiValueLabel,
      multiValueRemove,
      valueContainer,
      clearIndicator,
      dropdownIndicator,
      placeholderStyle,
    } = this;

    const { inputValue } = this.state;

    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      input: { name, value },
      placeholder = "",
      disabled = false,
      initialJobCd,
      autoFocus,
      tabIndex,
    } = this.props;

    return (
      <CreatableSelect
        {...{ name, placeholder }}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        value={this.parseValue(value)}
        components={components}
        tabIndex={tabIndex === undefined ? String(tabIndex) : String(tabIndex)}
        theme={theme}
        styles={{
          container,
          control,
          option,
          menu,
          multiValue,
          multiValueLabel,
          multiValueRemove,
          valueContainer,
          clearIndicator,
          dropdownIndicator,
          placeholder: placeholderStyle,
        }}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        autoFocus={autoFocus}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        onChange={(values, action) => this.handleChange(values, action, initialJobCd, this.parseValue(value))}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        onInputChange={(newValue: string, action: InputActionMeta) => this.handleInputChange(newValue, action, this.parseValue(value))}
        onKeyDown={this.handleKeyDown}
        isDisabled={disabled}
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        onBlur={(e) => this.onComponentBlur(e, value)}
        onPaste={this.handlePaste}
      />
    );
  }
}

export default MultipleCreatableInput;
