import React from "react";
import { Field } from "redux-form";
import styled from "styled-components";
import SelectBox from "../../atoms/SelectBox";

interface Props {
  onChangeJobCode: (newJobCd: string) => void;
  jobOption: { value: string; label: string }[];
}

const TemplateJobcodeSearch: React.FC<Props> = (props) => {
  const { onChangeJobCode, jobOption } = props;
  const selectBoxProps = {
    options: jobOption,
    isSearchable: true,
    placeholder: "Job Code",
    width: 137,
    maxMenuHeight: 408,
    maxLength: 10,
    tabIndex: 0,
  };
  return (
    <Container>
      <Field
        name="templateJobCd"
        component={SelectBox as "select" & typeof SelectBox}
        props={selectBoxProps}
        onChange={(_, newValue) => onChangeJobCode(newValue as string)}
      />
    </Container>
  );
};

const Container = styled.div`
  width: fit-content;
  z-index: 2; /*テンプレートソート切り替えボタンよりも上に選択肢を表示するため*/
  cursor: pointer;
`;

export default TemplateJobcodeSearch;
