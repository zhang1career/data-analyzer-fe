import {NextResponse} from "next/server";
import axios, {AxiosError} from "axios";
import {getCookie} from "@/app/server_utils/CookieUtil.ts";
import {ACCESS_TOKEN} from "@/app/server_consts/AccessConst.ts";
import {HTTP_STATUS} from "@/consts/HttpStatusConst.ts";

interface ApiHubResponse {
  data: any,
  code: number,
  msg: string,
}

type BodyType = { [key: string]: any };

export async function POST(request: Request, response: Response) {
  const body = await request.json() as BodyType;
  const method = body._dest_method_;
  const url = process.env.API_BASE_URL + body._dest_url_;

  // check token if missing or expired
  const token = getCookie(ACCESS_TOKEN);
  if (!token) {
    console.warn('[apihub][server][skip] token not found');
    return NextResponse.json(
      null,
      {
        status: HTTP_STATUS.UNAUTHORIZED
      });
  }

  try {
    let response: ApiHubResponse | null = null;
    if (method === 'GET') {
      response = await _doGet(url, token);
    } else if (method === 'POST') {
      response = await _doPost(url, body, token);
    } else if (method === 'PUT') {
      response = await _doPut(url, body, token);
    } else if (method === 'PATCH') {
      response = await _doPatch(url, body, token);
    } else if (method === 'DELETE') {
      response = await _doDelete(url, token);
    }
    // check result
    if (!response) {
      throw new Error(`method ${method} not supported`);
    }
    if (response.code !== 0) {
      console.error('[apihub][server] failed:', response.code, response.msg);
      return NextResponse.json(response.data, {status: HTTP_STATUS.OK});
    }

    // return input
    return NextResponse.json(response.data, {status: HTTP_STATUS.OK});
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message;
      console.error('[apihub][server][skip] failed querying:', url, 'status:', status, 'message:', message);
      return NextResponse.json(
        {},
        {
          status: status,
          statusText: message
        });
    } else {
      // Handle other types of errors
      console.error("An unknown error occurred:", error);
      return NextResponse.json(
        {},
        {
          status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          statusText: 'An unknown error occurred:' + error
        });
    }
  }
}

async function _doGet(url: string, token: String): Promise<ApiHubResponse> {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.debug('[apihub][server] GET:', url, 'resp:', response.data);
  return response.data as ApiHubResponse;
}

async function _doPost(url: string, body: BodyType, token: String): Promise<ApiHubResponse> {
  const response = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.debug('[apihub][server] POST:', url, 'body:', body, 'resp:', response.data);
  return response.data as ApiHubResponse;
}

async function _doPut(url: string, body: BodyType, token: String): Promise<ApiHubResponse> {
  const response = await axios.put(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.debug('[apihub][server] PUT:', url, 'body:', body, 'resp:', response.data);
  return response.data as ApiHubResponse;
}

async function _doPatch(url: string, body: BodyType, token: String): Promise<ApiHubResponse> {
  const response = await axios.patch(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.debug('[apihub][server] PATCH:', url, 'body:', body, 'resp:', response.data);
  return response.data as ApiHubResponse;
}

async function _doDelete(url: string, token: String): Promise<ApiHubResponse> {
  const response = await axios.delete(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  console.debug('[apihub][server] DELETE:', url, 'resp:', response.data);
  return response.data as ApiHubResponse;
}