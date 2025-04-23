import React from "react";
import Modal from "react-modal";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { closeLightbox } from "../../reducers/lightbox";
import PrimaryButton from "../atoms/PrimaryButton";

const Component: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.lightbox.isOpen);

  const handleClose = () => {
    dispatch(closeLightbox());
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={handleClose} style={customStyles}>
      <Container>
        <Content>
          <Media />
        </Content>
        <Footer>
          <PrimaryButton text="Close" onClick={handleClose} />
        </Footer>
      </Container>
    </Modal>
  );
};

const Media: React.FC = () => {
  const media = useAppSelector((state) => state.lightbox.media);

  if (!media) return <></>;

  switch (media.type) {
    case "image":
      return <Image src={media.url} />;
    case "video":
      return <Video src={media.url} controls />;
    default:
      return <></>;
  }
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #555;
  margin-bottom: 10px;
`;

const Image = styled.img`
  max-width: 100%;
`;

const Video = styled.video`
  max-width: 100%;
`;

const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const customStyles: Modal.Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.8)",
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 970000000 /* reapop(999999999)の2つ下 */,
  },
  content: {
    position: "static",
    width: "600px",
    height: "auto",
  },
};

export default Component;
