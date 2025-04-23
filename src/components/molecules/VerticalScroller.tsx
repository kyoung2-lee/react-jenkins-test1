import React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export class VerticalScroller extends React.PureComponent<Props> {
  private currentX = 0;
  private scrolling = false;

  private startScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    this.currentX = e.clientX;
    this.scrolling = true;
  };

  private scroll = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!this.scrolling) return;
    // eslint-disable-next-line no-param-reassign
    e.currentTarget.scrollLeft += this.currentX - e.clientX;
    this.currentX = e.clientX;
  };

  private stopScroll = () => {
    this.scrolling = false;
  };

  render() {
    const { children, className } = this.props;
    return (
      <Container
        onMouseDown={this.startScroll}
        onMouseMove={this.scroll}
        onMouseUp={this.stopScroll}
        onMouseLeave={this.stopScroll}
        className={className}
      >
        {children}
      </Container>
    );
  }
}

const Container = styled.div`
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
`;
