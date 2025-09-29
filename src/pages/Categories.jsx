import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Card,
  Tag,
  Space,
  Typography,
  Popconfirm,
  Badge,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  BookOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";

const { Title, Text } = Typography;

// 100 ta chiroyli rang
const BEAUTIFUL_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#6C5CE7",
  "#A8E6CF",
  "#FFD93D",
  "#FCB69F",
  "#FF6B9D",
  "#C44569",
  "#F8B195",
  "#F67280",
  "#355C7D",
  "#6C5B7B",
  "#2ECC71",
  "#3498DB",
  "#9B59B6",
  "#E74C3C",
  "#1ABC9C",
  "#F39C12",
  "#D35400",
  "#C0392B",
  "#8E44AD",
  "#27AE60",
  "#2980B9",
  "#16A085",
  "#F1C40F",
  "#E67E22",
  "#95A5A6",
  "#34495E",
  "#7F8C8D",
  "#FF4757",
  "#5F27CD",
  "#00D2D3",
  "#48DBFB",
  "#0ABDE3",
  "#006BA6",
  "#EE5A24",
  "#009432",
  "#C4E538",
  "#F79F1F",
  "#A3CB38",
  "#1289A7",
  "#D980FA",
  "#B53471",
  "#833471",
  "#40407A",
  "#2C2C54",
  "#474787",
  "#AAA69D",
  "#227093",
  "#218C74",
  "#B33771",
  "#6D214F",
  "#182C61",
  "#82589F",
  "#3C6382",
  "#F8B500",
  "#43BE31",
  "#F97F51",
  "#25CCF7",
  "#FD7272",
  "#9AECDB",
  "#D6A2E8",
  "#55EFC4",
  "#81ECEC",
  "#74B9FF",
  "#A29BFE",
  "#FFEAA7",
  "#FDCB6E",
  "#636E72",
  "#00B894",
  "#00CEC9",
  "#0984E3",
  "#6C5CE7",
  "#B2BEC3",
  "#DFE6E9",
  "#4834D4",
  "#686DE0",
  "#30336B",
  "#130F40",
  "#535C68",
  "#95AFC0",
  "#22A6B3",
  "#F0932B",
  "#EB4D4B",
  "#6AB04C",
  "#BADC58",
  "#C7ECEE",
  "#7BED9F",
  "#70A1FF",
  "#5352ED",
  "#3742FA",
  "#2F3542",
  "#57606F",
  "#FF6348",
  "#FF7675",
  "#FF4834",
  "#FFA502",
  "#FF3838",
  "#FF9FF3",
  "#54A0FF",
  "#48DBFB",
];

