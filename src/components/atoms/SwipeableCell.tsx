import React, { ReactNode } from "react";
import Hammer, { ReactHammerProps } from "react-hammerjs";

interface Props {
  children: ReactNode;
  onPanStart: () => void;
  onPan: ReactHammerProps["onPan"];
  onPanEnd: ReactHammerProps["onPanEnd"];
  deltaX: number;
  transitionDuration?: number;
  disabled: boolean;
}

const SwipeableCell = (props: Props) => {
  const { deltaX, transitionDuration, onPanStart, onPan, onPanEnd, children, disabled = false } = props;
  if (disabled) {
    return <>{children}</>;
  }
  return (
    <Hammer {...{ onPanStart, onPan, onPanEnd }}>
      <div
        style={{
          transform: `translate(${deltaX}px, 0)`,
          transition: `transform ${transitionDuration || 250}ms ease-out 0s`,
        }}
      >
        {children}
      </div>
    </Hammer>
  );
};

export default SwipeableCell;
