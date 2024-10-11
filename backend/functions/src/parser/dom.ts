import axios, { AxiosRequestConfig } from "axios";
import { parse } from "parse5";
import { CustomDom } from "../types/parser";

export const getParsedDom = async (url: string): Promise<CustomDom> => {
  const config: AxiosRequestConfig = {
    method: "GET",
    url,
    params: {
      calend: "COMPLET",
    },
  };
  const res = await axios(config);

  const resData = res.data as string;
  const dom = parse(resData) as CustomDom;

  return dom;
};
