import React from "react";
import dayjs from "dayjs";
import Modal from "react-modal";
import styled, { keyframes } from "styled-components";
import layoutStyle from "../../../styles/layoutStyle";
import * as myScheduleExports from "../../../reducers/mySchedule";
import MyScheduleTimeChart from "../../molecules/MySchedule/MyScheduleTimeChart";
import MyScheduleDetail from "../../molecules/MySchedule/MyScheduleDetail";
import MyScheduleFis from "../../molecules/MySchedule/MyScheduleFis";
import PrimaryButton from "../../atoms/PrimaryButton";
import { Const } from "../../../lib/commonConst";
import { storage } from "../../../lib/storage";
import { funcAuthCheck } from "../../../lib/commonUtil";
import HeaderClockIcon from "../../../assets/images/icon/icon-clock-skeleton.svg?component";
import media from "../../../styles/media";
import { TimeScale } from "../../../reducers/mySchedule";
import { JobAuth } from "../../../reducers/account";
import { HeaderInfo } from "../../../reducers/common";
import SelectAirPortIconSvg from "../../../assets/images/icon/icon-fis-select-target-popup.svg";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _myScheduleDefault, slice: _myScheduleSlice, ...myScheduleActions } = myScheduleExports;

type Props = typeof myScheduleActions & {
  jobAuth: JobAuth;
  headerInfo: HeaderInfo;
  myScheduleState: myScheduleExports.MyScheduleState;
  getMyScheduleInfo: typeof myScheduleExports.getMyScheduleInfo;
  changeTimeScale: typeof myScheduleExports.changeTimeScale;
};

type State = {
  selectedTimeScale: TimeScale;
  isTimeScaleModalActive: boolean;
  myScheduleContainerHeight: number;
};

class MySchedule extends React.Component<Props, State> {
  private timeChartRef: React.RefObject<MyScheduleTimeChart>;
  private detailRef: React.RefObject<MyScheduleDetail>;
  private myScheduleHeaderRef: React.RefObject<HTMLDivElement>;
  private fisRowRef: React.RefObject<HTMLDivElement>;
  private timer: NodeJS.Timeout | undefined;

  constructor(props: Props) {
    super(props);

    this.timeChartRef = React.createRef();
    this.detailRef = React.createRef();
    this.myScheduleHeaderRef = React.createRef<HTMLDivElement>();
    this.fisRowRef = React.createRef<HTMLDivElement>();
    this.timer = undefined;

    this.state = {
      selectedTimeScale: props.myScheduleState.timeScale,
      isTimeScaleModalActive: false,
      myScheduleContainerHeight: 0,
    };

    this.openTimeScaleModal = this.openTimeScaleModal.bind(this);
    this.closeTimeScaleModal = this.closeTimeScaleModal.bind(this);
    this.selectTimeScale = this.selectTimeScale.bind(this);
    this.submitTimeScale = this.submitTimeScale.bind(this);
    this.handleClickUpdOkButton = this.handleClickUpdOkButton.bind(this);
    this.addEventHandlerOrientationAndResize = this.addEventHandlerOrientationAndResize.bind(this);
    this.onResize = this.onResize.bind(this);
    this.childResizeFuncs = this.childResizeFuncs.bind(this);
  }

