import React from "react";
import { Layout, Menu } from "antd";
import {
  UserOutlined,
  BookOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;

const Sidebar = () => {
  const handleMenuClick = ({ key }) => {
    // 👇 chuyển trang trực tiếp ở đây
    switch (key) {
      case "users":
        window.location.href = "/users";
        break;
      case "user-groups":
        window.location.href = "/user-groups";
        break;
      case "course-management":
        window.location.href = "/courses";
        break;
      case "system":
        window.location.href = "/system";
        break;
      default:
        window.location.href = "/";
    }
  };

  // 👇 lấy key active theo URL hiện tại
  const currentPath = window.location.pathname;
  let selectedKey = "users"; // mặc định

  if (currentPath.startsWith("/users")) selectedKey = "users";
  else if (currentPath.startsWith("/user-groups")) selectedKey = "user-groups";
  else if (currentPath.startsWith("/courses")) selectedKey = "course-management";
  else if (currentPath.startsWith("/system")) selectedKey = "system";

  return (
    <Sider
      width={220}
      style={{
        minHeight: "100vh",
        background: "#001529",
      }}
    >
      <div
        style={{
          height: 80,
          margin: 16,
          background: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/images/cms.png"
          alt="CMS"
          style={{
            height: "100%", // chiếm hết chiều cao của div
            width: "100%", // chiều rộng tự động
            objectFit: "contain", // giữ tỉ lệ ảnh
          }}
        />
      </div>

      <Menu
        theme="dark"
        mode="inline"
        defaultOpenKeys={["user-management"]}
        selectedKeys={[selectedKey]} // 👈 active menu theo URL
        onClick={handleMenuClick}
        items={[
          {
            key: "user-management",
            icon: <UserOutlined />,
            label: "Quản lý người dùng",
            children: [
              {
                key: "users",
                label: "Người dùng",
              },
              {
                key: "user-groups",
                label: "Nhóm tài khoản",
              },
            ],
          },
          {
            key: "course-management",
            icon: <BookOutlined />,
            label: "Quản lý môn học",
          },
          {
            key: "system",
            icon: <SettingOutlined />,
            label: "Hệ thống",
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
