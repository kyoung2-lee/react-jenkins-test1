import React from "react";
import Modal from "react-modal";
import { Field } from "redux-form";
import styled from "styled-components";
import * as validates from "../../../lib/validators";
import PrimaryButton from "../../atoms/PrimaryButton";
import TextInput from "../../atoms/TextInput";
// eslint-disable-next-line import/no-cycle
import { ModalButtonGroup, Row } from "./Broadcast";

interface Props {
  isOpen: boolean;
  onRequestClose: () => void;
  onTemplateNameKeyPress: (e: React.KeyboardEvent<HTMLInputElement> & React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line react/no-unused-prop-types
  onClickCancel: () => void;
  onClickSave: () => void;
}

const TemplateNameEditModal: React.FC<Props> = (props) => (
  <Modal isOpen={props.isOpen} style={style} onRequestClose={props.onRequestClose}>
    <ModalBody>
      <Row>
        <ModalHeader>Template Name</ModalHeader>
        <Field
          name="templateName"
          autoCapitalize="off"
          autoFocus
          component={TextInput as "input" & typeof TextInput}
          width="100%"
          maxLength={50}
          validate={[validates.required]}
          onKeyPress={props.onTemplateNameKeyPress}
        />
        <ModalButtonGroup>
          <PrimaryButton text="Save" type="button" onClick={props.onClickSave} />
        </ModalButtonGroup>
      </Row>
    </ModalBody>
  </Modal>
);

const style = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    width: "500px",
    left: "calc(50% - 250px)",
    padding: 0,
    height: "220px",
    top: "calc(100vh/2 - 150px)",
    overflow: "hidden",
  },
};

const ModalBody = styled.div`
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalHeader = styled.div`
  margin: 15px 0;
`;

export default TemplateNameEditModal;
