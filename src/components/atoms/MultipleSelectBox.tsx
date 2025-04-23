import React, { CSSProperties } from "react";
import Select, { components as defaultComponents } from "react-select";
import { ValueType, InputActionMeta, ActionMeta } from "react-select/src/types";
import { StylesConfig } from "react-select/src/styles";
import { ThemeConfig } from "react-select/src/theme";
import { WrappedFieldProps } from "redux-form";
import { Option } from "react-select/src/filters";
import uniq from "lodash.uniq";
import color from "../../styles/colorStyle";
import { toLowerCase } from "../../lib/commonUtil";

export interface OptionType {
  value: unknown;
  label?: string;
  color?: string;
  isFixed?: boolean;
}

export type OptionsType = OptionType[];

interface Props {
  name: string;
  options: OptionsType;
  maxValLength: number;
  closeMenuOnSelect?: boolean;
  width?: number | string;
  height?: number | string;
  placeholder?: string;
  noOptionsMessage?: () => string | null;
  disabled?: boolean;
  canSubmit?: boolean;
  spaceDelimiter?: boolean;
  isForceError?: boolean;
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
  Input,
};

class MultipleSelectBox extends React.Component<WrappedFieldProps & Props, State> {
  refSelect = React.createRef<Select<OptionType>>();

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

  container: StylesConfig<OptionType, boolean>["container"] = (base: CSSProperties) => ({
    ...base,
    width: this.props.width || "100%",
    minHeight: this.props.height || 44,
    fontFamily: this.props.fontFamily,
    fontSize: this.props.fontSize,
    fontWeight: this.props.fontWeight,
  });

  control: StylesConfig<OptionType, boolean>["control"] = (base: CSSProperties) => ({
    ...base,
    width: this.props.width || "100%",
    display: "flex",
    minHeight: this.props.height || 44,
    padding: "0 0 0 6px",
    border: `1px solid ${this.isError ? color.border.ERROR : color.border.PRIMARY}`,
    boxShadow: "none",
    borderRadius: 1,
    opacity: this.props.disabled ? 0.6 : 1,
    background: this.props.disabled ? "#EBEBE4" : color.WHITE,
    "&:hover": {
      border: `1px solid ${this.isError ? color.border.ERROR : color.border.PRIMARY}`,
    },
  });

