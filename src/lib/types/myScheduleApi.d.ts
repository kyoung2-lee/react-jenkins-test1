/**
 *  MySchedule画面-共通Response定義
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MyScheduleApi {
  export interface StaffAssignInformation {
    employeeNumber: string;
    familyName: string;
    firstName: string;
    iataAirport: string;
    workDate: string;
    workStartTime: string;
    workEndTime: string;
    changeNoticeStatus: boolean;
    changeNotice: string;
    taskInformation: TaskInformation[];
  }

  export interface TaskInformation {
    taskId: number | null;
    taskName: string;
    taskStartStatus: boolean;
    taskEndStatus: boolean;
    taskClassColor: string;
    taskBackColor: string;
    taskFontColor: string;
    taskStartTime: string;
    taskEndTime: string;
    originDateLocal: string;
    carrierCodeIata: string;
    fltNumber: string;
    casualFltNumber: string;
    skdDepAirportCode: string;
    skdArrAirportCode: string;
    skdLegSerial: number;
    depArrType: "D" | "A" | "";
    sameWorkerInformation: SameWorkerInformation[];
  }

  export interface SameWorkerInformation {
    employeeNumber: string;
    familyName: string;
    firstName: string;
    profileImg: string;
  }

  /**
   * MySchedule画面-取得API
   */
  export namespace Get {
    export interface Request {
      apoCd: string;
    }

    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      staffAssignInformation: StaffAssignInformation;
    }
  }

  /**
   * MySchedule画面-更新API
   */
  export namespace Post {
    export interface Request {
      apoCd: string;
      workDate: string;
      taskId: number | undefined;
      taskStartStatus: boolean;
      taskEndStatus: boolean;
    }
    export interface Response {
      commonHeader: CommonApi.CommonHeader;
      staffAssignInformation: StaffAssignInformation;
    }
  }
}
