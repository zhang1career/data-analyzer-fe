'use client';

import {MyRouting} from "@/adapter/next/MyRouting.ts";
import {deepCopyFrom} from "@/utils/MapUtil.ts";
import {checkEmpty as ObjUtil_checkEmpty, getValueSafely} from "@/utils/ObjUtil.ts";
import {HTTP_STATUS} from "@/consts/HttpStatusConst.ts";
import {EMPTY_MAP} from "@/consts/MapConst.ts";
import {EMPTY_OBJ} from "@/consts/ObjConst.ts";
import {PATH_PARAM_CALLBACK, PATH_SIGNIN} from "@/consts/UrlConst.ts";
import {sprintf} from "sprintf-js";

const API_HUB_URL = 'api/hub';

interface ApiHubRequestable {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  pathVariable?: Readonly<{ [p: string]: string | number }>;
  queryParam?: Readonly<{ [p: string]: string | number }>;
  body?: Readonly<{ [p: string]: any }>;
  context: MyRouting;
}

async function requestApiHub({method, url, pathVariable, queryParam, body, context}: ApiHubRequestable): Promise<any> {
  // prepare data
  let destBodyMap = EMPTY_MAP;
  // destination body
  if (!ObjUtil_checkEmpty(body)) {
    destBodyMap = deepCopyFrom(body);
  }
  // destination method
  destBodyMap.set('_dest_method_', String(method));
  // destination URL
  let destUrl = url;
  if (!ObjUtil_checkEmpty(pathVariable)) {
    for (const [key, value] of Object.entries(pathVariable)) {
      destUrl = destUrl.replace(`:${key}`, String(value));
    }
  }
  destBodyMap.set('_dest_url_', destUrl);
  if (!ObjUtil_checkEmpty(queryParam)) {
    const destParamObj = EMPTY_OBJ;
    for (const [key, value] of Object.entries(queryParam)) {
      destParamObj[key] = String(value);
    }
    const urlSearchParams = new URLSearchParams(destParamObj);
    destBodyMap.set('_dest_url_', `${destUrl}?${urlSearchParams.toString()}`);
  }

  const destBody = Object.fromEntries(destBodyMap);
  console.log('[apihub] request:', destBody);
  const response = await fetch(API_HUB_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(destBody)
  });

  if (!response.ok) {
    return handleError(context, response);
  }
  return response.json();
}

function handleError(context: MyRouting, response: Response): Promise<any> {
  if (response.status === HTTP_STATUS.UNAUTHORIZED) {
    console.log('re-signin');
    const _callbackUrl = context.protocol + '//' + context.host + getValueSafely(context, 'pathname', '/');
    const redirectUrl = context.protocol + '//' + context.host + PATH_SIGNIN + '?' + sprintf(PATH_PARAM_CALLBACK, encodeURIComponent(_callbackUrl));
    context.router.push(redirectUrl);
    return Promise.reject('Unauthorized');
  }
  throw new Error(`status=${response.status}, message=${response.statusText}`);
}


export default requestApiHub;