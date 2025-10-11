import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Tag,
  Popconfirm,
  Card,
  Switch,
  Tooltip,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
  UserOutlined,
  LockOutlined,
  IdcardOutlined,
  BankOutlined,
  KeyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import {
  useGetFacultyAdminsQuery,
  useGetFacultiesQuery,
  useCreateFacultyAdminMutation,
  useUpdateFacultyAdminMutation,
  useDeleteFacultyAdminMutation,
} from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function FacultyAdmins() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [form] = Form.useForm();

  // API queries
  const { data: adminsData, isLoading: adminsLoading } =
    useGetFacultyAdminsQuery();
  const { data: facultiesData, isLoading: facultiesLoading } =
    useGetFacultiesQuery();
  const [createAdmin, { isLoading: creating }] =
    useCreateFacultyAdminMutation();
  const [updateAdmin, { isLoading: updating }] =
    useUpdateFacultyAdminMutation();
  const [deleteAdmin] = useDeleteFacultyAdminMutation();

  const admins = adminsData?.data || [];
  const faculties = facultiesData?.data || [];

  const handleSubmit = async (values) => {
    try {
      // Phone number formatting
      if (values.phone) {
        values.phone = values.phone.replace(/\D/g, "");
        if (values.phone.startsWith("998")) {
          values.phone = values.phone.substring(3);
        }
      }

      if (editingAdmin) {
        // Update admin
        const updateData = {
          id: editingAdmin._id,
          username: values.username,
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
          facultyId: values.facultyId,
          isActive: values.isActive !== undefined ? values.isActive : true,
        };

        // Only send password if it was changed
        if (values.password && values.password.length >= 6) {
          updateData.password = values.password;
        }

        const result = await updateAdmin(updateData).unwrap();
        if (result.success) {
          message.success("Fakultet admin yangilandi");
        }
      } else {
        // Create new admin
        const result = await createAdmin(values).unwrap();
        if (result.success) {
          message.success("Fakultet admin qo'shildi");
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingAdmin(null);
      setShowPassword(false);
    } catch (error) {
      message.error(error.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleEdit = (record) => {
    setEditingAdmin(record);

    // Parse phone number
    let phoneNumber = record.profile?.phone || "";
    if (phoneNumber.startsWith("+998")) {
      phoneNumber = phoneNumber.substring(4);
    } else if (phoneNumber.startsWith("998")) {
      phoneNumber = phoneNumber.substring(3);
    }

    form.setFieldsValue({
      username: record.username,
      fullName: record.profile?.fullName,
      phone: phoneNumber,
      email: record.profile?.email,
      facultyId: record.faculty?.id,
      isActive: record.isActive !== false,
      password: "", // Empty password field for editing
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteAdmin(id).unwrap();
      if (result.success) {
        message.success("Fakultet admin o'chirildi");
      }
    } catch (error) {
      message.error(error.data?.message || "Xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: "Admin",
      key: "admin",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <div>
            <div className="font-medium text-base">
              {record.profile?.fullName}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <IdcardOutlined className="text-xs" />
              <span className="text-sm">{record.username}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Fakultet",
      key: "faculty",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <BankOutlined className="text-gray-400" />
          <Tag color="blue" className="m-0">
            {record.faculty?.name || "Belgilanmagan"}
          </Tag>
        </div>
      ),
    },
    {
      title: "Kontakt",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.profile?.phone && (
            <span className="text-gray-600 flex items-center gap-2">
              <PhoneOutlined className="text-gray-400" />
              {record.profile.phone
                .replace("+998", "+998 ")
                .replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2-$3-$4")}
            </span>
          )}
          {record.profile?.email && (
            <span className="text-gray-600 flex items-center gap-2">
              <MailOutlined className="text-gray-400" />
              {record.profile.email}
            </span>
          )}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) => (
        <Tag color={isActive !== false ? "success" : "default"}>
          {isActive !== false ? "Faol" : "Nofaol"}
        </Tag>
      ),
    },
    {
      title: "Yaratilgan",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString("uz"),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="text-blue-500 hover:text-blue-600"
            />
          </Tooltip>
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            description="Bu amalni ortga qaytarib bo'lmaydi"
            onConfirm={() => handleDelete(record._id)}
            okText="Ha, o'chirish"
            cancelText="Bekor qilish"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="O'chirish">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (adminsLoading || facultiesLoading) return <LoadingSpinner size="large" />;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Fakultet administratorlari</h2>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingAdmin(null);
              form.resetFields();
              setShowPassword(false);
              setIsModalOpen(true);
            }}
            size="large"
            className="gradient-primary border-0"
          >
            Yangi admin
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm">Jami adminlar</div>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {admins.length}
                </div>
              </div>
              <UserOutlined className="text-3xl text-blue-400" />
            </div>
          </Card>

          <Card className="border border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm">Adminlar</div>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {admins.filter((a) => a.isActive !== false).length}
                </div>
              </div>
              <UserOutlined className="text-3xl text-green-400" />
            </div>
          </Card>

          <Card className="border border-purple-200 bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-600 text-sm">Fakultetlar</div>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {faculties.length}
                </div>
              </div>
              <BankOutlined className="text-3xl text-purple-400" />
            </div>
          </Card>
        </div>

        <Table
          columns={columns}
          dataSource={admins}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Jami: ${total} ta`,
          }}
          className="shadow-sm"
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            {editingAdmin ? <EditOutlined /> : <PlusOutlined />}
            <span>
              {editingAdmin
                ? "Fakultet adminni tahrirlash"
                : "Yangi fakultet admin"}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingAdmin(null);
          form.resetFields();
          setShowPassword(false);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: "Username kiritilishi shart!" },
              { min: 3, message: "Kamida 3 ta belgi" },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: "Faqat lotin harflari, raqamlar va _ belgilari",
              },
            ]}
          >
            <Input
              prefix={<IdcardOutlined className="text-gray-400" />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <span>
                Parol
                {editingAdmin && (
                  <span className="text-gray-500 text-xs ml-2">
                    (o'zgartirmasangiz bo'sh qoldiring)
                  </span>
                )}
              </span>
            }
            rules={
              !editingAdmin
                ? [
                    { required: true, message: "Parol kiritilishi shart!" },
                    { min: 6, message: "Kamida 6 ta belgi" },
                  ]
                : [{ min: 6, message: "Kamida 6 ta belgi" }]
            }
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder={editingAdmin ? "Yangi parol (ixtiyoriy)" : "Parol"}
              size="large"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item
            name="fullName"
            label="F.I.O"
            rules={[{ required: true, message: "F.I.O kiritilishi shart!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="To'liq ism familiya"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="facultyId"
            label="Fakultet"
            rules={[{ required: true, message: "Fakultet tanlanishi shart!" }]}
          >
            <Select
              placeholder="Fakultetni tanlang"
              size="large"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {[
                ...faculties,
                { id: 999999999, name: "Boshqa", studentCount: 0 },
              ].map((f) => (
                <Select.Option key={f.id} value={f.id}>
                  {f.name} ({f.studentCount} student)
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="phone"
            label="Telefon raqam"
            rules={[
              {
                pattern: /^\d{9}$/,
                message: "Telefon raqam 9 ta raqamdan iborat bo'lishi kerak",
              },
            ]}
          >
            <Input
              addonBefore="+998"
              prefix={<PhoneOutlined className="text-gray-400" />}
              placeholder="90 123 45 67"
              maxLength={9}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Email formati noto'g'ri" }]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="email@example.com"
              size="large"
            />
          </Form.Item>

          {editingAdmin && (
            <Form.Item name="isActive" label="Status" valuePropName="checked">
              <Switch
                checkedChildren="Faol"
                unCheckedChildren="Nofaol"
                defaultChecked
              />
            </Form.Item>
          )}

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAdmin(null);
                  form.resetFields();
                  setShowPassword(false);
                }}
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={creating || updating}
                className="gradient-primary border-0"
              >
                {editingAdmin ? "Yangilash" : "Qo'shish"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