  componentDidMount() {
    this.props.getMyScheduleInfo();
    this.addEventHandlerOrientationAndResize();
    this.resizeMyScheduleContainerHeight();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.myScheduleState.fisState !== prevProps.myScheduleState.fisState) {
      this.resizeMyScheduleContainerHeight();
    }
    if (this.props.myScheduleState.timeChartState !== prevProps.myScheduleState.timeChartState) {
      if (this.timeChartRef.current) {
        void this.timeChartRef.current.timeChartSettings();
      }
    }
  }

  componentWillUnmount() {
    window.onresize = null;
    window.removeEventListener("orientationchange", this.onResize);
    this.timer = undefined;
  }

  /**
   * pcリサイズ・iPad回転時の対応
   */
  addEventHandlerOrientationAndResize = () => {
    if (storage.terminalCat === Const.TerminalCat.iPad) {
      window.addEventListener("orientationchange", this.onResize);
    } else {
      window.onresize = this.onResize;
    }
  };

  resizeMyScheduleContainerHeight = () => {
    if (!this.myScheduleHeaderRef.current) return;
    const height = (this.myScheduleHeaderRef.current as HTMLElement).clientHeight;
    const commonHeader = storage.isPc ? parseInt(layoutStyle.header.default, 10) : parseInt(layoutStyle.header.tablet, 10) + 57;
    const vh = window.innerHeight;
    const fisHeight = (this.fisRowRef.current as HTMLElement) ? (this.fisRowRef.current as HTMLElement).clientHeight : 0;
    this.setState({ myScheduleContainerHeight: vh - (height + commonHeader + fisHeight) });
  };

  onResize = () => {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = setTimeout(this.childResizeFuncs, 200);
  };

  childResizeFuncs = () => {
    if (!this.timeChartRef.current || !this.detailRef.current) return;
    this.resizeMyScheduleContainerHeight();
    void this.timeChartRef.current.timeChartSettings();
    this.detailRef.current.setPaddingsAndScroll();
  };

  openTimeScaleModal = () => {
    this.setState({ isTimeScaleModalActive: true });
  };

  selectTimeScale = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ selectedTimeScale: e.target.value as TimeScale });
  };

  submitTimeScale = () => {
    this.setState({ isTimeScaleModalActive: false });
    this.props.changeTimeScale({ timeScale: this.state.selectedTimeScale });
  };

  handleClickUpdOkButton = () => {
    this.props.closeNotice();
  };

  closeTimeScaleModal = () => {
    // this.setState({ isTimeScaleModalActive: false, selectedTimeScale: this.state.selectedTimeScale }); // 元コード
    // this.setState((prevState) => ({ isTimeScaleModalActive: false, selectedTimeScale: prevState.selectedTimeScale })); // 推測される用途コード
    this.setState({ isTimeScaleModalActive: false });
  };

  render() {
    const { changeActiveDetailTask, updateMyScheduleInfo, myScheduleState, jobAuth } = this.props;
    const { timeScale, fisState, isShowContent, timeChartState, selectedTaskId } = myScheduleState;
    const { isTimeScaleModalActive } = this.state;
    const workStartTime = dayjs(timeChartState.workStartTime);
    const workEndTime = dayjs(timeChartState.workEndTime);
    const { isPc } = storage;

    return (
      <Wrapper>
        <MyScheduleHeader isPc={isPc} ref={this.myScheduleHeaderRef}>
          <LeftSideHeader>
            <>
              <HeaderClockIcon />
              {`${timeScale}h`}
              <SelectAirPortIcon onClick={this.openTimeScaleModal} />
            </>
          </LeftSideHeader>

          <RightSideHeader>
            {timeChartState.workStartTime && (
              <>
                {/* eslint-disable-next-line no-irregular-whitespace */}
                <div>My Schedule:　</div>
                <div>
                  <SdlDateDDMMM>{workStartTime.format("DDMMM").toLocaleUpperCase()}</SdlDateDDMMM>
                  <span>{workStartTime.format("HH:mm")}</span>L<SdlConcat>-</SdlConcat>
                  {dayjs(workEndTime).hour(0).minute(0).diff(dayjs(workStartTime).hour(0).minute(0), "days") > 0 && (
                    <SdlDateDDMMM>{workEndTime.format("DDMMM").toLocaleUpperCase()}</SdlDateDDMMM>
                  )}
                  <span>{workEndTime.format("HH:mm")}</span>L
                </div>
              </>
            )}
          </RightSideHeader>
        </MyScheduleHeader>
        <MyScheduleContainer>
          <MyScheduleContents height={this.state.myScheduleContainerHeight}>
            {/* My Schedule TimeChart */}
            {isShowContent && (
              <MyScheduleTimeChart
                ref={this.timeChartRef}
                timeScale={timeScale}
                timeChartState={timeChartState}
                selectedTaskId={selectedTaskId}
                isShowFis={!!myScheduleState.fisState}
                changeActiveDetailTask={changeActiveDetailTask}
                contentHeight={this.state.myScheduleContainerHeight}
              />
            )}

            {/* My Schedule Detail */}
            {isShowContent && (
              <MyScheduleDetail
                ref={this.detailRef}
                jobAuth={jobAuth}
                selectedTaskId={myScheduleState.selectedTaskId}
                timeChartState={myScheduleState.timeChartState}
                dtlSchedule={myScheduleState.dtlSchedule}
                changeActiveDetailTask={changeActiveDetailTask}
                updateMyScheduleInfo={updateMyScheduleInfo}
                isUpdate={myScheduleState.isUpdate}
                isShowFis={!!myScheduleState.fisState}
              />
            )}
          </MyScheduleContents>
          {/* My Schedule FIS */}
          {fisState && fisState.fisRow && (
            <FisWrapper ref={this.fisRowRef}>
              <MyScheduleFis jobAuth={this.props.jobAuth} headerInfo={this.props.headerInfo} fis={fisState} />
            </FisWrapper>
          )}
        </MyScheduleContainer>

        {/* アサイン変更確認ポップアップ */}
        <Modal isOpen={timeChartState.changeNoticeStatus} style={updConfirmPopupStyles}>
          <UpdTextTitle>Your Assign has been changed!</UpdTextTitle>
          <UpdTextsWrapper>{timeChartState.changeNotice}</UpdTextsWrapper>
          <UpdateButtonWrapper>
            <PrimaryButton text="OK" type="button" onClick={this.handleClickUpdOkButton} />
          </UpdateButtonWrapper>
        </Modal>

        {/* タイムスケール選択モーダル */}
        <Modal isOpen={isTimeScaleModalActive} style={customModalStyles} onRequestClose={this.closeTimeScaleModal}>
          <TimeScaleWrapper>
            <TimeScaleTitle>Time Scale</TimeScaleTitle>
            <TimeScaleRadioButtons>
              {!isPc && (
                <RadioButtonWrapper>
                  <RadioButton
                    id="4h"
                    value="4"
                    type="radio"
                    onChange={this.selectTimeScale}
                    checked={this.state.selectedTimeScale === "4"}
                  />
                  <label htmlFor="4h">4h</label>
                </RadioButtonWrapper>
              )}
              <RadioButtonWrapper>
                <RadioButton
                  id="8h"
                  value="8"
                  type="radio"
                  onChange={this.selectTimeScale}
                  checked={this.state.selectedTimeScale === "8"}
                />
                <label htmlFor="8h">8h</label>
              </RadioButtonWrapper>
              {isPc && (
                <RadioButtonWrapper>
                  <RadioButton
                    id="12h"
                    value="12"
                    type="radio"
                    onChange={this.selectTimeScale}
                    checked={this.state.selectedTimeScale === "12"}
                  />
                  <label htmlFor="12h">12h</label>
                </RadioButtonWrapper>
              )}
            </TimeScaleRadioButtons>
            <SubmitWrapper isPc={isPc}>
              <PrimaryButton text="Search" type="button" onClick={this.submitTimeScale} />
            </SubmitWrapper>
          </TimeScaleWrapper>
        </Modal>
      </Wrapper>
    );
  }
}

