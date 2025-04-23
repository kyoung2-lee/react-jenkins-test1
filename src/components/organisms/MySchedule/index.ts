import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import MySchedule from "./MySchedule";
import * as myScheduleExports from "../../../reducers/mySchedule";
import { RootState } from "../../../store/storeType";
import { HeaderInfo } from "../../../reducers/common";
import { JobAuth } from "../../../reducers/account";

interface Props {
  headerInfo: HeaderInfo;
  jobAuth: JobAuth;
  myScheduleState: myScheduleExports.MyScheduleState;
}

const mapStateToProps = (state: RootState): Props => ({
  headerInfo: state.common.headerInfo,
  jobAuth: state.account.jobAuth,
  myScheduleState: state.mySchedule,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _myScheduleDefault, slice: _myScheduleSlice, ...myScheduleActions } = myScheduleExports;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  ...bindActionCreators(
    {
      ...myScheduleActions,
    },
    dispatch
  ),
});

const enhancer = connect(mapStateToProps, mapDispatchToProps);

export default enhancer(MySchedule);