export default function Categories() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [usedColors, setUsedColors] = useState([]);
  const [form] = Form.useForm();

  // API queries
  const { data, isLoading } = useGetCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = data?.data || [];

  // Load used colors when categories are fetched
  useEffect(() => {
    if (categories && categories.length > 0) {
      const colors = categories.map((cat) => cat.color).filter(Boolean);
      setUsedColors(colors);
    }
  }, [categories]);

  // Get random unused color
  const getRandomUnusedColor = () => {
    const availableColors = BEAUTIFUL_COLORS.filter(
      (color) => !usedColors.includes(color)
    );

    if (availableColors.length === 0) {
      // Agar barcha ranglar ishlatilgan bo'lsa, random rang qaytarish
      return BEAUTIFUL_COLORS[
        Math.floor(Math.random() * BEAUTIFUL_COLORS.length)
      ];
    }

    const randomIndex = Math.floor(Math.random() * availableColors.length);
    return availableColors[randomIndex];
  };

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        // Update - keep the same color
        const result = await updateCategory({
          id: editingCategory._id,
          name: values.name,
          description: values.description || "",
          color: editingCategory.color,
          icon: "BookOutlined",
        }).unwrap();

        if (result.success) {
          message.success("Kategoriya yangilandi");
        }
      } else {
        // Create - assign random unused color
        const newColor = getRandomUnusedColor();

        const result = await createCategory({
          name: values.name,
          description: values.description || "",
          color: newColor,
          icon: "BookOutlined",
        }).unwrap();

        if (result.success) {
          setUsedColors([...usedColors, newColor]);
          message.success("Kategoriya qo'shildi");
        }
      }

      setIsModalOpen(false);
      form.resetFields();
      setEditingCategory(null);
    } catch (error) {
      message.error(error.data?.message || "Xatolik yuz berdi");
    }
  };

  const handleEdit = (record) => {
    setEditingCategory(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id, color) => {
    try {
      const result = await deleteCategory(id).unwrap();
      if (result.success) {
        // Remove color from used colors
        setUsedColors(usedColors.filter((c) => c !== color));
        message.success("Kategoriya o'chirildi");
      }
    } catch (error) {
      message.error(error.data?.message || "Xatolik yuz berdi");
    }
  };

  const columns = [
    {
      title: "Kategoriya",
      key: "category",
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: record.color + "20",
              color: record.color,
            }}
          >
            <BookOutlined />
          </div>
          <div>
            <Text strong className="text-base">
              {record.name}
            </Text>
            {record.description && (
              <div className="text-xs text-gray-500 mt-1">
                {record.description}
              </div>
            )}
          </div>
        </div>
      ),
    },

    {
      title: "To'garaklar",
      dataIndex: "clubCount",
      key: "clubCount",
      width: 120,
      render: (count) => (
        <Badge showZero>
          <Tag>{count} ta</Tag>
        </Badge>
      ),
    },
    {
      title: "Holat",
      dataIndex: "isActive",
      key: "status",
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "Faol" : "Nofaol"}
        </Tag>
      ),
    },
    {
      title: "Yaratilgan",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => new Date(date).toLocaleDateString("uz"),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space>
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              className="text-blue-500"
            />
          </Tooltip>
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            description={
              record.clubCount > 0
                ? `${record.clubCount} ta to'garak bu kategoriyaga biriktirilgan`
                : "Bu amalni ortga qaytarib bo'lmaydi"
            }
            onConfirm={() => handleDelete(record._id, record.color)}
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{ danger: true }}
            disabled={record.clubCount > 0}
          >
            <Tooltip
              title={
                record.clubCount > 0
                  ? "To'garaklar mavjud bo'lganda o'chirib bo'lmaydi"
                  : "O'chirish"
              }
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                disabled={record.clubCount > 0}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) return <LoadingSpinner size="large" />;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!mb-0">
            To'garak kategoriyalari
          </Title>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingCategory(null);
              form.resetFields();
              setIsModalOpen(true);
            }}
            size="large"
          >
            Kategoriya qo'shish
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Jami kategoriyalar</Text>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {categories.length}
                </div>
              </div>
              <AppstoreOutlined className="text-3xl text-blue-400" />
            </div>
          </Card>

          <Card className="border border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Kategoriyalar</Text>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {categories.filter((c) => c.isActive).length}
                </div>
              </div>
              <AppstoreOutlined className="text-3xl text-green-400" />
            </div>
          </Card>

          <Card className="border border-purple-200 bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Jami to'garaklar</Text>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {categories.reduce((sum, c) => sum + (c.clubCount || 0), 0)}
                </div>
              </div>
              <BookOutlined className="text-3xl text-purple-400" />
            </div>
          </Card>

          <Card className="border border-orange-200 bg-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">O'rtacha to'garaklar</Text>
                <div className="text-2xl font-bold text-orange-600 mt-1">
                  {categories.length > 0
                    ? Math.round(
                        categories.reduce(
                          (sum, c) => sum + (c.clubCount || 0),
                          0
                        ) / categories.length
                      )
                    : 0}
                </div>
              </div>
              <BookOutlined className="text-3xl text-orange-400" />
            </div>
          </Card>
        </div>

        <Table
          columns={columns}
          dataSource={categories}
          rowKey="_id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Jami: ${total} ta`,
          }}
        />
      </Card>

      <Modal
        title={
          <div className="flex items-center gap-2">
            {editingCategory ? <EditOutlined /> : <PlusOutlined />}
            <span>
              {editingCategory ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
          form.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          <Form.Item
            name="name"
            label="Kategoriya nomi"
            rules={[
              { required: true, message: "Kategoriya nomi kiritilishi shart!" },
              { min: 2, message: "Kamida 2 ta belgi" },
              { max: 50, message: "Maksimum 50 ta belgi" },
            ]}
          >
            <Input
              placeholder="Masalan: Sport, San'at, IT, Til o'rganish..."
              size="large"
              autoFocus
            />
          </Form.Item>

          <Form.Item name="description" label="Tavsif (ixtiyoriy)">
            <Input.TextArea
              placeholder="Kategoriya haqida qisqacha ma'lumot (ixtiyoriy)"
              rows={3}
              maxLength={200}
              showCount
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingCategory(null);
                  form.resetFields();
                }}
              >
                Bekor qilish
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={creating || updating}
              >
                {editingCategory ? "Yangilash" : "Qo'shish"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