const customModalStyles: ReactModal.Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    position: "absolute",
    width: "190px",
    height: "152px",
    padding: "9px 12px",
    top: "130px",
    left: "10px",
    right: "unset",
    bottom: "unset",
    margin: "auto",
    borderRadius: "1px",
    border: "1px solid rgb(204, 204, 204)",
    background: "#fff",
    overflow: "auto",
    outline: "none",
  },
};

const updConfirmPopupStyles: ReactModal.Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    position: "absolute",
    width: "400px",
    height: "420px",
    padding: "9px 12px",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    margin: "auto",
    borderRadius: "1px",
    border: "1px solid rgb(204, 204, 204)",
    background: "#fff",
    overflow: "auto",
    outline: "none",
    fontFamily: "Verdana",
    fontWeight: 500,
  },
};

const Wrapper = styled.div`
  background-color: #eeeeee;
`;

const MyScheduleContainer = styled.div`
  background-color: #c9d3d0;
  width: 100%;
  max-width: ${Const.MAX_WIDTH};
  margin: auto;
  overflow: hidden;
`;

const MyScheduleHeader = styled.div<{ isPc: boolean }>`
  display: flex;
  height: 32px;
  background: linear-gradient(to right, rgb(53, 186, 184), rgb(39, 153, 198));

  > div {
    ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
  }
`;

