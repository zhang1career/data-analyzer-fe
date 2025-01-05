import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface MyRouting {
  protocol: string;
  host: string;
  router: AppRouterInstance;
  pathname?: string;
}