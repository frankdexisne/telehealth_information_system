import api from "../utils/api";
import { isAxiosError, AxiosResponse, AxiosError } from "axios";

export const getRequest = (_url: string, _config: object = {}) => {
  return api.get(_url, _config);
};

export const postRequest = (
  _url: string,
  payload: object,
  _config: object = {}
) => {
  return api.post(_url, payload, _config);
};

export const putRequest = (
  _url: string,
  payload: object,
  _config: object = {}
) => {
  return api.put(_url, payload, _config);
};

export const deleteRequest = (_url: string, _config: object = {}) => {
  return api.delete(_url, _config);
};

export const errorProvider = <T>(
  error: AxiosError,
  provide: (_errors: T) => void
) => {
  if (isAxiosError(error)) {
    const axiosError = error as AxiosError;
    const response: AxiosResponse<any> | undefined = axiosError.response;
    if (response) {
      const {
        data: { errors },
        status,
      } = response;
      if (status === 422) {
        provide(
          Object.keys(errors).reduce((acc, key) => {
            acc[key as keyof T] = errors[key][0];
            return acc;
          }, {} as T)
        );
      }
    }
  }
};
