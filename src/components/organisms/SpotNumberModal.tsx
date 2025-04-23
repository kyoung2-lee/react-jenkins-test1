import React from "react";
import { connect } from "react-redux";
import { InjectedFormProps, reduxForm } from "redux-form";
import styled from "styled-components";
import { useAppDispatch } from "../../store/hooks";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import { RootState, AppDispatch } from "../../store/storeType";
// eslint-disable-next-line import/no-cycle
import {
  FormValues,
  Target,
  SpotNoRow,
  closeSpotNumberAll,
  targetSelected,
  updateSpotNumbers,
  setDirtyForm,
  removeDirtyForm,
  checkSpotNumberRestriction,
} from "../../reducers/spotNumber";
import { openSpotNumberRestrictionPopup } from "../../reducers/spotNumberRestrictionPopup";
import { ArrDep } from "../atoms/PopupCommonHeader";
import PrimaryButton from "../atoms/PrimaryButton";
import CommonPopupModal from "../molecules/CommonPopupModal";
import SpotNumberFormRow from "../molecules/SpotNumberForm";

interface ComponentProps {
  isModal: boolean;
  isOpen: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  fetching: boolean;
  spotNoRow: SpotNoRow | null;
  dirtyForms: { [id in number]: { arr: boolean; dep: boolean } };
}

type Props = ComponentProps & InjectedFormProps<FormValues, ComponentProps>;

const SpotNumberModal: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const isForceDirty = Object.values(props.dirtyForms).some(({ arr, dep }) => arr || dep);
  const handleRequestClose = () => {
    if (isForceDirty) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: () => dispatch(closeSpotNumberAll()) }) });
    } else {
      dispatch(closeSpotNumberAll());
    }
  };

  const handleClickTarget = (target: Target) => {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    if (props.spotNoRow) {
      if (isForceDirty) {
        const onYesButton = () => {
          props.reset();
          if (props.spotNoRow == null) return;
          dispatch(targetSelected({ givenId: props.spotNoRow.givenId, target }));
          dispatch(setDirtyForm({ givenId: props.spotNoRow.givenId, isArrDirty: false, isDepDirty: false }));
        };
        NotificationCreator.create({ dispatch, message: SoalaMessage.M40012C({ onYesButton }) });
      } else {
        dispatch(targetSelected({ givenId: props.spotNoRow.givenId, target }));
      }
    }
  };

  const getHeaderInfo = ({ spotNoRow, isDep }: { spotNoRow: SpotNoRow; isDep: boolean }): ArrDep | null => {
    const legInfo = isDep ? spotNoRow.dep.legInfo : spotNoRow.arr.legInfo;
    if (!legInfo) return null;
    return {
      orgDateLcl: legInfo.orgDateLcl,
      alCd: legInfo.alCd,
      fltNo: legInfo.fltNo,
      casFltNo: legInfo.casFltNo,
      csFlg: legInfo.csFlg,
    };
  };

  const getFormIndex = (spotNoRow: SpotNoRow): number | null => {
    if (props.initialValues.rows) {
      const index = props.initialValues.rows.findIndex((r) => r.givenId === spotNoRow.givenId);
      if (index >= 0) {
        return index;
      }
    }
    return null;
  };

  if (!props.spotNoRow) {
    return null;
  }

  return (
    <CommonPopupModal
      isOpen={props.isModal && props.isOpen}
      arr={getHeaderInfo({ spotNoRow: props.spotNoRow, isDep: false })}
      dep={getHeaderInfo({ spotNoRow: props.spotNoRow, isDep: true })}
      width={375}
      height={360}
      onRequestClose={handleRequestClose}
    >
      <SpotNumberForm onSubmit={props.handleSubmit}>
        <SpotNumberFormRow
          spotNoRow={props.spotNoRow}
          formIndex={getFormIndex(props.spotNoRow)}
          onClickTarget={handleClickTarget}
          // eslint-disable-next-line @typescript-eslint/unbound-method
          change={props.change}
          dirtyForms={props.dirtyForms}
          setDirtyForm={(payload) => dispatch(setDirtyForm(payload))}
          removeDirtyForm={(payload) => dispatch(removeDirtyForm(payload))}
        />
        <FooterContainer>
          <PrimaryButton type="submit" text="Update" width="100px" disabled={!isForceDirty} />
        </FooterContainer>
      </SpotNumberForm>
    </CommonPopupModal>
  );
};

const SpotNumberForm = styled.form`
  height: 320px;
  text-align: center;
  background: #f6f6f6;
  font-size: 18px;
`;

const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px -3px 3px #dfdfdf;
`;

const handleSubmitForm = (formValues: FormValues, dispatch: AppDispatch, _props: ComponentProps) => {
  NotificationCreator.create({
    dispatch,
    message: SoalaMessage.M30010C({
      onYesButton: () => {
        void (async () => {
          const response = await dispatch(checkSpotNumberRestriction(formValues)).unwrap();
          if (response && response.length > 0) {
            void dispatch(
              openSpotNumberRestrictionPopup({
                legInfo: response,
                onYesButton: () => {
                  void dispatch(updateSpotNumbers(formValues));
                },
                onNoButton: () => {},
              })
            );
          } else {
            void dispatch(updateSpotNumbers(formValues));
          }
        })();
      },
    }),
  });
};

export const FORM_NAME = "spotNumber";

const SpotNumberModalForm = reduxForm<FormValues, ComponentProps>({
  form: FORM_NAME,
  onSubmit: handleSubmitForm,
  enableReinitialize: true,
})(SpotNumberModal);

const mapStateToProps = (state: RootState) => ({
  initialValues: state.spotNumber.initialFormValues,
  isModal: state.spotNumber.isModal,
  isOpen: state.spotNumber.isOpen,
  fetching: state.spotNumber.fetching,
  spotNoRow: state.spotNumber.spotNoRows.length > 0 ? state.spotNumber.spotNoRows[0] : null,
  dirtyForms: state.spotNumber.dirtyForms,
});

export default connect(mapStateToProps)(SpotNumberModalForm);
