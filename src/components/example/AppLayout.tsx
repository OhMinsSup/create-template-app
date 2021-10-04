import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Layout, Menu } from 'antd';

const AppLayout: React.FC = ({ children }) => {
  const router = useRouter();

  return (
    <Layout>
      <Layout.Header style={{ padding: 0 }}>
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={[router.asPath]}
        >
          <Menu.Item key="/">
            <Link href="/">
              <a className="logo">Logo</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="/post/">
            <Link href="/post">
              <a className="logo">Post</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Layout.Header>
      <Layout.Content className="app">{children}</Layout.Content>
    </Layout>
  );
};

export default AppLayout;
