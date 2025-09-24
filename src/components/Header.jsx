import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Button, Dropdown, Avatar, Space, Badge, message } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { logout } from "../store/api/authApi";
import { useSyncHemisDataMutation } from "../store/api/adminApi";

const { Header: AntHeader } = Layout;

export default function Header({ collapsed, setCollapsed }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [syncHemis, { isLoading: syncing }] = useSyncHemisDataMutation();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
    message.success("Tizimdan chiqdingiz");
  };

  const handleSync = async () => {
    try {
      const result = await syncHemis().unwrap();
      if (result.success) {
        message.success(
          result.data?.message ||
            result.message ||
            "Hemis ma'lumotlari sinxronlandi"
        );
      } else {
        message.error("Sinxronlashda xatolik yuz berdi");
      }
    } catch (error) {
      console.error("Sync error:", error);
      message.error(
        error?.data?.message ||
          error?.message ||
          "Sinxronlashda xatolik yuz berdi"
      );
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profil",
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Chiqish",
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader className="bg-white px-6 flex items-center justify-between shadow-sm sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          className="text-lg"
        />
      </div>

      <Space size="large">
        <Badge count={0} size="small">
          <Button
            type="text"
            shape="circle"
            icon={<BellOutlined className="text-lg" />}
          />
        </Badge>

        <Dropdown
          menu={{ items: userMenuItems }}
          placement="bottomRight"
          arrow
          trigger={["click"]}
        >
          <Space className="cursor-pointer hover:bg-gray-50  flex transition-colors">
            <Avatar icon={<UserOutlined />} className="bg-primary" />
            <div className="text-left">
              <div className="font-medium mt-[-20px]">
                {user?.profile?.fullName || user?.username}
              </div>
              <div className="text-xs mt-[-20px] text-gray-500">
                {user?.role === "university_admin"
                  ? "Universitet Admin"
                  : "Administrator"}
              </div>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  );
}
