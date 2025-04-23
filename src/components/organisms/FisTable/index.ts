import { List } from "immutable";
import { connect } from "react-redux";
import { reset as resetOthreForm, change as changeOthreForm, getFormValues } from "redux-form";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "../../../store/storeType";
import * as fisExports from "../../../reducers/fis";
import { FisRow } from "../../../reducers/fisType";
import * as fisFilterModalExports from "../../../reducers/fisFilterModal";
import { SearchParams } from "../../../reducers/fisFilterModal";
import { HeaderInfo } from "../../../reducers/common";
import { JobAuth, Master } from "../../../reducers/account";
import FisTable from "./FisTable";
import searchFisRowsSelector from "./selector";

interface Props {
  headerInfo: HeaderInfo;
  fis: fisExports.FisState;
  jobAuth: JobAuth;
  master: Master;
  zoomFis: number;
  isAutoReload: boolean;
  isSelfScroll: boolean;
  filteredFisRows: List<{ date: string; fis: FisRow }>;
  fisFilterModal: fisFilterModalExports.FisFilterModalState;
  fisFilterModalFormValues: SearchParams;
}

const mapStateToProps = (state: RootState): Props => ({
  headerInfo: state.common.headerInfo,
  fis: state.fis,
  jobAuth: state.account.jobAuth,
  master: state.account.master,
  zoomFis: state.account.zoomFis,
  isAutoReload: state.fis.headerSettings.isAutoReload,
  isSelfScroll: state.fis.headerSettings.isSelfScroll,
  filteredFisRows: searchFisRowsSelector(state),
  fisFilterModal: state.fisFilterModal,
  fisFilterModalFormValues: getFormValues("fisFilterModal")(state) as SearchParams,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _fisDefault, slice: _fisSlice, doQueueFunctionAll: _doQueueFunctionAll, ...fisActions } = fisExports;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _fisFilterModalDefault, slice: _fisFilterModalSlice, ...fisFilterModalActions } = fisFilterModalExports;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  ...bindActionCreators(
    {
      ...fisActions,
      ...fisFilterModalActions,
      resetOthreForm,
      changeOthreForm,
    },
    dispatch
  ),
});

const enhancer = connect(mapStateToProps, mapDispatchToProps);

export default enhancer(FisTable);
