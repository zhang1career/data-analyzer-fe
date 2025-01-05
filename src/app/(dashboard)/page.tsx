import * as React from 'react';
import {auth} from '@/auth';
import MyComponent from "@/clientings/MyComponent.tsx";

export default async function HomePage() {
  const session = await auth();

  return (
    <>
      <MyComponent/>
    </>
  );
}