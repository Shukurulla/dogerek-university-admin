import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  CalendarOutlined,
  FileTextOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { logo } from "../../public";

const { Sider } = Layout;

const menuItems = [
  {
    key: "/",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "/faculty-admins",
    icon: <UserOutlined />,
    label: "Fakultet adminlar",
  },
  {
    key: "/categories",
    icon: <AppstoreOutlined />,
    label: "Kategoriyalar",
  },
  {
    key: "/clubs",
    icon: <BookOutlined />,
    label: "To'garaklar",
  },
  {
    key: "/students",
    icon: <TeamOutlined />,
    label: "Studentlar",
  },
  {
    key: "/attendance",
    icon: <CalendarOutlined />,
    label: "Davomatlar",
  },
  {
    key: "/reports",
    icon: <FileTextOutlined />,
    label: "Hisobotlar",
  },
  {
    key: "/profile",
    icon: <SettingOutlined />,
    label: "Sozlamalar",
  },
];

export default function Sidebar({ collapsed }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Sider
      width={256}
      collapsed={collapsed}
      className="!fixed left-0 top-0 bottom-0 z-10 shadow-xl"
      theme="dark"
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-800">
        <h1
          className={`text-white font-bold transition-all duration-300 ${
            collapsed ? "text-xl" : "text-2xl"
          }`}
        >
          {collapsed ? (
            "D"
          ) : (
            <div className="flex items-center justify-start gap-2">
              <img src={logo} className="w-[50px] " alt="" />
              <p>Dogerek</p>
            </div>
          )}
        </h1>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="mt-4"
      />
    </Sider>
  );
}
