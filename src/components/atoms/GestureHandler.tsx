import React from "react";
import Hammer from "react-hammerjs";

const options = {
  recognizers: {
    doubletap: {
      // ダブルタップで画面が拡大縮小しないように、
      // ブラウザより長めにタップの感覚を許容しています。
      interval: 500,
    },
  },
};

const GestureHandler: React.FC<Hammer.ReactHammerProps> = ({ children, onDoubleTap }) => (
  <Hammer onDoubleTap={onDoubleTap} options={options}>
    {/* Hammerが生タグじゃないとエラーになるのでdivをおいてます */}
    <div>{children}</div>
  </Hammer>
);

export default GestureHandler;
