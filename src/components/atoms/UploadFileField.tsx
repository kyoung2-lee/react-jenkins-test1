import React, { CSSProperties } from "react";
import DropZone from "react-dropzone";
import styled from "styled-components";
import Clip from "../../assets/images/icon/clip_prime.svg";

interface Props {
  style?: CSSProperties;
  disabled: boolean;
  onDrop: (files: File[]) => void;
  text?: string;
  accept?: string;
}

const DEFAULT_TEXT = "Click & Select or Drop files here.";

const UploadFileField = (props: Props) => {
  const { style = {}, disabled = false, onDrop, text, accept } = props;

  const styles = {
    dropZone: {
      width: "auto",
      height: "auto",
      lineHeight: "40px",
      color: "#346181",
      borderWidth: 2,
      borderStyle: "dashed",
      borderColor: "#346181",
      borderRadius: 5,
      textAlign: "center" as const,
      padding: 5,
      cursor: disabled ? "inherit" : "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    active: {
      borderStyle: "solid",
      backgroundColor: "#eee",
      borderWidth: 2,
      borderRadius: 5,
    },
    reject: {
      borderStyle: "solid",
      backgroundColor: "#fdd",
      borderWidth: 2,
      borderRadius: 5,
    },
  };

  return (
    <DropZone
      activeStyle={{ ...styles.active, ...style }}
      rejectStyle={styles.reject}
      style={styles.dropZone}
      disabled={disabled}
      onDrop={onDrop}
      accept={accept || ""}
    >
      <ClipIcon />
      <Text>{text || DEFAULT_TEXT}</Text>
    </DropZone>
  );
};

const ClipIcon = styled.img.attrs({ src: Clip })``;

const Text = styled.div`
  margin-left: 5px;
  display: inline;
`;

export default UploadFileField;
