import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import CloseButton from "../../atoms/CloseButton";

type DetailModalComponentProps = string;

interface Props {
  header: string;
  isOpen: boolean;
  style: object;
  onRequestClose: () => void;
  // eslint-disable-next-line react/no-unused-prop-types
  isPc: boolean;
  data: DetailModalComponentProps[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  DetailComponent: React.ComponentType<any>;
}

const DetailModal: React.FC<Props> = (props) => {
  const { isOpen, style, onRequestClose, header, data, DetailComponent } = props;
  return (
    <Modal isOpen={isOpen} style={style} onRequestClose={onRequestClose}>
      <ModalHeader>
        <div>{header}</div>
        <CloseButton onClick={onRequestClose} />
      </ModalHeader>
      <AddressDetailContainer>
        {data.map((row: string) => (
          <DetailComponent key={row} row={row} />
        ))}
      </AddressDetailContainer>
    </Modal>
  );
};

const ModalHeader = styled.div`
  padding-bottom: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  > div {
    font-size: 12px;
  }
`;

const AddressDetailContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  padding: 0 22px;
  margin: 0 -11px;
  max-height: calc(100vh - 140px);
  overflow-y: scroll;
`;

export default DetailModal;
