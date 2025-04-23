import React from "react";
import Modal from "react-modal";
import { Field } from "redux-form";
import styled from "styled-components";
import * as issueSecurityValidates from "../../../lib/validators/issueSecurityValidator";
import PrimaryButton from "../../atoms/PrimaryButton";
import SecondaryButton from "../../atoms/SecondaryButton";
import SelectBox from "../../atoms/SelectBox";
import TextInput from "../../atoms/TextInput";
// eslint-disable-next-line import/no-cycle
import { Flex, ModalButtonGroup, Row, TEMPLATE_FILTER_SEND_BY } from "./Broadcast";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onKeywordKeyPress: (e: React.KeyboardEvent<HTMLElement>) => void;
  onClickClear: () => void;
  onClickFilter: () => void;
}

const TemplateFilterModal: React.FC<Props> = (props) => (
  <Modal isOpen={props.isOpen} style={style} onRequestClose={props.onRequestClose}>
    <Row width={360}>
      <TemplateFilterConditions>
        <SearchModalLabel>Keyword</SearchModalLabel>
        <Flex position="center">
          <SearchModalFieldContainer>
            <Field
              name="keyword"
              autoCapitalize="off"
              component={TextInput as "input" & typeof TextInput}
              width={320}
              maxLength={100}
              onKeyPress={props.onKeywordKeyPress}
              autoFocus
              isShadowOnFocus
            />
          </SearchModalFieldContainer>
        </Flex>
        <SearchModalLabel>Send by</SearchModalLabel>
        <Flex>
          <SearchModalFieldContainer>
            <Field
              name="sendBy"
              component={SelectBox as "select" & typeof SelectBox}
              options={TEMPLATE_FILTER_SEND_BY}
              width={140}
              validate={[issueSecurityValidates.duplicationEmailAddrGrp]}
              hasBlank
              isShadowOnFocus
              componentOnKeyDown={props.onKeywordKeyPress}
            />
          </SearchModalFieldContainer>
        </Flex>
      </TemplateFilterConditions>
      <ModalButtonGroup margin="25px auto">
        <SecondaryButton text="Clear" type="button" onClick={props.onClickClear} />
        <PrimaryButton text="Filter" type="button" onClick={props.onClickFilter} />
      </ModalButtonGroup>
    </Row>
  </Modal>
);

const style = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    width: "360px",
    left: "calc(50% - 200px)",
    padding: 0,
    height: "304px",
    top: "calc(100vh/2 - 250px)",
    border: "none",
    overflow: "visible",
  },
};

const TemplateFilterConditions = styled.div`
  height: 200px;
  overflow: visible;
`;

const SearchModalLabel = styled.div`
  background: #119ac2;
  color: white;
  padding: 4px 20px;
  font-size: 12px;
`;

const SearchModalFieldContainer = styled.div`
  padding: 20px;
`;

export default TemplateFilterModal;