const SelectAirPortIcon = styled.img.attrs({
  src: SelectAirPortIconSvg,
})`
  cursor: pointer;
  width: 19px;
  height: 13px;
  margin-bottom: 5px;
`;

const LeftSideHeader = styled.div`
  min-width: 640px;
  ${media.greaterThan("desktopL")`
    min-width: calc(640px + 160px);
  `};
  ${media.lessThan("desktopL")`
    min-width: 543px;
  `};
  ${media.lessThan("desktopM")`
    min-width: 369px;
  `};
  border-bottom: none;
  padding-bottom: 2px;
  padding-left: 11px;
  border-right: none;
  color: #fff;
  background: transparent;
  display: flex;
  align-items: flex-end;
  font-size: 20px;
  svg {
    width: 15px;
    margin-right: 2px;
    margin-bottom: 5px;
  }
`;

const RightSideHeader = styled.div`
  width: 100%;
  background: transparent;
  color: ${(props) => props.theme.color.WHITE};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;

  > div:first-child {
    font-size: 20px;
  }
`;

const SdlDateDDMMM = styled.span`
  margin-right: 5px;
`;

const SdlConcat = styled.span`
  margin: 0px 5px 0px 5px;
`;

const TimeScaleWrapper = styled.form`
  display: flex;
  flex-direction: column;
`;

const TimeScaleTitle = styled.div`
  font-size: 12px;
  line-height: 16px;
  margin-bottom: 19px;
`;

const TimeScaleRadioButtons = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  margin-bottom: 20px;
`;

const RadioButtonWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const RadioButton = styled.input`
  margin-right: 5px;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #346181;
  background: #fff;
  position: relative;
  outline: none;
  &:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }
  &:checked {
    border-color: #346181;
    background: #346181;
  }
  &:checked:before {
    content: "";
    display: block;
    position: absolute;
    top: 6px;
    left: 6px;
    width: 10.5px;
    height: 10.5px;
    background: #fff;
    border-radius: 50%;
  }
`;

const SubmitWrapper = styled.div<{ isPc: boolean }>`
  width: 100px;
  align-self: center;
  button {
    ${({ isPc }) => (isPc ? "" : "font-weight: 500;")};
  }
`;

const MyScheduleContents = styled.div<{ height?: number }>`
  position: relative;
  display: flex;
  overflow: hidden;
  height: ${({ height }) => `${height || 0}px`};
`;

const visibleFisContent = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const FisWrapper = styled.div`
  box-shadow: 0 0px 10px 0 rgba(0, 0, 0, 0.3);
  animation: ${visibleFisContent} 0.6s ease-in-out;
  animation-direction: reverse;
`;

const UpdTextsWrapper = styled.p`
  width: 100%;
  height: 260px;
  overflow-y: auto;
  padding: 0px 50px 0px 50px;
  white-space: pre-wrap;
  line-height: 1.2;
  -webkit-overflow-scrolling: touch;
`;

const UpdateButtonWrapper = styled.div`
  width: 100px;
  height: 44px;
  margin: 0 auto;
`;

const UpdTextTitle = styled.div`
  text-align: center;
  padding: 20px;
`;

export default MySchedule;
