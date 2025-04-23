import React from "react";
import styled from "styled-components";
import SearchIcon from "../../assets/images/icon/search.svg?component";

interface Props {
  isFiltered: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

const SearchButton: React.FC<Props> = (props) => {
  const { isFiltered, onClick } = props;
  return (
    <SearchButtonBase isFiltered={isFiltered} onClick={onClick}>
      <SearchIcon />
    </SearchButtonBase>
  );
};

const SearchButtonBase = styled.div<{ isFiltered?: boolean }>`
  width: 60px;
  height: 60px;
  background: ${(props) => (props.isFiltered ? "#eda63c" : props.theme.color.PRIMARY)};
  border: 2px solid ${(props) => props.theme.color.PRIMARY_BASE};
  border-radius: 30px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.33);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.isFiltered ? "#ED8E01" : props.theme.color.button.PRIMARY_HOVER)};
  }
  &:active {
    background: ${(props) => (props.isFiltered ? "#B57913" : props.theme.color.button.PRIMARY_ACTIVE)};
  }

  svg {
    width: 26px;
    height: 26px;
    path {
      fill: ${(props) => props.theme.color.PRIMARY_BASE};
    }
  }
`;

export default SearchButton;
