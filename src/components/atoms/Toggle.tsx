import React from "react";
import Switch, { ReactSwitchProps } from "react-switch";
import styled, { css } from "styled-components";
import colorStyleLight from "../../styles/colorStyleLight";
import colorStyleDark from "../../styles/colorStyleDark";

export type ToggleProps = ReactSwitchProps & {
  tabIndex?: number;
  isDarkMode?: boolean;
  smallSize?: boolean;
};

class Toggle extends React.Component<ToggleProps> {
  render() {
    const { isDarkMode, smallSize, ...switchProps } = this.props;
    const onColor = isDarkMode ? colorStyleDark.button.PRIMARY : colorStyleLight.button.PRIMARY;
    const offColor = isDarkMode ? colorStyleDark.button.PRIMARY_OFF : colorStyleLight.button.PRIMARY_OFF;
    const handleColor = isDarkMode ? colorStyleDark.PRIMARY_BASE : colorStyleLight.PRIMARY_BASE;
    const hoverBgColor = switchProps.checked
      ? isDarkMode
        ? colorStyleDark.button.PRIMARY_HOVER
        : colorStyleLight.button.PRIMARY_HOVER
      : isDarkMode
      ? colorStyleDark.button.PRIMARY_OFF_HOVER
      : colorStyleLight.button.PRIMARY_OFF_HOVER;
    const handleDiameter = smallSize ? 20 : 24;
    const height = smallSize ? 24 : 28;
    const width = smallSize ? 43 : 50;
    return (
      <Wrapper disabled={switchProps.disabled} hoverBgColor={hoverBgColor}>
        <Switch
          className="react-switch"
          onColor={onColor}
          offColor={offColor}
          onHandleColor={handleColor}
          offHandleColor={handleColor}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="1px 1px 3px rgba(0, 0, 0, 0.4)"
          handleDiameter={handleDiameter}
          height={height}
          width={width}
          {...switchProps}
        />
      </Wrapper>
    );
  }
}
const Wrapper = styled.div<{ disabled: boolean | undefined; hoverBgColor: string }>`
  ${({ disabled, hoverBgColor }) => {
    if (!disabled) {
      /* カラーテーマを反映するためカラーはcssで指定する */
      return css`
        .react-switch:hover {
          .react-switch-bg {
            background: ${hoverBgColor} !important;
          }
        }
      `;
    }
    return null;
  }}
`;

export default Toggle;
