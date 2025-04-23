import React from "react";
import Draggable from "react-draggable";
import Modal from "react-modal";
import styled from "styled-components";

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ShipTransitListModal, closeShipTransitListModal, focusShipTransitListModal } from "../../reducers/shipTransitListModals";

const ShipTransitListModals: React.FC = () => {
  const dispatch = useAppDispatch();
  const shipTransitListModals = useAppSelector((state) => state.shipTransitListModals);

  const closeModal = (shipTransitListModal: ShipTransitListModal, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(closeShipTransitListModal(shipTransitListModal));
  };

  const handleActiveModal = (shipTransitListModal: ShipTransitListModal) => {
    dispatch(focusShipTransitListModal(shipTransitListModal));
  };

  return (
    <Wrapper>
      {shipTransitListModals.modals.map((shipTransitListModal) => (
        <Modal
          isOpen
          style={customStyles(shipTransitListModal.focusedAt.getTime() % 1000000000)} // zIndexの最大値を超えないよう下9桁を取得する
          shouldCloseOnOverlayClick={false}
          shouldCloseOnEsc={false}
          key={`${shipTransitListModal.alCd}${shipTransitListModal.fltNo}`}
        >
          <div>
            <Draggable>
              <ShipTransitList onClick={() => handleActiveModal(shipTransitListModal)}>
                <Header>
                  <div>
                    SHIP乗継情報リスト {shipTransitListModal.alCd}
                    {shipTransitListModal.fltNo}
                  </div>
                  {/* eslint-disable-next-line react/button-has-type */}
                  <button onClick={(e) => closeModal(shipTransitListModal, e)}>x</button>
                </Header>
                <div>
                  <TransitListTable>
                    <thead>
                      <tr>
                        <th>Flight</th>
                        <th>Departure</th>
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        <th />
                        <th>Arrival</th>
                        {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div>JL277</div>
                          <div>B/I</div>
                        </td>
                        <td>HND</td>
                        <td>
                          <div>0740</div>
                          <div>0753</div>
                        </td>
                        <td>IZO</td>
                        <td>
                          <div>0905</div>
                          <div>0900</div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <div>JL277</div>
                          <div>B/I</div>
                        </td>
                        <td>HND</td>
                        <td>
                          <div>0740</div>
                          <div>0753</div>
                        </td>
                        <td>IZO</td>
                        <td>
                          <div>0905</div>
                          <div>0900</div>
                        </td>
                      </tr>
                    </tbody>
                  </TransitListTable>
                </div>
              </ShipTransitList>
            </Draggable>
          </div>
        </Modal>
      ))}
    </Wrapper>
  );
};

Modal.setAppElement("#content");

const customStyles = (timestamp9digit: number): Modal.Styles => ({
  overlay: {
    background: "transparent",
    pointerEvents: "none",
    zIndex: timestamp9digit,
  },
  content: {
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "transparent",
    border: "none",
    pointerEvents: "none",
  },
});

const Wrapper = styled.div``;

const ShipTransitList = styled.div`
  width: 500px;
  height: 500px;
  pointer-events: all;
  background: #fff;
  border: 1px solid;
`;
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  background: #ccc;
`;
const TransitListTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    font-size: 12px;
  }
  tbody {
    vertical-align: top;
    tr {
      background: #eee;
      border: 1px solid #ccc;
      td {
        padding-right: 20px;
      }
    }
  }
`;

export default ShipTransitListModals;
