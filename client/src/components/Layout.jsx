import React, { useState } from "react";
import { Layout, Menu, Typography } from "antd";
import {
    FileOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function MainLayout({ children }) {
    const [collapsed, setCollapsed] = useState(false);

    const items = [
        {
            key: "docs",
            label: "Documents",
            icon: <FileOutlined />,
        },
    ];

    return (
        <Layout>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ height: "100vh" }}
            >
                <Title
                    level={2}
                    style={{
                        margin: "16px",
                        color: "#fff",
                        textAlign: "center",
                    }}
                >
                    {collapsed ? "CD" : "CloudDocs"}
                </Title>
                <Menu theme="dark" mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ background: "#fff", padding: 0 }}>
                    {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                            onClick() {
                                setCollapsed(!collapsed);
                            },
                            style: { padding: "0 24px" },
                        }
                    )}
                </Header>
                <Content
                    style={{
                        margin: "24px 16px",
                        background: "#fff",
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
