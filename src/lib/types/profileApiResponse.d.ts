/* eslint-disable @typescript-eslint/no-unused-vars */
namespace ProfileApi {
  interface Response {
    commonHeader: CommonApi.CommonHeader;
    user: ProfileUser;
  }

  interface ProfileUser {
    familyName: string;
    firstName: string;
    companyCd: string;
    deptCd: string;
    profileImg: string;
  }
}
