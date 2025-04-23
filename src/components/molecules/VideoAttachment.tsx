import React, { useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { openLightbox } from "../../reducers/lightbox";

interface Props {
  url: string;
  // eslint-disable-next-line react/no-unused-prop-types
  openLightbox: typeof openLightbox;
  onClick: () => void;
}

const Component: React.FC<Props> = (props) => {
  const [duration, setDuration] = useState<string | undefined>(undefined);

  const handleLoaded = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const durationOfSeconds = Math.floor(e.currentTarget.duration);
    const minutes = Math.floor(durationOfSeconds / 60);
    const seconds = durationOfSeconds % 60;

    setDuration(`${`00${minutes}`.slice(-2)}:${`00${seconds}`.slice(-2)}`);
  };

  // private handleClick = () => {
  //   this.props.openLightbox({ url: this.props.url, type: "video" });
  // };

  return (
    <Container onClick={props.onClick}>
      <Video src={props.url} onLoadedMetadata={handleLoaded} />
      {duration && <Duration>{duration}</Duration>}
    </Container>
  );
};

export const VideoAttachment = connect(null)(Component);

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

const Video = styled.video`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Duration = styled.span`
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  position: absolute;
  bottom: 5px;
  right: 5px;
`;
