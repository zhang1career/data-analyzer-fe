import * as React from 'react';
import {DashboardLayout} from '@toolpad/core/DashboardLayout';
import {PageContainer} from '@toolpad/core/PageContainer';

export default async function DashboardPagesLayout(props: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <PageContainer
        maxWidth={false}
        sx={{
          m: 0
        }}>
        {props.children}
      </PageContainer>
    </DashboardLayout>
  );
}
