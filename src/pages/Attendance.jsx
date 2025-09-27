import { useState } from "react";
import {
  Table,
  Card,
  DatePicker,
  Select,
  Tag,
  Typography,
  Space,
  Badge,
  Alert,
  Empty,
  Modal,
  List,
  Avatar,
  Button,
} from "antd";
import {
  CalendarOutlined,
  BookOutlined,
  UserOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useGetAttendanceQuery, useGetClubsQuery } from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Attendance() {
  const [filters, setFilters] = useState({
    clubId: null,
    startDate: null,
    endDate: null,
    page: 1,
    limit: 10,
  });

  const [detailsModal, setDetailsModal] = useState({
    visible: false,
    data: null,
  });

  const { data, isLoading, error } = useGetAttendanceQuery(filters);
  const { data: clubsData, isLoading: clubsLoading } = useGetClubsQuery({
    page: 1,
    limit: 100,
  });

  const attendance = data?.data?.attendance || [];
  const pagination = data?.data?.pagination || {};
  const clubs = clubsData?.data?.clubs || [];

  const showAttendanceDetails = (record) => {
    setDetailsModal({
      visible: true,
      data: record,
    });
  };

  const columns = [
    {
      title: "Sana",
      dataIndex: "date",
      key: "date",
      render: (date) => (
        <div className="flex items-center gap-2">
          <CalendarOutlined className="text-gray-400" />
          <div>
            <div className="font-medium">
              {dayjs(date).format("DD.MM.YYYY")}
            </div>
            <Text className="text-xs text-gray-500">
              {dayjs(date).format("dddd")}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "To'garak",
      dataIndex: ["club", "name"],
      key: "club",
      render: (text) => (
        <Tag color="blue" icon={<BookOutlined />}>
          {text}
        </Tag>
      ),
    },
    {
      title: "Tutor",
      dataIndex: ["markedBy", "profile", "fullName"],
      key: "tutor",
      render: (text) => (
        <div className="flex items-center gap-2">
          <UserOutlined className="text-gray-400" />
          <Text>{text}</Text>
        </div>
      ),
    },
    {
      title: "Davomat",
      key: "attendance",
      render: (_, record) => {
        const total = record.students?.length || 0;
        const present = record.students?.filter((s) => s.present).length || 0;
        const absent = total - present;
        const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

        return (
          <div className="space-y-2">
            <div className="flex gap-4">
              <div className="flex items-center gap-1">
                <CheckCircleOutlined className="text-green-500" />
                <Text className="text-green-600 font-medium">{present}</Text>
              </div>
              <div className="flex items-center gap-1">
                <CloseCircleOutlined className="text-red-500" />
                <Text className="text-red-600 font-medium">{absent}</Text>
              </div>
            </div>
            <div>
              <Badge
                status={
                  percentage >= 80
                    ? "success"
                    : percentage >= 60
                    ? "warning"
                    : "error"
                }
                text={`${percentage}%`}
              />
            </div>
          </div>
        );
      },
    },
    {
      title: "Izoh",
      dataIndex: "notes",
      key: "notes",
      render: (text) => <Text className="text-gray-600">{text || "-"}</Text>,
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => showAttendanceDetails(record)}
          >
            Batafsil
          </Button>
          {record.telegramPostLink && (
            <a
              href={record.telegramPostLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              Telegram
            </a>
          )}
        </Space>
      ),
    },
  ];

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setFilters((prev) => ({
        ...prev,
        startDate: dates[0].format("YYYY-MM-DD"),
        endDate: dates[1].format("YYYY-MM-DD"),
        page: 1,
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        startDate: null,
        endDate: null,
        page: 1,
      }));
    }
  };

  if (isLoading || clubsLoading) return <LoadingSpinner size="large" />;

  if (error) {
    return (
      <div className="p-6">
        <Alert
          message="Xatolik yuz berdi"
          description={error.message || "Ma'lumotlarni yuklashda xatolik"}
          type="error"
          showIcon
        />
      </div>
    );
  }

  // Calculate statistics
  const totalSessions = attendance.length;
  const avgAttendance =
    attendance.reduce((sum, a) => {
      const total = a.students?.length || 0;
      const present = a.students?.filter((s) => s.present).length || 0;
      return sum + (total > 0 ? (present / total) * 100 : 0);
    }, 0) / (totalSessions || 1);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!mb-0">
            Davomatlar
          </Title>

          <Space size="middle">
            <RangePicker
              placeholder={["Boshlanish", "Tugash"]}
              onChange={handleDateChange}
              format="DD.MM.YYYY"
            />

            <Select
              placeholder="To'garak tanlang"
              style={{ width: 200 }}
              allowClear
              loading={clubsLoading}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, clubId: value, page: 1 }))
              }
            >
              {clubs.map((club) => (
                <Select.Option key={club._id} value={club._id}>
                  {club.name}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border border-blue-200 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Jami darslar</Text>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {totalSessions}
                </div>
              </div>
              <CalendarOutlined className="text-3xl text-blue-400" />
            </div>
          </Card>

          <Card className="border border-green-200 bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">O'rtacha davomat</Text>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {avgAttendance.toFixed(1)}%
                </div>
              </div>
              <CheckCircleOutlined className="text-3xl text-green-400" />
            </div>
          </Card>

          <Card className="border border-purple-200 bg-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Bugungi darslar</Text>
                <div className="text-2xl font-bold text-purple-600 mt-1">
                  {
                    attendance.filter((a) =>
                      dayjs(a.date).isSame(dayjs(), "day")
                    ).length
                  }
                </div>
              </div>
              <BookOutlined className="text-3xl text-purple-400" />
            </div>
          </Card>
        </div>

        {attendance.length === 0 ? (
          <Empty
            description="Davomat ma'lumotlari topilmadi"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Table
            columns={columns}
            dataSource={attendance}
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
        )}
      </Card>

      {/* Attendance Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <TeamOutlined />
            <span>Davomat tafsilotlari</span>
          </div>
        }
        open={detailsModal.visible}
        onCancel={() => setDetailsModal({ visible: false, data: null })}
        footer={null}
        width={700}
      >
        {detailsModal.data && (
          <div className="space-y-4">
            <Card className="bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text className="text-gray-500">To'garak:</Text>
                  <div className="font-medium">
                    {detailsModal.data.club?.name}
                  </div>
                </div>
                <div>
                  <Text className="text-gray-500">Sana:</Text>
                  <div className="font-medium">
                    {dayjs(detailsModal.data.date).format("DD.MM.YYYY dddd")}
                  </div>
                </div>
                <div>
                  <Text className="text-gray-500">Tutor:</Text>
                  <div className="font-medium">
                    {detailsModal.data.markedBy?.profile?.fullName}
                  </div>
                </div>
                <div>
                  <Text className="text-gray-500">Jami studentlar:</Text>
                  <div className="font-medium">
                    {detailsModal.data.students?.length || 0} ta
                  </div>
                </div>
              </div>
              {detailsModal.data.notes && (
                <div className="mt-4 pt-4 border-t">
                  <Text className="text-gray-500">Izoh:</Text>
                  <div className="mt-1">{detailsModal.data.notes}</div>
                </div>
              )}
            </Card>

            <div className="flex justify-between items-center">
              <Title level={5} className="!mb-0">
                Studentlar davomati
              </Title>
              <div className="flex gap-4">
                <Tag color="success">
                  Kelgan:{" "}
                  {detailsModal.data.students?.filter((s) => s.present)
                    .length || 0}
                </Tag>
                <Tag color="error">
                  Kelmagan:{" "}
                  {detailsModal.data.students?.filter((s) => !s.present)
                    .length || 0}
                </Tag>
              </div>
            </div>

            <List
              dataSource={detailsModal.data.students || []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.student?.image}
                        icon={!item.student?.image && <UserOutlined />}
                        className={item.present ? "bg-green-500" : "bg-red-500"}
                      />
                    }
                    title={
                      <div className="flex items-center gap-2">
                        <Text strong>
                          {item.student?.full_name || "Noma'lum"}
                        </Text>
                        {item.present ? (
                          <Tag color="success" icon={<CheckCircleOutlined />}>
                            Kelgan
                          </Tag>
                        ) : (
                          <Tag color="error" icon={<CloseCircleOutlined />}>
                            Kelmagan
                          </Tag>
                        )}
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <Text className="text-xs text-gray-500">
                          ID: {item.student?.student_id_number}
                        </Text>
                        {item.reason && (
                          <Text className="text-xs text-orange-600">
                            Sabab: {item.reason}
                          </Text>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
