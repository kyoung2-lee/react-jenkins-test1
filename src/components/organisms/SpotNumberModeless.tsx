import React from "react";
import { Styles } from "react-modal";
import { connect } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { getFormValues, InjectedFormProps, reduxForm } from "redux-form";
import styled from "styled-components";
import { storage } from "../../lib/storage";
import { NotificationCreator } from "../../lib/notifications";
import { SoalaMessage } from "../../lib/soalaMessages";
import { RootState, AppDispatch } from "../../store/storeType";
import { useAppDispatch } from "../../store/hooks";
import {
  SpotNoRow,
  Target,
  FormValues,
  closeSpotNumberChild,
  closeSpotNumberAll,
  targetSelected,
  updateSpotNumbers,
  setDirtyForm,
  removeDirtyForm,
  setFormValues,
  removeFormValue,
  checkSpotNumberRestriction,
} from "../../reducers/spotNumber";
import { openSpotNumberRestrictionPopup } from "../../reducers/spotNumberRestrictionPopup";
import PopupCommonHeader, { ArrDep } from "../atoms/PopupCommonHeader";
import PrimaryButton from "../atoms/PrimaryButton";
import SecondaryButton from "../atoms/SecondaryButton";
import DraggableModal from "../molecules/DraggableModal";
import SpotNumberForm from "../molecules/SpotNumberForm";
// eslint-disable-next-line import/no-cycle
import { FORM_NAME } from "./SpotNumberModal";

interface ComponentProps {
  formValues: FormValues;
  isModal: boolean;
  isOpen: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  fetching: boolean;
  spotNoRows: SpotNoRow[];
  dirtyForms: { [id in number]: { arr: boolean; dep: boolean } };
}
type Props = ComponentProps & InjectedFormProps<FormValues, ComponentProps>;

