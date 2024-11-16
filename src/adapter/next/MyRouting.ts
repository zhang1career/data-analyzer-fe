import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface MyRouting {
  router: AppRouterInstance;
  protocol: string;
  host: string;
  pathname?: string;
}