import React from "react";
import { WrappedFieldProps } from "redux-form";
import styled, { css } from "styled-components";

import { removePictograph } from "../../lib/commonUtil";

type Props = WrappedFieldProps & {
  id?: string;
  className?: string;
  type?: string;
  tabIndex?: number;
  width: number | string;
  height?: number | string;
  autoCapitalize?: "off" | "on";
  autoComplete?: string;
  autoFocus?: boolean;
  placeholder?: string;
  fontSizeOfPlaceholder?: number;
  disabled?: boolean;
  disabledSimpleColor?: boolean; // disabledの場合、黒枠にする
  maxLength?: number;
  readOnly?: boolean;
  componentOnBlur?: (e: React.FocusEvent<HTMLInputElement> | undefined) => void;
  isForceDirty?: boolean;
  isForceError?: boolean;
  isShadowOnFocus?: boolean;
  isShowEditedColor?: boolean;
  isShowEditedDeletedColor?: boolean; // disabledの場合、編集（値あり→なし）中状態の背景色は表示したままにする
  showKeyboard?: () => void | undefined;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => void;
  innerRef?: React.RefObject<HTMLInputElement>;
  displayValue?: string | undefined;
  pattern?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
};

const TextInput: React.FC<Props> = (props) => {
  const {
    id,
    className,
    type,
    input,
    width,
    height,
    placeholder,
    fontSizeOfPlaceholder,
    disabled = false,
    disabledSimpleColor = false,
    isShowEditedDeletedColor = false,
    maxLength,
    tabIndex,
    componentOnBlur = () => {},
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    meta: { error, touched, submitFailed, dirty },
    isForceDirty,
    isForceError,
    isShadowOnFocus,
    isShowEditedColor,
    showKeyboard,
    autoCapitalize,
    autoComplete,
    autoFocus,
    onKeyPress = () => {},
    innerRef,
    displayValue,
    pattern,
    fontFamily,
    fontSize,
    fontWeight,
    handleInputChange,
    onBlur,
    onClick,
    onFocus,
    onKeyDown,
  } = props;

  return (
    <Wrapper
      onClick={() => {
        if (!disabled && showKeyboard) {
          showKeyboard();
        }
      }}
      displayValue={displayValue}
      paramDisabled={disabled}
      disabledSimpleColor={disabledSimpleColor}
      isShowEditedColor={isShowEditedColor}
      isShowEditedDeletedColor={isShowEditedDeletedColor}
      dirty={isForceDirty ?? dirty}
    >
      <Text
        ref={innerRef}
        type={type || "text"}
        id={id}
        className={className}
        {...input}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        width={width}
        height={height}
        placeholder={placeholder}
        fontSizeOfPlaceholder={fontSizeOfPlaceholder}
        disabled={disabled}
        paramDisabled={disabled}
        disabledSimpleColor={disabledSimpleColor}
        isShowEditedDeletedColor={isShowEditedDeletedColor}
        keyboard={!!showKeyboard}
        maxLength={maxLength}
        readOnly={disabled || !!showKeyboard}
        tabIndex={tabIndex}
        pattern={pattern}
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          if (onBlur) {
            onBlur(e);
          }
          const event = e;
          const value = removePictograph(event.target.value);
          event.target.value = value; // この処理は必ず行わないとChromeでオートコンプリート入力した際に自動で変化した背景色が元に戻らない
          if (event.target.value !== value) {
            input.onChange(event);
          }
          componentOnBlur(event);
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const event = e;
          if (maxLength && event.target.value.length > maxLength) {
            event.target.value = event.target.value.slice(0, maxLength);
          }
          if (type === "number" && maxLength) {
            if (event.target.value.length <= maxLength) {
              input.onChange(event);
            }
          } else {
            input.onChange(event);
          }
          if (handleInputChange != null) {
            handleInputChange(e);
          }
        }}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        isError={(!!error && touched && submitFailed) || (touched && !!isForceError)}
        isShadowOnFocus={isShadowOnFocus}
        isShowEditedColor={isShowEditedColor}
        onKeyPress={onKeyPress}
        dirty={isForceDirty ?? dirty}
        inputValue={input.value as string}
        fontFamily={fontFamily}
        fontSize={fontSize}
        fontWeight={fontWeight}
      />
    </Wrapper>
  );
};

