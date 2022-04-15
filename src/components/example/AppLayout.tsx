import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout, Menu } from 'antd';
import { PAGE_ENDPOINTS } from '@contants/constant';

const AppLayout: React.FC = ({ children, ...resetProps }) => {
  const router = useRouter();

  const components = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, resetProps);
    }

    return child;
  });

  return (
    <Layout>
      <Layout.Header style={{ padding: 0 }}>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={[router.asPath]}
        >
          <Menu.Item key={PAGE_ENDPOINTS.INDEX}>
            <Link href={PAGE_ENDPOINTS.INDEX}>
              <a className="logo">Logo</a>
            </Link>
          </Menu.Item>
          <Menu.Item key={PAGE_ENDPOINTS.EXAMPLE.ROOT}>
            <Link href={PAGE_ENDPOINTS.EXAMPLE.ROOT}>
              <a className="logo">Post</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content style={{ background: '#ffff' }}>
        {components}
      </Layout.Content>
    </Layout>
  );
};

export default AppLayout;
