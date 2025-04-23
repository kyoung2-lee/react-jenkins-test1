import React from "react";
import { useAppSelector } from "../../../store/hooks";
import UpdateStatusLabel from "../../atoms/UpdateStatusLabel";

export const StatusLabel: React.FC<{ isDep: boolean; rowIndex: number }> = (props) => {
  const { rowStatusList } = useAppSelector((state) =>
    props.isDep ? state.multipleFlightMovementModals.modalDep : state.multipleFlightMovementModals.modalArr
  );
  return <UpdateStatusLabel status={rowStatusList[props.rowIndex].status} />;
};
