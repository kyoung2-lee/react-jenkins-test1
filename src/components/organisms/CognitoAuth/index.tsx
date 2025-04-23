import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { RootState } from "../../../store/storeType";
import { CognitoAuth } from "./CognitoAuth";

const mapStateToProps = (_state: RootState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  dispatch,
  ...bindActionCreators({}, dispatch),
});

const enhancer = connect(mapStateToProps, mapDispatchToProps);

export default enhancer(CognitoAuth);
