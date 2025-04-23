import React, { useCallback } from "react";
import { Field, Validator, change } from "redux-form";
import styled from "styled-components";
import { useAppDispatch } from "../../store/hooks";
import { storage } from "../../lib/storage";
import { Const } from "../../lib/commonConst";
import TextInput from "../atoms/TextInput";

type Props = {
  disabled?: boolean;
  fieldName: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  formName: string;
  height?: number | string;
  maxLength?: number;
  options: { label: string; value: string }[];
  validate?: Validator | Validator[] | undefined;
  value: string;
  width: number | string;
  normalize?: (value: string) => string;
  componentOnBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const SuggestSelectInputBox = (props: Props) => {
  /**
   * 選択肢のリストの表示状態
   */
  const [isOptionListOpened, setIsOptionListOpened] = React.useState(false);

  /**
   * テキストボックスの要素
   */
  const textbox = React.useRef<HTMLInputElement>(null);

  /**
   * テキストボックス内のドロップダウンボタンの要素
   */
  const dropdownIndicator = React.useRef<HTMLDivElement>(null);

  /**
   * ラベルの重複を除いた選択肢
   */
  const deduplicatedOptions = props.options.reduce(
    (acc, cur) => (acc.some(({ label }) => label === cur.label) ? acc : [...acc, cur]),
    [] as typeof props.options
  );

  const dispatch = useAppDispatch();

  /**
   * 入力に応じて選択肢を絞り込む
   */
  const filterOptions = (value: string = props.value) => deduplicatedOptions.filter((option) => option.label.includes(value.toUpperCase()));

  /**
   * テキストボックス外をクリックした時は選択肢リストを非表示にする
   */
  const handleClickOutside = useCallback((e: MouseEvent | TouchEvent) => {
    const isInsideClick = textbox.current?.contains(e.target as Node) || dropdownIndicator.current?.contains(e.target as Node);
    if (isInsideClick) return;
    setIsOptionListOpened(false);
  }, []);

  /**
   * リストから選択時、値を更新する
   */
  const onSelectOptionItem = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.TouchEvent<HTMLButtonElement>,
    devices: Const.TerminalCat[],
    label: string
  ) => {
    if (!devices.some((device) => device === storage.terminalCat)) return;
    e.preventDefault();
    e.stopPropagation();
    if (props.disabled) return;
    dispatch(change(props.formName, props.fieldName, label));
    setIsOptionListOpened(false);
  };

  React.useEffect(() => {
    document.addEventListener(storage.terminalCat === Const.TerminalCat.pc ? "click" : "touchstart", handleClickOutside);
    return () => {
      document.removeEventListener(storage.terminalCat === Const.TerminalCat.pc ? "click" : "touchstart", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <Field
        component={TextInput}
        disabled={props.disabled}
        fontFamily={props.fontFamily}
        fontSize={props.fontSize}
        fontWeight={props.fontWeight}
        height={props.height}
        maxLength={props.maxLength}
        name={props.fieldName}
        validate={props.validate}
        width={props.width}
        componentOnBlur={props.componentOnBlur}
        onKeyPress={props.onKeyPress}
        props={{
          innerRef: textbox,
          input: {
            value: props.value,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target;
              const normalizeValue = props.normalize ? props.normalize(value) : value;
              dispatch(change(props.formName, props.fieldName, normalizeValue));
              if (filterOptions(e.target.value).length) {
                setIsOptionListOpened(true);
              }
            },
          },
          onClick: () => {
            setIsOptionListOpened((isOpened) => !isOpened);
          },
          onKeyDown: () => {
            setIsOptionListOpened(false);
          },
        }}
      />
      <DropdownIndicator
        ref={dropdownIndicator}
        onClick={(e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
          e.preventDefault();
          if (props.disabled) return;
          setIsOptionListOpened((isOpened) => !isOpened);
          textbox.current?.focus();
        }}
        isDisabled={props.disabled}
      />
      <OptionWrapper isOpened={isOptionListOpened} fontFamily={props.fontFamily} isDisabled={props.disabled}>
        {[{ label: "" }, ...filterOptions()].map(({ label }) => (
          <li key={label}>
            <OptionItemWrapper
              onMouseDown={(e) => onSelectOptionItem(e, [Const.TerminalCat.pc], label)}
              onTouchEnd={(e) => onSelectOptionItem(e, [Const.TerminalCat.iPad, Const.TerminalCat.iPhone], label)}
              type="button"
              isSelected={label === props.value}
            >
              {label}
            </OptionItemWrapper>
          </li>
        ))}
      </OptionWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;
const DropdownIndicator = styled.div<{
  isDisabled?: boolean;
}>`
  appearance: none;
  background-color: white;
  border: none;
  bottom: 1px;
  content: "";
  display: ${({ isDisabled }) => (isDisabled ? "none" : "block")};
  position: absolute;
  right: 1px;
  top: 1px;
  width: 20px;
  z-index: 1;
  &::after {
    border-bottom: 2px solid #289ac6;
    border-right: 2px solid #289ac6;
    content: "";
    height: 7px;
    pointer-events: none;
    position: absolute;
    right: 10px;
    top: 50%;
    transform: rotate(45deg);
    translate: 50% -50%;
    width: 7px;
    z-index: 2;
  }
  &:hover::after {
    border-bottom-color: hsl(0, 0%, 60%);
    border-right-color: hsl(0, 0%, 60%);
  }
`;
const OptionWrapper = styled.ul<{
  fontFamily?: string;
  isDisabled?: boolean;
  isOpened: boolean;
}>`
  background: white;
  border-radius: 5px;
  border: 1px solid #c8c8c8;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  display: ${({ isDisabled, isOpened }) => (!isDisabled && isOpened ? "block" : "none")};
  font-family: ${({ fontFamily }) => fontFamily ?? "transparent"};
  left: 0;
  list-style: none;
  margin: 0;
  max-height: 200px;
  overflow: auto;
  padding: 0;
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 1;
`;
const OptionItemWrapper = styled.button<{
  isSelected: boolean;
}>`
  appearance: none;
  background: ${({ isSelected }) => (isSelected ? "#2684ff" : "transparent")};
  border: none;
  color: ${({ isSelected }) => (isSelected ? "#ffffff" : "#000000")};
  min-height: 38px;
  overflow: hidden;
  padding: 6px;
  text-align: left;
  width: 100%;
  &:hover {
    background-color: ${({ isSelected }) => (isSelected ? "#2684ff" : "#deebff")};
    color: ${({ isSelected }) => (isSelected ? "#ffffff" : "#000000")};
  }
`;
