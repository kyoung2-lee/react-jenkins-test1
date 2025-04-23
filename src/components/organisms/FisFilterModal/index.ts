import { connect } from "react-redux";
import { getFormSyncErrors, getFormValues, FormState } from "redux-form";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "../../../store/storeType";
import { openFlightNumberInputPopup } from "../../../reducers/flightNumberInputPopup";
import { removeAllNotification } from "../../../reducers/common";
import * as fisFilterModalExports from "../../../reducers/fisFilterModal";
import { SearchParams } from "../../../reducers/fisFilterModal";
import { Master } from "../../../reducers/account";
import FisFilterModal from "./FisFilterModal";

interface Props {
  fisFilterModal: fisFilterModalExports.FisFilterModalState;
  master: Master;
  formValues: SearchParams;
  formSyncErrors: Partial<SearchParams>;
  fisFilterModalForm: FormState;
}

const mapStateToProps = (state: RootState): Props => ({
  fisFilterModal: state.fisFilterModal,
  master: state.account.master,
  formValues: getFormValues("fisFilterModal")(state) as SearchParams,
  formSyncErrors: getFormSyncErrors("fisFilterModal")(state) as Partial<SearchParams>,
  fisFilterModalForm: state.form.fisFilterModal,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { default: _default, slice, ...fisFilterModalActions } = fisFilterModalExports;

const mapDispatchToProps = (dispatch: Dispatch) => ({
  ...bindActionCreators(
    {
      ...fisFilterModalActions,
      openFlightNumberInputPopup,
      removeAllNotification,
    },
    dispatch
  ),
});

const enhancer = connect(mapStateToProps, mapDispatchToProps);

export default enhancer(FisFilterModal);
