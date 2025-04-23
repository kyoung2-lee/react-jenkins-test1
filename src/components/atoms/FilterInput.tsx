import React from "react";
import styled from "styled-components";
import searchIcon from "../../assets/images/icon/icon-search.svg";

interface Props {
  tabIndex?: number;
  placeholder: string;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => void;
  handleChange: (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  handleClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  filtering: boolean;
}

export const FilterInput: React.FC<Props> = (props: Props) => {
  const { tabIndex, placeholder, handleKeyPress, handleChange, value, handleClick, handleSubmit, filtering } = props;
  return (
    <Filter>
      <Input tabIndex={tabIndex || 0} placeholder={placeholder} onKeyPress={handleKeyPress} onChange={handleChange} value={value} />
      <OpenSearchFormButton type="button" onClick={handleClick}>
        <OpenSearchFormButtonContent />
        <OpenSearchFormButtonWhiteContent />
      </OpenSearchFormButton>
      <SubmitButton type="button" onClick={handleSubmit} filtering={filtering}>
        <SubmitButtonContent />
      </SubmitButton>
    </Filter>
  );
};

const Filter = styled.div`
  display: flex;
  align-items: center;
  border: 1px ${(props) => props.theme.color.PRIMARY} solid;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  width: 100%;
  height: 30px;
`;

const Input = styled.input`
  width: calc(100% - 70px);
  line-height: normal; /* safariでテキストを上下中央にする */
  height: 30px;
  margin-left: 6px;
  background: #ffffff;
  border: none;
  flex-basis: auto;
  &::placeholder {
    color: ${(props) => props.theme.color.PLACEHOLDER};
  }
`;

const OpenSearchFormButton = styled.button`
  flex-basis: 30px;
  width: 30px;
  height: 100%;
  cursor: pointer;
  display: block;
  outline: none;
  border: none;
  position: relative;
  background-color: transparent;
  padding: 0;

  &:hover {
    span {
      border-top-color: #346181;
    }
  }
`;

const OpenSearchFormButtonContent = styled.span`
  position: absolute;
  border-top: 11px solid #346181;
  border-right: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-left: 8px solid transparent;
  top: 10px;
  right: 7px;
  width: 0;
  height: 0;
`;

const OpenSearchFormButtonWhiteContent = styled.span`
  position: absolute;
  border-top: 8px solid #ffffff;
  border-right: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 6px solid transparent;
  top: 11px;
  right: 9px;
  width: 0;
  height: 0;
`;

const SubmitButton = styled.button<{ filtering: boolean }>`
  outline: none;
  border: none;
  cursor: pointer;
  flex-basis: 40px;
  height: 100%;
  background-color: ${(props) => (props.filtering ? "#ED8E01" : props.theme.color.PRIMARY)};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${(props) => (props.filtering ? "#ED8E01" : props.theme.color.button.PRIMARY_HOVER)};
  }
`;

const SubmitButtonContent = styled.img.attrs({
  src: searchIcon,
})`
  width: 20px;
  color: #fff;
`;
