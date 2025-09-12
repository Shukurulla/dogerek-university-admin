import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Avatar,
  Typography,
  Row,
  Col,
  message,
  Divider,
  Space,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  SaveOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { changePassword } from "../store/api/authApi";

const { Title, Text } = Typography;

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [passwordForm] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [changingPassword, setChangingPassword] = useState(false);

  const handlePasswordChange = async (values) => {
    try {
      setChangingPassword(true);
      const result = await dispatch(changePassword(values)).unwrap();
      if (result.success) {
        message.success("Parol muvaffaqiyatli o'zgartirildi");
        passwordForm.resetFields();
      }
    } catch (error) {
      message.error("Parol o'zgartirishda xatolik");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleProfileUpdate = async (values) => {
    try {
      // Profile update API call
      message.success("Profil ma'lumotlari yangilandi");
    } catch (error) {
      message.error("Xatolik yuz berdi");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-0 shadow-md">
        <div className="text-center mb-8">
          <Avatar
            size={120}
            icon={<UserOutlined />}
            className="bg-gradient-to-r from-blue-500 to-purple-500 mb-4"
          />
          <Title level={3} className="!mb-1">
            {user?.profile?.fullName || user?.username}
          </Title>
          <Text className="text-gray-500">Universitet administratori</Text>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} lg={12}>
            <div className="space-y-6">
              <div>
                <Text className="text-gray-500 text-sm">Username</Text>
                <div className="text-lg font-medium">{user?.username}</div>
              </div>

              <div>
                <Text className="text-gray-500 text-sm">F.I.O</Text>
                <div className="text-lg font-medium">
                  {user?.profile?.fullName || "Kiritilmagan"}
                </div>
              </div>

              <div>
                <Text className="text-gray-500 text-sm">Telefon raqam</Text>
                <div className="text-lg font-medium">
                  {user?.profile?.phone
                    ? user.profile.phone
                        .replace("+998", "+998 ")
                        .replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2-$3-$4")
                    : "Kiritilmagan"}
                </div>
              </div>

              <div>
                <Text className="text-gray-500 text-sm">Email</Text>
                <div className="text-lg font-medium">
                  {user?.profile?.email || "Kiritilmagan"}
                </div>
              </div>

              <div>
                <Text className="text-gray-500 text-sm">Rol</Text>
                <div className="text-lg font-medium">
                  Universitet administratori
                </div>
              </div>
            </div>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <span className="flex items-center gap-2">
                  <KeyOutlined className="text-blue-500" />
                  Parolni o'zgartirish
                </span>
              }
              className="shadow-sm"
            >
              <Form
                form={passwordForm}
                layout="vertical"
                onFinish={handlePasswordChange}
              >
                <Form.Item
                  name="oldPassword"
                  label="Joriy parol"
                  rules={[
                    {
                      required: true,
                      message: "Joriy parol kiritilishi shart!",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Joriy parolni kiriting"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="newPassword"
                  label="Yangi parol"
                  rules={[
                    {
                      required: true,
                      message: "Yangi parol kiritilishi shart!",
                    },
                    {
                      min: 6,
                      message:
                        "Parol kamida 6 ta belgidan iborat bo'lishi kerak",
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Yangi parolni kiriting"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  label="Yangi parolni tasdiqlash"
                  dependencies={["newPassword"]}
                  rules={[
                    { required: true, message: "Parolni tasdiqlang!" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Parollar mos kelmadi!")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Yangi parolni qayta kiriting"
                    size="large"
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={changingPassword}
                    icon={<SaveOutlined />}
                    block
                    size="large"
                    className="gradient-primary border-0"
                  >
                    Parolni yangilash
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Card>

      <Card className="border-0 shadow-md">
        <Title level={4} className="mb-6">
          <UserOutlined className="mr-2" />
          Profil ma'lumotlarini tahrirlash
        </Title>

        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
          initialValues={{
            fullName: user?.profile?.fullName,
            phone: user?.profile?.phone?.replace("+998", ""),
            email: user?.profile?.email,
          }}
        >
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="fullName"
                label="F.I.O"
                rules={[
                  { required: true, message: "F.I.O kiritilishi shart!" },
                ]}
              >
                <Input placeholder="To'liq ism familiya" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ type: "email", message: "Email formati noto'g'ri" }]}
              >
                <Input placeholder="email@example.com" size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item
                name="phone"
                label="Telefon raqam"
                rules={[
                  {
                    pattern: /^\d{9}$/,
                    message:
                      "Telefon raqam 9 ta raqamdan iborat bo'lishi kerak",
                  },
                ]}
              >
                <Input
                  addonBefore="+998"
                  placeholder="90 123 45 67"
                  maxLength={9}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              size="large"
              className="gradient-primary border-0"
            >
              Ma'lumotlarni saqlash
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-purple-50">
        <Title level={4} className="mb-4">
          Tizim haqida
        </Title>

        <Row gutter={[32, 16]}>
          <Col xs={24} sm={8}>
            <Text className="text-gray-500">Versiya</Text>
            <div className="font-medium">1.0.0</div>
          </Col>

          <Col xs={24} sm={8}>
            <Text className="text-gray-500">Oxirgi yangilanish</Text>
            <div className="font-medium">12.12.2024</div>
          </Col>

          <Col xs={24} sm={8}>
            <Text className="text-gray-500">Ishlab chiquvchi</Text>
            <div className="font-medium">Dogerek Team</div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
