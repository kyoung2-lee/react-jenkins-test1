import React from "react";
import { WrappedFieldProps } from "redux-form";
import styled, { css } from "styled-components";
import { removePictograph, convertLineFeedCodeToCRLF } from "../../lib/commonUtil";

type Props = WrappedFieldProps & {
  id?: string;
  width: number | string;
  height?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  onClick?: (e: React.MouseEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  maxLengthCRLFCheck?: boolean;
  maxRowLength?: number;
  maxRows?: number;
  readOnly?: boolean;
  componentOnBlur?: (e: React.FocusEvent<HTMLTextAreaElement> | undefined) => void;
  isForceError?: boolean;
  isShadowOnFocus?: boolean;
};

class TextArea extends React.Component<Props> {
  refText = React.createRef<HTMLTextAreaElement>();
  donePaste = false;

  handleOnChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const e = event;
    if (!this.refText.current) return;

    const { input, maxRows, maxRowLength, maxLength, maxLengthCRLFCheck } = this.props;
    const selectPos = this.refText.current.selectionStart;
    let needDiscardInput = false;

    if (maxRowLength || maxRows) {
      let values = e.target.value.split(/\n/);
      // コピー＆ペーストの処理
      if (this.donePaste) {
        this.donePaste = false;
        // 行毎の最大入力可能文字数で折り返す
        if (maxRowLength) {
          values = values.reduce((pre, cur) => {
            let rowValue = cur;
            while (maxRowLength < rowValue.length) {
              pre.push(rowValue.slice(0, maxRowLength));
              rowValue = rowValue.slice(maxRowLength);
            }
            pre.push(rowValue);
            return pre;
          }, [] as string[]);
        }
        // 改行をCRLFに展開した文字列が最大文字数に収まるように切り詰める
        if (maxLengthCRLFCheck && !!maxLength) {
          values = values.reduce((pre, cur) => {
            const preLength = (convertLineFeedCodeToCRLF(`${pre.join("\n")}\n`) as string).length;
            if (preLength < maxLength) {
              pre.push(cur.slice(0, Math.min(cur.length, maxLength - preLength)));
            }
            return pre;
          }, [] as string[]);
        }
        // 最大入力行数まで入力可能
        if (maxRows && maxRows < values.length) {
          values = values.slice(0, maxRows);
        }
        // 編集内容を反映
        const newValue = values.join("\n");
        e.target.value = newValue;
        // 直接入力した場合の処理
      } else {
        const existsOverRowLength = !!maxRowLength && !!values.find((v) => maxRowLength < v.length);
        const existsOverMaxRows = !!maxRows && maxRows < values.length;
        if (existsOverRowLength || existsOverMaxRows) {
          needDiscardInput = true;
        }
      }
    }
    // 最大文字数のチェックを改行コードをCRLFに変換したものに対し行う
    if (maxLengthCRLFCheck && !!maxLength && maxLength < (convertLineFeedCodeToCRLF(e.target.value) as string).length) {
      needDiscardInput = true;
    }
    if (needDiscardInput) {
      // 入力を無効にする
      e.target.value = input.value as string;
      input.onChange(e);
      // カーソル位置を元に戻す
      this.refText.current.selectionStart = selectPos - 1;
      this.refText.current.selectionEnd = selectPos - 1;
      return;
    }
    input.onChange(e);
  };

  handleOnPaste = (_e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    this.donePaste = true;
  };

  render() {
    const {
      id,
      input,
      width,
      height,
      maxWidth,
      minWidth,
      placeholder,
      disabled,
      onClick,
      maxLength,
      maxRowLength,
      readOnly,
      componentOnBlur = () => {},
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      meta: { error, touched, submitFailed },
      isForceError,
      isShadowOnFocus,
    } = this.props;

    return (
      <Wrapper>
        <Text
          ref={this.refText}
          id={id}
          {...input}
          width={width}
          height={height}
          maxWidth={maxWidth}
          minWidth={minWidth}
          placeholder={placeholder}
          onClick={onClick}
          disabled={disabled}
          onChange={this.handleOnChange}
          onPaste={this.handleOnPaste}
          maxLength={maxLength}
          maxRowLength={maxRowLength}
          readOnly={readOnly}
          onBlur={(event: React.FocusEvent<HTMLTextAreaElement>) => {
            const e = event;
            e.target.value = removePictograph(e.target.value);
            input.onChange(e);
            componentOnBlur(e);
          }}
          isError={(!!error && touched && submitFailed) || (!!isForceError && touched)}
          isShadowOnFocus={isShadowOnFocus}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
`;

const Text = styled.textarea<{
  isError: boolean;
  width: number | string;
  height?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  maxRowLength?: number;
  isShadowOnFocus?: boolean;
}>`
  background: ${({ disabled }) => (disabled ? "#EBEBE4" : "#FFF")};
  width: ${({ width }) => (typeof width === "number" ? `${width}px` : width)};
  height: ${({ height }) => (height ? (typeof height === "number" ? `${height}px` : height) : "44px")};
  max-width: ${({ maxWidth = "none" }) => (typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth)};
  min-width: ${({ minWidth = "none" }) => (typeof minWidth === "number" ? `${minWidth}px` : minWidth)};
  padding: 10px 6px;
  border: 1px solid ${(props) => (props.isError ? props.theme.color.border.ERROR : props.theme.color.border.PRIMARY)};
  border-radius: 1px;
  appearance: none;
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
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
  ${({ disabled }) => (disabled ? "opacity: 0.6;" : "")};
  ${({ maxRowLength }) =>
    maxRowLength
      ? `
    font-size: 16px;
    line-height: 1.2;
  `
      : ""}
`;

export default TextArea;
