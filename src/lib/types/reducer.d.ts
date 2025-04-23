/* eslint-disable @typescript-eslint/no-unused-vars */
namespace Reducer {
  interface AsyncResult {
    isError: boolean;
    retry: (() => void) | null;
  }
}
