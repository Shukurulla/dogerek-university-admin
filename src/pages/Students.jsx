import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Select,
  Input,
  Tag,
  Avatar,
  Space,
  Typography,
  Badge,
  Alert,
  Button,
  Radio,
  Statistic,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  BookOutlined,
  GlobalOutlined,
  WarningOutlined,
  FilterOutlined,
  ClearOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import {
  useGetStudentsQuery,
  useGetFacultiesQuery,
  useGetGroupsQuery,
  useGetDashboardQuery,
} from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export default function Students() {
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    facultyId: null,
    groupId: null,
    busy: null,
    search: "",
    page: 1,
    limit: 10,
  });

  // URL'dan filter parametrlarini olish
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const busyParam = searchParams.get("busy");
    if (busyParam) {
      setFilters((prev) => ({ ...prev, busy: busyParam }));
    }
  }, [location]);

  const { data, isLoading, error, refetch } = useGetStudentsQuery(filters, {
    skip: false,
    refetchOnMountOrArgChange: true,
  });

  const { data: facultiesData, isLoading: facultiesLoading } =
    useGetFacultiesQuery();
  const { data: groupsData, isLoading: groupsLoading } = useGetGroupsQuery(
    filters.facultyId
  );
  const { data: dashboardData } = useGetDashboardQuery();

  const students = data?.data?.students || [];
  const pagination = data?.data?.pagination || {};
  const faculties = facultiesData?.data || [];
  const groups = groupsData?.data || [];
  const dashStats = dashboardData?.data || {};

  // Debug
  useEffect(() => {
    console.log("Current filters:", filters);
    console.log("API Response:", data);
    console.log("Students received:", students.length);
  }, [filters, data, students]);

  const columns = [
    {
      title: "Student",
      key: "student",
      fixed: "left",
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.image}
            icon={!record.image && <UserOutlined />}
            size="large"
            className="bg-blue-500"
          />
          <div>
            <div className="font-medium">{record.full_name}</div>
            <Text className="text-xs text-gray-500">
              {record.student_id_number}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Fakultet",
      dataIndex: ["department", "name"],
      key: "faculty",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Guruh",
      dataIndex: ["group", "name"],
      key: "group",
      render: (text) => <Tag color="green">{text}</Tag>,
    },
    {
      title: "Kurs",
      dataIndex: ["level", "name"],
      key: "level",
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: "To'garaklar",
      key: "clubs",
      render: (_, record) => {
        const activeClubs =
          record.enrolledClubs?.filter((e) => e.status === "approved") || [];
        if (activeClubs.length === 0) {
          return <Tag color="default">Yo'q</Tag>;
        }
        return (
          <Space size="small" wrap>
            {activeClubs.map((club, index) => (
              <Tag key={index} color="purple" icon={<BookOutlined />}>
                {club.club?.name || "To'garak"}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Tashqi kurslar",
      key: "external",
      render: (_, record) => {
        const count = record.externalCourses?.length || 0;
        if (count === 0) {
          return <Tag color="default">Yo'q</Tag>;
        }
        return (
          <Tag color="orange" icon={<GlobalOutlined />}>
            {count} ta
          </Tag>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const hasClubs = record.enrolledClubs?.some(
          (e) => e.status === "approved"
        );
        const hasExternal = record.externalCourses?.length > 0;

        if (hasClubs || hasExternal) {
          return <Badge status="success" text="Band" />;
        }
        return <Badge status="warning" text="Band emas" />;
      },
    },
  ];

  const handleBusyFilterChange = (value) => {
    console.log("Changing busy filter to:", value);

    let busyValue = null;
    if (value === "busy") {
      busyValue = "true";
    } else if (value === "notbusy") {
      busyValue = "false";
    }

    const newFilters = {
      ...filters,
      busy: busyValue,
      page: 1,
    };

    console.log("New filters:", newFilters);
    setFilters(newFilters);

    // URL'ni yangilash
    const searchParams = new URLSearchParams();
    if (busyValue !== null) {
      searchParams.set("busy", busyValue);
    }
    navigate({ search: searchParams.toString() }, { replace: true });
  };

  const clearFilters = () => {
    setFilters({
      facultyId: null,
      groupId: null,
      busy: null,
      search: "",
      page: 1,
      limit: 10,
    });
    navigate({ search: "" }, { replace: true });
  };

  if (isLoading || facultiesLoading) return <LoadingSpinner size="large" />;

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

  // Dashboard'dan statistika
  const totalStudents = dashStats.totalStudents || 0;
  const busyStudents = dashStats.busyStudents || 0;
  const notBusyStudents = dashStats.notBusyStudents || 0;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!mb-0">
            Studentlar
          </Title>

          <Space>
            <Button icon={<ReloadOutlined />} onClick={refetch}>
              Yangilash
            </Button>
            <Button
              icon={<ClearOutlined />}
              onClick={clearFilters}
              disabled={
                !filters.facultyId &&
                !filters.groupId &&
                !filters.search &&
                !filters.busy
              }
            >
              Tozalash
            </Button>
          </Space>
        </div>

        {/* Filter Section */}
        <Card className="mb-6 bg-gray-50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <FilterOutlined className="text-gray-500" />
              <Text strong>Filterlar</Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                placeholder="🏫 Fakultetni tanlang"
                style={{ width: "100%" }}
                size="large"
                allowClear
                loading={facultiesLoading}
                value={filters.facultyId}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    facultyId: value,
                    groupId: null,
                    page: 1,
                  }))
                }
              >
                {faculties.map((f) => (
                  <Select.Option key={f.id} value={f.id}>
                    <div className="flex justify-between">
                      <span>{f.name}</span>
                      <Tag size="small">{f.studentCount}</Tag>
                    </div>
                  </Select.Option>
                ))}
              </Select>

              <Select
                placeholder="👥 Guruhni tanlang"
                style={{ width: "100%" }}
                size="large"
                allowClear
                loading={groupsLoading}
                disabled={!filters.facultyId}
                value={filters.groupId}
                onChange={(value) =>
                  setFilters((prev) => ({ ...prev, groupId: value, page: 1 }))
                }
              >
                {groups.map((g) => (
                  <Select.Option key={g.id} value={g.id}>
                    <div className="flex justify-between">
                      <span>{g.name}</span>
                      <Tag size="small">{g.studentCount}</Tag>
                    </div>
                  </Select.Option>
                ))}
              </Select>

              <Input
                placeholder="🔍 F.I.O yoki ID bo'yicha qidirish"
                prefix={<SearchOutlined />}
                style={{ width: "100%" }}
                size="large"
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    search: e.target.value,
                    page: 1,
                  }))
                }
                allowClear
              />
            </div>

            {/* Busy Filter Radio */}
            <div className="mt-4">
              <Text strong className="mb-2 block">
                Bandlik holati:
              </Text>
              <Radio.Group
                value={
                  filters.busy === "true"
                    ? "busy"
                    : filters.busy === "false"
                    ? "notbusy"
                    : "all"
                }
                onChange={(e) => handleBusyFilterChange(e.target.value)}
                size="large"
                buttonStyle="solid"
              >
                <Radio.Button value="all">
                  <Space>
                    <UserOutlined />
                    Barchasi
                  </Space>
                </Radio.Button>
                <Radio.Button value="busy">
                  <Space>
                    <BookOutlined />
                    Band studentlar
                  </Space>
                </Radio.Button>
                <Radio.Button value="notbusy">
                  <Space>
                    <WarningOutlined />
                    Band bo'lmaganlar
                  </Space>
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card
            className="border border-blue-200 bg-blue-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleBusyFilterChange("all")}
          >
            <Statistic
              title="Jami studentlar"
              value={totalStudents}
              prefix={<UserOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>

          <Card
            className="border border-green-200 bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleBusyFilterChange("busy")}
          >
            <Statistic
              title="Band studentlar"
              value={busyStudents}
              prefix={<BookOutlined />}
              valueStyle={{ color: "#52c41a" }}
              suffix={<Text className="text-xs text-green-500">ta</Text>}
            />
          </Card>

          <Card
            className="border border-orange-200 bg-orange-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleBusyFilterChange("notbusy")}
          >
            <Statistic
              title="Band bo'lmaganlar"
              value={notBusyStudents}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "#fa8c16" }}
              suffix={<Text className="text-xs text-orange-500">ta</Text>}
            />
          </Card>
        </div>

        {/* Current filter status */}
        {filters.busy && (
          <Alert
            message={
              filters.busy === "true"
                ? "Band studentlar ko'rsatilmoqda"
                : "Band bo'lmagan studentlar ko'rsatilmoqda"
            }
            type="info"
            showIcon
            closable
            onClose={() => handleBusyFilterChange("all")}
            className="mb-4"
          />
        )}

        <Table
          columns={columns}
          dataSource={students}
          rowKey="_id"
          scroll={{ x: 1200 }}
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: pagination.total,
            showSizeChanger: true,
            showTotal: (total) => `Jami: ${total} ta`,
            onChange: (page, pageSize) =>
              setFilters((prev) => ({ ...prev, page, limit: pageSize })),
          }}
          locale={{
            emptyText:
              filters.busy === "true"
                ? "Band studentlar topilmadi"
                : filters.busy === "false"
                ? "Band bo'lmagan studentlar topilmadi"
                : "Ma'lumot topilmadi",
          }}
          className="shadow-sm"
        />
      </Card>
    </div>
  );
}
