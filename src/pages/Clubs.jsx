import { useState } from "react";
import {
  Table,
  Card,
  Select,
  Input,
  Tag,
  Space,
  Typography,
  Button,
  Avatar,
  Badge,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  BookOutlined,
  UserOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useGetClubsQuery } from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";

const { Title, Text } = Typography;
const { Search } = Input;

export default function Clubs() {
  const [filters, setFilters] = useState({
    facultyId: null,
    search: "",
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetClubsQuery(filters);
  const clubs = data?.data?.clubs || [];
  const pagination = data?.data?.pagination || {};

  const columns = [
    {
      title: "To'garak nomi",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            icon={<BookOutlined />}
            className="bg-gradient-to-r from-blue-500 to-purple-500"
          />
          <div>
            <Text strong className="text-base">
              {text}
            </Text>
            {record.description && (
              <div className="text-xs text-gray-500 mt-1">
                {record.description.length > 50
                  ? `${record.description.substring(0, 50)}...`
                  : record.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Fakultet",
      dataIndex: ["faculty", "name"],
      key: "faculty",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Tutor",
      dataIndex: ["tutor", "profile", "fullName"],
      key: "tutor",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400" />
          <div>
            <Text>{text || "Belgilanmagan"}</Text>
            {record.tutor?.profile?.phone && (
              <div className="text-xs text-gray-500">
                {record.tutor.profile.phone}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Jadval",
      key: "schedule",
      render: (_, record) => {
        if (!record.schedule) return <Text className="text-gray-400">-</Text>;

        const weekDays = {
          1: "Du",
          2: "Se",
          3: "Ch",
          4: "Pa",
          5: "Ju",
          6: "Sh",
          7: "Ya",
        };

        const weekType = {
          odd: "Toq",
          even: "Juft",
          both: "Har hafta",
        };

        return (
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <ClockCircleOutlined className="text-gray-400 text-xs" />
              <Text className="text-sm">
                {record.schedule.time?.start} - {record.schedule.time?.end}
              </Text>
            </div>
            <div className="flex items-center gap-1">
              <CalendarOutlined className="text-gray-400 text-xs" />
              <Text className="text-xs text-gray-600">
                {record.schedule.days?.map((d) => weekDays[d]).join(", ")}
              </Text>
            </div>
            <Tag color="purple" className="text-xs">
              {weekType[record.schedule.weekType]}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Joylashuv",
      dataIndex: "location",
      key: "location",
      render: (text) => (
        <div className="flex items-center gap-1">
          <EnvironmentOutlined className="text-gray-400" />
          <Text className="text-sm">{text || "-"}</Text>
        </div>
      ),
    },
    {
      title: "Studentlar",
      key: "students",
      render: (_, record) => {
        const current = record.currentStudents || 0;
        const capacity = record.capacity;
        const percentage = capacity ? (current / capacity) * 100 : 0;

        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <TeamOutlined className="text-gray-400" />
              <Text strong>{current}</Text>
              {capacity && <Text className="text-gray-500">/ {capacity}</Text>}
            </div>
            {capacity && (
              <Tooltip title={`${percentage.toFixed(0)}% to'lgan`}>
                <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      percentage >= 90
                        ? "bg-red-500"
                        : percentage >= 70
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </Tooltip>
            )}
          </div>
        );
      },
    },
    {
      title: "Holat",
      key: "status",
      render: (_, record) => {
        const availableSlots = record.availableSlots;

        if (availableSlots === 0) {
          return <Badge status="error" text="To'lgan" />;
        } else if (availableSlots && availableSlots < 5) {
          return <Badge status="warning" text={`${availableSlots} ta joy`} />;
        } else {
          return <Badge status="success" text="Ochiq" />;
        }
      },
    },
  ];

  // Mock faculties
  const faculties = [
    { id: 1, name: "Matematika fakulteti" },
    { id: 2, name: "Fizika fakulteti" },
    { id: 3, name: "Informatika fakulteti" },
    { id: 4, name: "Tarix fakulteti" },
  ];

  if (isLoading) return <LoadingSpinner size="large" />;

  // Statistics
  const totalClubs = pagination.total || 0;
  const totalCapacity = clubs.reduce((sum, c) => sum + (c.capacity || 0), 0);
  const totalStudents = clubs.reduce(
    (sum, c) => sum + (c.currentStudents || 0),
    0
  );
  const averageFill =
    totalCapacity > 0 ? ((totalStudents / totalCapacity) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!mb-0">
            To'garaklar
          </Title>

          <Space size="middle">
            <Select
              placeholder="Fakultet"
              style={{ width: 200 }}
              allowClear
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, facultyId: value, page: 1 }))
              }
            >
              {faculties.map((f) => (
                <Select.Option key={f.id} value={f.id}>
                  {f.name}
                </Select.Option>
              ))}
            </Select>

            <Search
              placeholder="Qidirish..."
              style={{ width: 250 }}
              onSearch={(value) =>
                setFilters((prev) => ({ ...prev, search: value, page: 1 }))
              }
            />
          </Space>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Jami to'garaklar</Text>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {totalClubs}
                </div>
              </div>
              <BookOutlined className="text-3xl text-blue-400" />
            </div>
          </Card>

          <Card className="border border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Jami studentlar</Text>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {totalStudents}
                </div>
              </div>
              <TeamOutlined className="text-3xl text-green-400" />
            </div>
          </Card>

          <Card className="border border-purple-200 bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Umumiy sig'im</Text>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {totalCapacity}
                </div>
              </div>
              <UserOutlined className="text-3xl text-purple-400" />
            </div>
          </Card>

          <Card className="border border-orange-200 bg-orange-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">O'rtacha to'lganlik</Text>
                <div className="text-2xl font-bold text-orange-600 mt-1">
                  {averageFill}%
                </div>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-orange-400 flex items-center justify-center">
                <div className="text-xs font-bold text-orange-600">
                  {Math.round(averageFill)}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Table
          columns={columns}
          dataSource={clubs}
          rowKey="_id"
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Jami: ${total} ta`,
            onChange: (page, pageSize) =>
              setFilters((prev) => ({ ...prev, page, limit: pageSize })),
          }}
          className="shadow-sm"
        />
      </Card>
    </div>
  );
}
