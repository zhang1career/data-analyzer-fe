import {NextRequest, NextResponse} from "next/server";
// import {auth as authMiddleware} from "@/auth.ts";
// import {loggingMiddleware} from "@/middlewares/LoggingMiddleware.ts";
// import {pageLocationMiddleware} from "@/middlewares/PageLocationMiddleware.ts";


/**
 * Compose multiple middlewares
 * @param middlewares
 * @reference https://stackoverflow.com/questions/76603369/how-to-use-multiple-middlewares-in-next-js-using-the-middleware-ts-file
 */
const composeMiddlewares = (middlewares: {
  [key: string]: ((req: NextRequest) => NextResponse | Promise<NextResponse>)
}) => {
  return (req: NextRequest) => {
    const parsedMiddlewares = Object.entries(middlewares);
    const initialResponse = Promise.resolve(NextResponse.next());

    return parsedMiddlewares.reduce((prevPromise, [middlewareName, middleware]) => {
      return prevPromise.then((res) => {
        if (res?.status >= 300 && res?.status < 400) {
          console.log(`[mw][skip][redirect] - ${middlewareName}`);
          return res;
        }
        console.info(`[mw] - ${middlewareName}`);
        return middleware(req);
      });
    }, initialResponse);
  }
};

// export default composeMiddlewares({
//   loggingMiddleware: loggingMiddleware,
//   // authMiddleware: authMiddleware,
//   pageLocationMiddleware: pageLocationMiddleware,
// });

export { auth as middleware } from '@/auth';

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    '/terms/:path*',
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
};