const Wrapper = styled.div<{
  displayValue?: string | undefined;
  paramDisabled?: boolean;
  disabledSimpleColor?: boolean;
  isShowEditedColor?: boolean;
  isShowEditedDeletedColor?: boolean;
  dirty?: boolean;
}>`
  position: relative;
  ${({ displayValue, paramDisabled, disabledSimpleColor, isShowEditedDeletedColor, dirty, isShowEditedColor, theme }) =>
    displayValue !== undefined
      ? css`
           {
            opacity: ${paramDisabled && !disabledSimpleColor && !isShowEditedDeletedColor ? 0.6 : 1};
          }
          input {
            color: transparent !important;
            -webkit-text-fill-color: transparent !important;
            cursor: ${paramDisabled ? "unset" : "text"};
          }
          &:before {
            content: "${displayValue}";
            position: absolute;
            color: ${isShowEditedColor ? (dirty ? theme.color.text.CHANGED : "#000") : "#000"};
            background-color: transparent;
            top: 50%;
            left: 8px;
            line-height: 20px;
            margin-top: -9px;
            width: 58px;
            pointer-events: none;
          }
        `
      : css`
           {
            opacity: ${paramDisabled && !disabledSimpleColor && !isShowEditedDeletedColor ? 0.6 : 1};
          }
        `}
`;

const Text = styled.input<{
  isError: boolean;
  width: number | string;
  height?: number | string;
  paramDisabled?: boolean;
  disabledSimpleColor?: boolean;
  isShowEditedDeletedColor?: boolean;
  keyboard: boolean;
  isShadowOnFocus?: boolean;
  isShowEditedColor?: boolean;
  dirty?: boolean;
  inputValue: string;
  fontSizeOfPlaceholder?: number;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
}>`
  color: ${({ isShowEditedColor, dirty, theme }) => (isShowEditedColor ? (dirty ? theme.color.text.CHANGED : "#000") : "#000")};
  -webkit-text-fill-color: ${({ isShowEditedColor, dirty, theme }) =>
    isShowEditedColor ? (dirty ? theme.color.text.CHANGED : "#000") : "#000"};
  background-color: ${({ paramDisabled, disabledSimpleColor, isShowEditedDeletedColor, isShowEditedColor, dirty, inputValue, theme }) =>
    isShowEditedColor
      ? paramDisabled && !disabledSimpleColor
        ? isShowEditedDeletedColor && dirty && !inputValue
          ? theme.color.background.DELETED
          : "#EBEBE4"
        : dirty && !inputValue
        ? theme.color.background.DELETED
        : "#FFF"
      : paramDisabled
      ? "#EBEBE4"
      : "#FFF"};
  width: ${({ width }) => (typeof width === "number" ? `${width}px` : width)};
  height: ${({ height }) => (height ? (typeof height === "number" ? `${height}px` : height) : "44px")};
  line-height: normal; /* safariでテキストを上下中央にする */
  padding: 0 8px 0 6px;
  border: ${(props) =>
    props.paramDisabled && props.disabledSimpleColor
      ? "1px solid #222222"
      : props.paramDisabled && props.isShowEditedDeletedColor
      ? "1px solid rgba(52, 97, 129, 0.6)"
      : props.isError
      ? `1px solid ${props.theme.color.border.ERROR}`
      : `1px solid ${props.theme.color.border.PRIMARY}`};
  border-radius: 1px;
  background-clip: padding-box;
  appearance: none;
  ${({ fontFamily }) => (fontFamily ? `font-family: ${fontFamily};` : "")}
  ${({ fontSize }) => (fontSize ? `font-size: ${fontSize}px;` : "")}
  ${({ fontWeight }) => (fontWeight ? `font-weight: ${fontWeight};` : "")}
  ${(props) =>
    props.isShadowOnFocus
      ? css`
          &:focus {
            border: 1px solid ${props.isError ? props.theme.color.border.ERROR : "#2e85c8"};
            box-shadow: 0px 0px 7px #60b7fa;
          }
        `
      : null}
  &::placeholder {
    color: ${({ theme }) => theme.color.PLACEHOLDER};
    -webkit-text-fill-color: ${({ theme }) => theme.color.PLACEHOLDER};
    overflow: visible;
    ${({ fontSizeOfPlaceholder }) => (fontSizeOfPlaceholder ? `font-size: ${fontSizeOfPlaceholder}px` : "")}
  }
  &[type="number"]::-webkit-outer-spin-button,
  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

export default TextInput;
