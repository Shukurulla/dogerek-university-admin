import { useState } from "react";
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
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import {
  useGetFacultyAdminsQuery,
  useCreateFacultyAdminMutation,
  useUpdateFacultyAdminMutation,
  useDeleteFacultyAdminMutation,
} from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function FacultyAdmins() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [form] = Form.useForm();

  const { data, isLoading } = useGetFacultyAdminsQuery();
  const [createAdmin, { isLoading: creating }] =
    useCreateFacultyAdminMutation();
  const [updateAdmin, { isLoading: updating }] =
    useUpdateFacultyAdminMutation();
  const [deleteAdmin] = useDeleteFacultyAdminMutation();

  const admins = data?.data || [];

  const handleSubmit = async (values) => {
    try {
      if (editingAdmin) {
        const result = await updateAdmin({
          id: editingAdmin._id,
          ...values,
        }).unwrap();
        if (result.success) {
          message.success("Fakultet admin yangilandi");
        }
      } else {
        const result = await createAdmin(values).unwrap();
        if (result.success) {
          message.success("Fakultet admin qo'shildi");
        }
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingAdmin(null);
    } catch (error) {
      message.error(error.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleEdit = (record) => {
    setEditingAdmin(record);
    form.setFieldsValue({
      username: record.username,
      fullName: record.profile?.fullName,
      phone: record.profile?.phone?.replace("+998", ""),
      email: record.profile?.email,
      facultyId: record.faculty?.id,
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
      message.error("Xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: "F.I.O",
      dataIndex: ["profile", "fullName"],
      key: "fullName",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Fakultet",
      dataIndex: ["faculty", "name"],
      key: "faculty",
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: "Kontakt",
      key: "contact",
      render: (_, record) => (
        <Space direction="vertical" size="small">
          {record.profile?.phone && (
            <span className="text-gray-600">
              <PhoneOutlined className="mr-2" />
              {record.profile.phone
                .replace("+998", "+998 ")
                .replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2-$3-$4")}
            </span>
          )}
          {record.profile?.email && (
            <span className="text-gray-600">
              <MailOutlined className="mr-2" />
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
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Faol" : "Nofaol"}
        </Tag>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            className="text-blue-500 hover:text-blue-600"
          />
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            onConfirm={() => handleDelete(record._id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Mock fakultetlar - backend dan kelishi kerak
  const faculties = [
    { id: 1, name: "Matematika fakulteti" },
    { id: 2, name: "Fizika fakulteti" },
    { id: 3, name: "Informatika fakulteti" },
    { id: 4, name: "Tarix fakulteti" },
  ];

  if (isLoading) return <LoadingSpinner size="large" />;

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
              setIsModalOpen(true);
            }}
            size="large"
            className="gradient-primary border-0"
          >
            Yangi admin
          </Button>
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
          editingAdmin ? "Fakultet adminni tahrirlash" : "Yangi fakultet admin"
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingAdmin(null);
          form.resetFields();
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
            ]}
          >
            <Input
              placeholder="Username"
              disabled={editingAdmin}
              size="large"
            />
          </Form.Item>

          {!editingAdmin && (
            <Form.Item
              name="password"
              label="Parol"
              rules={[
                { required: true, message: "Parol kiritilishi shart!" },
                { min: 6, message: "Kamida 6 ta belgi" },
              ]}
            >
              <Input.Password placeholder="Parol" size="large" />
            </Form.Item>
          )}

          <Form.Item
            name="fullName"
            label="F.I.O"
            rules={[{ required: true, message: "F.I.O kiritilishi shart!" }]}
          >
            <Input placeholder="To'liq ism familiya" size="large" />
          </Form.Item>

          <Form.Item
            name="facultyId"
            label="Fakultet"
            rules={[{ required: true, message: "Fakultet tanlanishi shart!" }]}
          >
            <Select placeholder="Fakultetni tanlang" size="large">
              {faculties.map((f) => (
                <Select.Option key={f.id} value={f.id}>
                  {f.name}
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
            <Input placeholder="email@example.com" size="large" />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAdmin(null);
                  form.resetFields();
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
