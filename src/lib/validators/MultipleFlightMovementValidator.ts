import { SoalaMessage } from "../soalaMessages";
// eslint-disable-next-line import/no-cycle
import { MyProps } from "../../components/organisms/MultipleFlightMovement/MultipleFlightMovementModal";
import { FormValues } from "../../reducers/multipleFlightMovementModals";
import { severErrorItems } from "../../components/organisms/FlightMovementModal/FlightMovementType";

/**
 * MultipleFlightMovementModal
 */

type nameType = keyof typeof severErrorItems;

/** ETA(L/D)公開コードが設定されている場合、ETA(L/D)は必須入力 */
export const requiredEtaLd = (value: string, allValues: FormValues, _props: MyProps, name: nameType) => {
  const match = name.match(/rows\[(\d+)\]/);
  const rowIndex = match ? parseInt(match[1], 10) : null;
  if (!allValues.rows || !allValues.rows.length || rowIndex === null) return undefined;
  const row = allValues.rows[rowIndex];
  if (!value && row.arrInfo.etaLdCd) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};

/** ETD公開コードが設定されている場合、ETDは必須入力 */
export const requiredEtd = (value: string, allValues: FormValues, _props: MyProps, name: nameType) => {
  const match = name.match(/rows\[(\d+)\]/);
  const rowIndex = match ? parseInt(match[1], 10) : null;
  if (!allValues.rows || !allValues.rows.length || rowIndex === null) return undefined;
  const row = allValues.rows[rowIndex];
  if (!value && (row.depInfo.etdCd || !row.depInfo.std)) {
    return SoalaMessage.M50016C;
  }
  return undefined;
};
