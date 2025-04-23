import React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../store/hooks";
import { FilterInput } from "../../atoms/FilterInput";

interface Props {
  onFilterKeyPress: (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeFilter: (e: (React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) | any) => void;
  filter: string;
  onClickTemplateFilter: () => void;
  applyFilter: () => void;
  isNameActive: boolean;
  onClickNameFilterTab: () => void;
  isRecentlyActive: boolean;
  onClickRecentlyFilterTab: () => void;
}

const TemplateFilter: React.FC<Props> = (props) => {
  const {
    onFilterKeyPress,
    onChangeFilter,
    filter,
    onClickTemplateFilter,
    applyFilter,
    isNameActive,
    onClickNameFilterTab,
    isRecentlyActive,
    onClickRecentlyFilterTab,
  } = props;

  const isTemplateFiltered = useAppSelector((state) => state.broadcast.Broadcast.isTemplateFiltered);

  return (
    <>
      <FilterTextContainer>
        <FilterInput
          placeholder="Filter"
          handleKeyPress={onFilterKeyPress}
          handleChange={onChangeFilter}
          value={filter}
          handleClick={onClickTemplateFilter}
          handleSubmit={applyFilter}
          filtering={isTemplateFiltered}
        />
      </FilterTextContainer>
      <FilterTabContainer>
        <FilterTabs>
          <FilterTab isActive={isNameActive} onClick={onClickNameFilterTab}>
            Name
          </FilterTab>
          <FilterTab isActive={isRecentlyActive} onClick={onClickRecentlyFilterTab}>
            Recently
          </FilterTab>
        </FilterTabs>
      </FilterTabContainer>
    </>
  );
};

const FilterTextContainer = styled.div`
  margin-top: 12px;
  height: 32px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

const FilterTabContainer = styled.div`
  margin-top: 7px;
  height: 40px;
`;

const FilterTabs = styled.div`
  width: 100%;
  z-index: 3;
  display: flex;
  height: 40px;
  > div:first-child {
    border-right: none;
  }
`;

const FilterTab = styled.div<{ isActive: boolean }>`
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  margin: 0 5px;
  border-bottom: ${(props) => (props.isActive ? "2px solid #346181" : "transparent")};
  z-index: ${(props) => (props.isActive ? "1" : "0")};
  color: #346181;
  background: ${(props) => (props.isActive ? "#fff" : "transparent")};
  cursor: pointer;
  font-size: 16px;
`;

export default TemplateFilter;
