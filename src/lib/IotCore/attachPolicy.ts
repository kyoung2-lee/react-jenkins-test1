import axios, { AxiosResponse } from "axios";
import { ServerConfig } from "../../../config/config";

type LambdaAttatchPolicyResponse = {
  statusCode: number;
  body: string;
};

export const attachPolicyToIdentityId = async (idToken?: string) => {
  if (!idToken) {
    return false;
  }
  const response: AxiosResponse<LambdaAttatchPolicyResponse> = await axios.post<LambdaAttatchPolicyResponse>(
    ServerConfig.API_ENDPOINT_POLICY_ATTACH,
    {},
    {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    }
  );
  console.log({ response });
  if (response.status !== 200) {
    console.error({ response });
    return false;
  }
  return true;
};
