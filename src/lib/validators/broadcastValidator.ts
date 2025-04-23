import { SoalaMessage } from "../soalaMessages";
import { getPriorities } from "../commonUtil";
import { Props } from "../../components/organisms/Broadcast/Broadcast";
import * as validates from ".";

export const isPriority = (value: string, _allValues: unknown, props: Props) => {
  if (!validates.hasValue(value)) {
    return SoalaMessage.M50014C;
  }
  if (!getPriorities(props.cdCtrlDtls).some((priority) => priority.value === value)) {
    return SoalaMessage.M50014C;
  }
  return undefined;
};