  option: StylesConfig<OptionType, boolean>["option"] = (base: CSSProperties) => ({
    ...base,
    height: 32,
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

  menuList: StylesConfig<OptionType, boolean>["menuList"] = (providedStyles) => ({
    ...providedStyles,
    paddingTop: 0,
    paddingBottom: 0,
    color: "#000",
  });

  clearIndicator: StylesConfig<OptionType, boolean>["clearIndicator"] = (clearIndicator: CSSProperties) => ({
    ...clearIndicator,
    color: "#4198C9",
  });

  dropdownIndicator: StylesConfig<OptionType, boolean>["dropdownIndicator"] = (dropdownIndicator: CSSProperties) => ({
    ...dropdownIndicator,
    color: "#4198C9",
  });

  parseValue = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { value } = this.props.input;
    if (!value) {
      return [];
    }
    return (value as unknown[])
      .map((v) => this.props.options.find((o) => o.value === v))
      .sort((a) => (a && a.isFixed ? -1 : 1)) as OptionsType;
  };

  handleChange = (values: ValueType<OptionType, boolean>, action: ActionMeta<OptionType>, previous: OptionType[]) => {
    if (action.action === "select-option" && this.props.maxValLength) {
      if (previous.length >= this.props.maxValLength) {
        return;
      }
    }
    if (action.action === "pop-value" && action.removedValue && action.removedValue.isFixed) {
      return;
    }
    let next = values;
    if (action.action === "clear") {
      next = this.props.options.filter((option) => !!option.isFixed && !!previous.filter((p) => p === option.value).length);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    this.props.input.onChange(next ? (next as OptionsType).map((value) => value.value) : []);
  };

  handleInputChange = (inputValue: string, _action: InputActionMeta) => {
    this.setState({ inputValue });
  };

  handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    const {
      state: { inputValue },
      props: {
        maxValLength,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        input: { onChange, value },
        spaceDelimiter = true,
      },
    } = this;
    event.preventDefault();
    const clipboard = event.clipboardData.getData("Text").trim();
    if (!clipboard) {
      return;
    }
    // スペースを入力値として許容する項目もあるため、スペースを区切り文字として使うかをpropsで選択させる
    const delimiter = spaceDelimiter ? /[ \t\r\n,]+/ : /[\t\r\n,]+/;
    const values = clipboard
      .split(delimiter)
      .map((v) => {
        const option = this.props.options.find((o) => o.label === v.trim());
        return option ? option.value : null;
      })
      .filter((v) => v !== null);
    if (inputValue) {
      // 入力中の文字列が有効な値の場合、ペーストする値の先頭に加えておく
      const option = this.props.options.find((o) => (o.label ? o.label === inputValue : false));
      if (option) {
        values.unshift(option.value);
      }
      if (this.refSelect.current) {
        // 入力中の文字列をクリアする
        this.refSelect.current.select.onInputChange("", { action: "set-value" });
      }
    }
    const next = uniq([...(value as unknown[]), ...values]).slice(0, maxValLength);
    onChange(next);
  };

  // 項目をxボタンで削除した場合に枠の一部が残ってしまう問題があったが、「transform: 'translateZ(0)'」を付けることで解消
  multiValue: StylesConfig<OptionType, boolean>["multiValue"] = (base: CSSProperties, value) =>
    value.data.isFixed
      ? { ...base, backgroundColor: "gray", border: "1px solid gray", fontSize: "20px", borderRadius: "2px", transform: "translateZ(0)" }
      : value.data.color
      ? {
          ...base,
          backgroundColor: value.data.color,
          color: "#FFF",
          border: `1px solid ${value.data.color}`,
          fontSize: "20px",
          borderRadius: "2px",
          transform: "translateZ(0)",
        }
      : {
          ...base,
          backgroundColor: "#FFF",
          border: "1px solid #707070",
          fontSize: "20px",
          borderRadius: "2px",
          transform: "translateZ(0)",
        };

  multiValueLabel: StylesConfig<OptionType, boolean>["multiValueLabel"] = (base, value) =>
    value.data.isFixed ? { ...base, color: "white", paddingRight: 6 } : value.data.color ? { ...base, color: "#FFF" } : base;

  multiValueRemove: StylesConfig<OptionType, boolean>["multiValueRemove"] = (base: CSSProperties, value) =>
    value.data.isFixed ? { ...base, display: "none" } : base;

  valueContainer: StylesConfig<OptionType, boolean>["valueContainer"] = (base: CSSProperties) => ({ ...base, padding: "2px 0 2px" });

  placeholderStyle: StylesConfig<OptionType, boolean>["placeholder"] = (placeholder: CSSProperties) => ({
    ...placeholder,
    color: color.PLACEHOLDER,
  });

  isClearable = () => this.parseValue().some((v) => v && !v.isFixed);

  searchOnlyByLabel = (option: Option, rawInput: string) => toLowerCase(option.label).includes(toLowerCase(rawInput));

  render() {
    const {
      container,
      control,
      option,
      theme,
      menu,
      menuList,
      multiValue,
      multiValueLabel,
      multiValueRemove,
      valueContainer,
      clearIndicator,
      dropdownIndicator,
      placeholderStyle,
    } = this;

    const {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      input: { name, value },
      options,
      closeMenuOnSelect = true,
      placeholder = "",
      noOptionsMessage = () => null,
      disabled = false,
    } = this.props;

    const optionsLabelIsset = !!options && options.length > 0 && options[0].label !== undefined;

    return (
      <Select
        {...{
          name,
          options,
          closeMenuOnSelect,
          placeholder,
          noOptionsMessage,
        }}
        ref={this.refSelect}
        components={components}
        onChange={(values: ValueType<OptionType, boolean>, action: ActionMeta<OptionType>) =>
          this.handleChange(values, action, value as OptionType[])
        }
        onInputChange={this.handleInputChange}
        onPaste={this.handlePaste}
        value={this.parseValue()}
        theme={theme}
        styles={{
          container,
          control,
          option,
          menu,
          menuList,
          multiValue,
          multiValueLabel,
          multiValueRemove,
          valueContainer,
          clearIndicator,
          dropdownIndicator,
          placeholder: placeholderStyle,
        }}
        isDisabled={disabled}
        isMulti
        isClearable={this.isClearable()}
        {...(optionsLabelIsset ? { filterOption: this.searchOnlyByLabel } : {})}
      />
    );
  }
}

export default MultipleSelectBox;
