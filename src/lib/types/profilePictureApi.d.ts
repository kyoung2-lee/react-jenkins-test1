/* eslint-disable @typescript-eslint/no-unused-vars */
namespace ProfilePictureApi {
  interface Request {
    profile: string;
    profileTmb: string;
  }

  interface Response {
    commonHeader: CommonApi.CommonHeader;
    profile: string;
  }
}
