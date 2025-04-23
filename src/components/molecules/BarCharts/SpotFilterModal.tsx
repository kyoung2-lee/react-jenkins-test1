import React, { useEffect, useState } from "react";
import Modal, { Styles } from "react-modal";
import { connect } from "react-redux";
import { Field, getFormValues, InjectedFormProps, reduxForm } from "redux-form";
import styled from "styled-components";
import { storage } from "../../../lib/storage";
import { RootState } from "../../../store/storeType";
import { useAppDispatch, useAppSelector, usePrevious } from "../../../store/hooks";
import { closeSpotFilterModal, enterSpotFilterModal, showConfirmation } from "../../../reducers/spotFilterModal";
import { getHiddenSpotNoList, saveHiddenSpotNo } from "../../../reducers/storageOfUser";
import layoutStyle from "../../../styles/layoutStyle";
import CheckboxGroup from "../../atoms/CheckboxGroup";
import CheckBoxInput from "../../atoms/CheckBoxInput";
import PrimaryButton from "../../atoms/PrimaryButton";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface PropsToReceive {
  // 親から受け取るパラメータを定義
}

type MyProps = InputStateProps & PropsToReceive;
type Props = MyProps & InjectedFormProps<InputStateProps, MyProps>;

const SpotFilterModal: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const spotFilterModal = useAppSelector((state) => state.spotFilterModal);
  const storageOfUser = useAppSelector((state) => state.storageOfUser);

  const [indeterminate, setIndeterminate] = useState(false);
  const prevFormValues = usePrevious(props.formValues);

  useEffect(() => {
    updateSelectAll();
    if (spotFilterModal.isOpen) {
      dispatch(getHiddenSpotNoList({ apoCd: props.apoCd }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, spotFilterModal.isOpen]);

  useEffect(() => {
    const prevSpotNoList = prevFormValues && prevFormValues.spotNo ? prevFormValues.spotNo : [];
    const spotNoList = props.formValues && props.formValues.spotNo ? props.formValues.spotNo : [];
    if (prevSpotNoList.length !== spotNoList.length) {
      updateSelectAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.formValues]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelectAll = (e: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (e.target.checked) {
      props.change("spotNo", spotFilterModal.spotNoList);
    } else {
      props.change("spotNo", []);
    }
    setIndeterminate(false);
  };

  const updateSelectAll = () => {
    const { formValues } = props;
    const selectedSpotNoList = spotFilterModal.spotNoList.filter((spotNo) =>
      formValues && formValues.spotNo ? formValues.spotNo.includes(spotNo) : true
    );

    if (selectedSpotNoList.length > 0) {
      if (selectedSpotNoList.length === spotFilterModal.spotNoList.length) {
        props.change("selectAll", true);
        setIndeterminate(false);
      } else {
        props.change("selectAll", false);
        setIndeterminate(true);
      }
    } else {
      props.change("selectAll", false);
      setIndeterminate(false);
    }
  };

  const handleRequestClose = () => {
    const {
      formValues: { spotNo },
    } = props;
    const { spotNoList } = spotFilterModal;
    const { hiddenSpotNoList } = storageOfUser;
    const latestHiddenSpotNoList = spotNoList.filter((v) => !(spotNo && spotNo.includes(v)));

    if (hiddenSpotNoList.length === latestHiddenSpotNoList.length && hiddenSpotNoList.every((v) => latestHiddenSpotNoList.includes(v))) {
      dispatch(closeSpotFilterModal());
    } else {
      void dispatch(showConfirmation({ onClickYes: closeSpotFilterModal }));
    }
  };

  const handleEnter = () => {
    const {
      userId,
      apoCd,
      formValues: { spotNo },
    } = props;
    const { spotNoList } = spotFilterModal;
    if (userId && apoCd) {
      const hiddenSpotNo = spotNo ? spotNoList.filter((v) => !spotNo.includes(v)) : [];
      dispatch(saveHiddenSpotNo({ apoCd, hiddenSpotNo }));
    }
    dispatch(enterSpotFilterModal());
  };

  return (
    <Wrapper>
      <Modal isOpen={spotFilterModal.isOpen} style={customModalStyles} onRequestClose={handleRequestClose}>
        <Header>SPOT Filter</Header>
        <Body>
          <SelectAllLabel htmlFor="selectAll">
            <Field
              id="selectAll"
              name="selectAll"
              component={CheckBoxInput}
              type="checkbox"
              onChange={handleSelectAll}
              className={indeterminate ? "indeterminate" : ""}
            />
            Select all
          </SelectAllLabel>
          <SpotNoList>
            <Field
              name="spotNo"
              options={spotFilterModal.spotNoList.map((spotNo) => ({ label: spotNo || "XXX", value: spotNo }))}
              component={CheckboxGroup as "input" & typeof CheckboxGroup}
            />
          </SpotNoList>
          <EnterButton>
            <PrimaryButton text="Enter" type="button" width="90px" height="40px" onClick={handleEnter} />
          </EnterButton>
        </Body>
      </Modal>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const customModalStyles: Styles = {
  overlay: {
    background: "rgba(0, 0, 0, 0.5)",
    overflow: "auto",
    zIndex: 10,
  },
  content: {
    position: "absolute",
    width: "240px",
    padding: "0",
    top: `calc(52px + ${storage.isPc ? layoutStyle.header.default : layoutStyle.header.tablet})`,
    left: "105px",
    right: "unset",
    bottom: "unset",
    margin: "auto",
    border: "none",
    background: "#fff",
    overflow: "auto",
    outline: "none",
  },
};

const Header = styled.div`
  color: #ffffff;
  background-color: #2799c6;
  text-align: center;
  font-size: 12px;
  width: 100%;
  height: 24px;
  line-height: 2;
`;

const Body = styled.div`
  label {
    display: flex;
    align-items: center;
  }

  input[type="checkbox"] {
    margin-right: 6px;
  }
`;

const SpotNoList = styled.div`
  background-color: #f6f6f6;
  border: 1px solid #222222;
  margin: 0 23px 0 23px;
  padding: 24px 0 0 43px;
  min-height: 291px;
  max-height: calc(100vh - 52px - ${storage.isPc ? `${layoutStyle.header.default} - 250px` : `${layoutStyle.header.tablet} - 210px`});
  overflow-y: auto;

  label {
    margin-bottom: 23px;
  }
`;

const SelectAllLabel = styled.label`
  > input:focus {
    border: 1px solid #2e85c8;
    box-shadow: 0px 0px 7px #60b7fa;
  }

  margin: 24px 48px 21px 48px;
`;

const EnterButton = styled.div`
  padding: 32px 75px;
`;

const SpotFilterModalWithForm = reduxForm<InputStateProps, MyProps>({
  form: "spotFilterModal",
  enableReinitialize: true,
})(SpotFilterModal);

interface FormValues {
  spotNo: string[] | undefined;
}

interface InputStateProps {
  userId: string;
  apoCd: string;
  formValues: FormValues;
  // eslint-disable-next-line react/no-unused-prop-types
  initialValues: FormValues;
}

const mapStateToProps = (state: RootState): InputStateProps => {
  const { spotNoList } = state.spotFilterModal;
  const { hiddenSpotNoList } = state.storageOfUser;
  const selectedSpotNo = spotNoList.filter((spotNo) => !hiddenSpotNoList.includes(spotNo));

  return {
    userId: state.account.jobAuth.user.userId,
    apoCd: state.common.headerInfo.apoCd,
    formValues: getFormValues("spotFilterModal")(state) as FormValues,
    initialValues: {
      spotNo: selectedSpotNo,
    },
  };
};

const mergeProps = (stateProps: InputStateProps, onwProps: PropsToReceive) => ({
  ...stateProps,
  ...onwProps,
});

export default connect(mapStateToProps, null, mergeProps)(SpotFilterModalWithForm);
