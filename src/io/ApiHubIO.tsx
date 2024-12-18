'use client';

import {MyRouting} from "@/hocs/next/MyRouting.ts";
import {
  checkEmpty as ObjUtil_checkEmpty,
  deepCopy as ObjUtil_deepCopy,
  getValueSafely,
  newDict,
  newObj
} from "@/utils/ObjUtil.ts";
import {HTTP_STATUS} from "@/consts/HttpStatusConst.ts";
import {PATH_PARAM_CALLBACK, PATH_SIGNIN} from "@/consts/UrlConst.ts";
import {sprintf} from "sprintf-js";

const API_HUB_URL = 'api/hub';

interface ApiHubRequestable {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  pathVariable?: Readonly<{ [p: string]: string | number }>;
  queryParam?: Readonly<{ [p: string]: string | number }>;
  body?: Readonly<{ [p: string]: any }>;
  context?: MyRouting | null;
}

async function requestApiHub({
                               method,
                               url,
                               pathVariable,
                               queryParam,
                               body,
                               context = null
                             }: ApiHubRequestable): Promise<any> {
  // prepare input
  let destBodyObj = newObj<{ [p: string]: any }>();
  // destination body
  if (!ObjUtil_checkEmpty(body)) {
    destBodyObj = ObjUtil_deepCopy(body);
  }
  // destination method
  destBodyObj['_dest_method_'] = String(method);
  // destination URL
  let destUrl = url;
  if (!ObjUtil_checkEmpty(pathVariable)) {
    for (const [key, value] of Object.entries(pathVariable)) {
      destUrl = destUrl.replace(`:${key}`, String(value));
    }
  }
  destBodyObj['_dest_url_'] = destUrl;
  if (!ObjUtil_checkEmpty(queryParam)) {
    const destParamObj = newDict();
    for (const [key, value] of Object.entries(queryParam)) {
      destParamObj[key] = String(value);
    }
    const urlSearchParams = new URLSearchParams(destParamObj);
    destBodyObj['_dest_url_'] = `${destUrl}?${urlSearchParams.toString()}`;
  }

  const response = await fetch(API_HUB_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(destBodyObj)
  });

  if (!response.ok) {
    console.error('[apihub][client][skip] failure:', response.statusText);
    return handleError(context, destBodyObj, response);
  }

  return response.json();
}

function handleError(context: MyRouting | null, requestBody: any, response: Response): Promise<any> {
  if (!context) {
    throw new Error(`Nothing to do with error, status=${response.status}, message=${response.statusText}`);
  }

  if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    console.log('re-signin');
    const _callbackUrl = context.protocol + '//' + context.host + getValueSafely(context, 'pathname', '/');
    const redirectUrl = context.protocol + '//' + context.host + PATH_SIGNIN + '?' + sprintf(PATH_PARAM_CALLBACK, encodeURIComponent(_callbackUrl));
    context.router.push(redirectUrl);
    return Promise.reject('Unauthorized');
  }
  throw new Error(`status=${response.status}, message=${response.statusText}, url=${context.pathname}, requestBody=${JSON.stringify(requestBody)}`);
}


export default requestApiHub;