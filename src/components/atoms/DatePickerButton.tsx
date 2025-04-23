import React, { forwardRef, Component } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import calenderIcon from "../../assets/images/icon/icon-calender.svg";

interface Props {
  selected: Date | null;
  onChange: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  tabIndex?: number;
  startOpen?: boolean;
  size?: number;
  style?: React.CSSProperties;
}

class DatePickerButton extends Component<Props> {
  render() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line react/no-unstable-nested-components, react/prop-types
    const CustomInput = forwardRef<HTMLButtonElement>(({ onClick }, _ref) => (
      // eslint-disable-next-line react/no-this-in-sfc, @typescript-eslint/no-unsafe-assignment
      <Button type="button" tabIndex={this.props.tabIndex} onClick={onClick} size={this.props.size}>
        <img src={calenderIcon} alt="" />
      </Button>
    ));
    return (
      <DatePickerWrapper style={this.props.style}>
        <DatePicker
          selected={this.props.selected}
          onChange={this.props.onChange}
          customInput={<CustomInput />}
          minDate={this.props.minDate}
          maxDate={this.props.maxDate}
          startOpen={this.props.startOpen}
        />
      </DatePickerWrapper>
    );
  }
}

const DatePickerWrapper = styled.div`
  .react-datepicker-popper {
    transform-origin: left top;
    transform: translate3d(26px, 26px, 0px) scale(1.15) !important;
  }
  .react-datepicker__triangle {
    left: 66px !important;
    transform: translate(113px, 0px) !important;
  }
  .react-datepicker {
    font-family: ${({ theme }) => theme.color.DEFAULT_FONT_FAMILY};
    font-size: 16px;
  }
  .react-datepicker__current-month,
  .react-datepicker-time__header,
  .react-datepicker-year-header {
    font-size: 16px;
  }
  .react-datepicker__header {
    border-bottom: none;
  }
  .react-datepicker__navigation-icon {
    &::before {
      border-color: ${({ theme }) => theme.color.button.PRIMARY};
    }
    &:hover::before {
      border-color: ${({ theme }) => theme.color.button.PRIMARY_HOVER};
    }
  }
  .react-datepicker__day {
    color: ${({ theme }) => theme.color.PRIMARY};
  }
  .react-datepicker__day--disabled {
    color: #ccc;
  }
  .react-datepicker__day--selected {
    background-color: #e6b422; // 基本色
    opacity: 1;
    color: #fff;
    &.react-datepicker__day--disabled {
      background-color: #e9ca6e;
    }
    &:hover {
      background-color: #dbaa18;
    }
    &:hover.react-datepicker__day--disabled {
      background-color: #e9ca6e;
    }
  }
  .react-datepicker__day--today:not(.react-datepicker__day--selected) {
    border-radius: 0.3em;
    font-weight: unset;
    background-color: ${({ theme }) => theme.color.button.PRIMARY};
    opacity: 0.4;
    color: #fff;
    &:hover:not(.react-datepicker__day--disabled) {
      background-color: ${({ theme }) => theme.color.button.PRIMARY};
      opacity: 0.5;
    }
  }
  .react-datepicker__day--keyboard-selected:not(.react-datepicker__day--today) {
    background-color: unset;
    &:hover {
      background-color: unset;
    }
  }
`;

const Button = styled.button<{ size?: number }>`
  padding: 0;
  width: ${({ size }) => `${size || "26"}px`};
  height: ${({ size }) => `${size || "26"}px`};
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  > img {
    width: 100%;
    height: 100%;
  }
`;

export default DatePickerButton;
