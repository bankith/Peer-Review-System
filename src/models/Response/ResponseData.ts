export default interface ResponseData<T> {
    data?: T;
    errorCode?: string;
    isError: boolean;
    isSuccess: boolean;
    errorMessage?: string;
  }
  