const SpotNumberModeless: React.FC<Props> = (props) => {
  const dispatch = useAppDispatch();
  const isForceDirty = Object.values(props.dirtyForms).some(({ arr, dep }) => arr || dep);

  const handleClose = (spotNoRow: SpotNoRow) => {
    void dispatch(closeSpotNumberChild({ givenId: spotNoRow.givenId }));
  };

  const handleClickClose = () => {
    if (isForceDirty) {
      NotificationCreator.create({ dispatch, message: SoalaMessage.M40001C({ onYesButton: () => dispatch(closeSpotNumberAll()) }) });
    } else {
      void dispatch(closeSpotNumberAll());
    }
  };

  const handleClickTarget = (spotNoRow: SpotNoRow, target: Target) => {
    if (spotNoRow) {
      const dirtyForm = props.dirtyForms[spotNoRow.givenId];
      const clickedRowHasDarty = dirtyForm != null && Object.values(dirtyForm).includes(true);
      if (clickedRowHasDarty) {
        const onYesButton = () => {
          if (props.initialValues.rows) {
            const formIndex = props.initialValues.rows.findIndex((r) => r.givenId === spotNoRow.givenId);
            if (formIndex >= 0) {
              props.change(`rows[${formIndex}].arr.spotNo`, props.initialValues.rows[formIndex].arr.spotNo);
              props.change(`rows[${formIndex}].dep.spotNo`, props.initialValues.rows[formIndex].dep.spotNo);
            }
          }
          dispatch(targetSelected({ givenId: spotNoRow.givenId, target }));
          dispatch(setDirtyForm({ givenId: spotNoRow.givenId, isArrDirty: false, isDepDirty: false }));
          dispatch(
            setFormValues({
              formValues: {
                ...props.formValues,
                rows: props.formValues.rows.map((row) => {
                  const initialRow = props.initialValues.rows?.find(({ givenId }) => givenId === spotNoRow.givenId) ?? row;
                  return row.givenId === spotNoRow.givenId ? initialRow : row;
                }),
              },
            })
          );
        };
        NotificationCreator.create({ dispatch, message: SoalaMessage.M40012C({ onYesButton }) });
      } else {
        dispatch(targetSelected({ givenId: spotNoRow.givenId, target }));
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

  const renderHeader = () => (
    <Header>
      <div>SPOT Change</div>
      <div>
        {props.spotNoRows.length}
        <span>Bars</span>
      </div>
    </Header>
  );

  return (
    <DraggableModal
      header={renderHeader()}
      isOpen={!props.isModal && props.isOpen}
      onFocus={() => {}}
      style={customStylesI}
      showCloseButton={false}
      posRight
    >
      <form onSubmit={props.handleSubmit}>
        <ContentWrapper isPc={storage.isPc}>
          <TransitionGroup>
            {props.spotNoRows.map((spotNoRow: SpotNoRow) => (
              <CSSTransition key={spotNoRow.seq} timeout={200} classNames="spot-no-row">
                <ContentRow>
                  <PopupCommonHeader
                    onClose={() => handleClose(spotNoRow)}
                    arr={getHeaderInfo({ spotNoRow, isDep: false })}
                    dep={getHeaderInfo({ spotNoRow, isDep: true })}
                  />
                  <SpotNumberForm
                    formValues={props.formValues}
                    spotNoRow={spotNoRow}
                    formIndex={getFormIndex(spotNoRow)}
                    onClickTarget={(target) => handleClickTarget(spotNoRow, target)}
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    change={props.change}
                    dirtyForms={props.dirtyForms}
                    setDirtyForm={(payload) => dispatch(setDirtyForm(payload))}
                    removeDirtyForm={(payload) => dispatch(removeDirtyForm(payload))}
                    setFormValues={(payload) => dispatch(setFormValues(payload))}
                    removeFormValue={(payload) => dispatch(removeFormValue(payload))}
                  />
                </ContentRow>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </ContentWrapper>
        <FooterContainer>
          <div>
            <SecondaryButton text="Close" type="button" onClick={handleClickClose} />
          </div>
          <div>
            <PrimaryButton type="submit" text="Update" width="100px" disabled={!isForceDirty} />
          </div>
        </FooterContainer>
      </form>
    </DraggableModal>
  );
};

const customStylesI: Styles = {
  overlay: {
    background: "transparent",
    pointerEvents: "none",
    zIndex: 960000000 /* reapop(999999999)の3つ下 */,
  },
  content: {
    width: "100%",
    height: "100%",
    left: 0,
    right: 0,
    bottom: 0,
    background: "transparent",
    border: "none",
    pointerEvents: "none",
    padding: 0,
  },
};

const Header = styled.div`
  width: 100%;
  height: 40px;
  background: #346181;
  margin-top: -2px;
  display: flex;
  color: ${(props) => props.theme.color.WHITE};
  font-size: 20px;
  > div:first-child {
    margin-top: 10px;
    margin-left: 73px;
  }
  > div:last-child {
    margin-top: 10px;
    margin-left: 55px;
    span {
      margin-left: 4px;
      font-size: 12px;
    }
  }
`;

const ContentWrapper = styled.div<{ isPc: boolean }>`
  height: calc(100vh - ${({ isPc }) => (isPc ? "130px" : "150px")});
  overflow-y: scroll;
  background-color: #7f7f7f;
  -webkit-overflow-scrolling: touch;
  ::-webkit-scrollbar {
    display: none;
  }
  .spot-no-row-enter {
    opacity: 0.01;
    transform: translate(-187px, 0);
  }
  .spot-no-row-enter-active {
    opacity: 1;
    transform: translate(0, 0);
    transition: all 200ms ease-in;
  }
  .spot-no-row-exit {
    opacity: 1;
    transform: translate(0, 0);
  }
  .spot-no-row-exit-active {
    opacity: 0.01;
    transform: translate(187px, 0);
    transition: all 200ms ease-in;
  }
`;

const ContentRow = styled.div`
  width: 100%;
  height: 276px;
  background: #f6f6f6;
  transition: all 0.3s linear;
  border: 1px solid ${(props) => props.theme.color.WHITE};
`;

const FooterContainer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
  height: 80px;
  justify-content: space-evenly;
  align-items: center;
  background: #ffffff;
  box-shadow: 2px 2px 4px #abb3bb;
  > div {
    width: 96px;
  }
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

const SpotNumberModelessForm = reduxForm<FormValues, ComponentProps>({
  form: FORM_NAME,
  onSubmit: handleSubmitForm,
  enableReinitialize: true,
})(SpotNumberModeless);

const mapStateToProps = (state: RootState) => ({
  initialValues: state.spotNumber.initialFormValues,
  formValues: getFormValues(FORM_NAME)(state) as FormValues,
  isModal: state.spotNumber.isModal,
  isOpen: state.spotNumber.isOpen,
  fetching: state.spotNumber.fetching,
  spotNoRows: state.spotNumber.spotNoRows,
  dirtyForms: state.spotNumber.dirtyForms,
});

export default connect(mapStateToProps)(SpotNumberModelessForm);
