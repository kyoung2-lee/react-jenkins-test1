import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import { RootState } from "../../../store/storeType";
// eslint-disable-next-line import/no-cycle
import { FormValues } from "../../../reducers/multipleFlightMovementModals";
import { MultipleFlightMovementModal, MyProps, onSubmit } from "./MultipleFlightMovementModal";

// コネクト
export const formName = "multipleflightMovementDep";

const MultipleFlightMovementModalWithForm = reduxForm<FormValues, MyProps>({
  form: formName,
  onSubmit, // submitをここで設定しないと、ポップアップ入力画面からRemoteSubmitできない。
  enableReinitialize: false,
})(MultipleFlightMovementModal);

export default connect((state: RootState) => ({
  isDep: true,
  modal: state.multipleFlightMovementModals.modalDep,
  rowStatusList: state.multipleFlightMovementModals.modalDep.rowStatusList,
  initialValues: state.multipleFlightMovementModals.modalDep.initialFormValues,
}))(MultipleFlightMovementModalWithForm);
