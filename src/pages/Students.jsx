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
  Tabs,
  Badge,
  Alert,
} from "antd";
import {
  SearchOutlined,
  UserOutlined,
  BookOutlined,
  GlobalOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  useGetStudentsQuery,
  useGetFacultiesQuery,
  useGetGroupsQuery,
} from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

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

  const { data, isLoading, error } = useGetStudentsQuery(filters);
  const { data: facultiesData, isLoading: facultiesLoading } =
    useGetFacultiesQuery();
  const { data: groupsData, isLoading: groupsLoading } = useGetGroupsQuery(
    filters.facultyId
  );

  const students = data?.data?.students || [];
  const pagination = data?.data?.pagination || {};
  const faculties = facultiesData?.data || [];
  const groups = groupsData?.data || [];

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
        const hasClubs =
          record.enrolledClubs?.filter((e) => e.status === "approved").length >
          0;
        const hasExternal = record.externalCourses?.length > 0;

        if (hasClubs || hasExternal) {
          return <Badge status="success" text="Band" />;
        }
        return <Badge status="warning" text="Band emas" />;
      },
    },
  ];

  const handleTabChange = (key) => {
    const newFilters = {
      ...filters,
      busy: key === "all" ? null : key,
      page: 1,
    };
    setFilters(newFilters);

    // URL'ni yangilash
    const searchParams = new URLSearchParams();
    if (key !== "all") {
      searchParams.set("busy", key);
    }
    navigate({ search: searchParams.toString() }, { replace: true });
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

  // Statistics
  const totalStudents = pagination.total || 0;
  const busyStudents = students.filter(
    (s) =>
      s.enrolledClubs?.filter((e) => e.status === "approved").length > 0 ||
      s.externalCourses?.length > 0
  ).length;
  const notBusyStudents = totalStudents - busyStudents;

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!mb-0">
            Studentlar
          </Title>

          <Space size="middle">
            <Select
              placeholder="Fakultet"
              style={{ width: 180 }}
              allowClear
              loading={facultiesLoading}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  facultyId: value,
                  groupId: null,
                }))
              }
            >
              {faculties.map((f) => (
                <Select.Option key={f.id} value={f.id}>
                  {f.name} ({f.studentCount || 0} student)
                </Select.Option>
              ))}
            </Select>

            <Select
              placeholder="Guruh"
              style={{ width: 150 }}
              allowClear
              loading={groupsLoading}
              disabled={!filters.facultyId}
              onChange={(value) =>
                setFilters((prev) => ({ ...prev, groupId: value }))
              }
            >
              {groups.map((g) => (
                <Select.Option key={g.id} value={g.id}>
                  {g.name} ({g.studentCount || 0} student)
                </Select.Option>
              ))}
            </Select>

            <Input
              placeholder="Qidirish..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
            />
          </Space>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card
            className="border border-blue-200 bg-blue-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleTabChange("all")}
          >
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Jami studentlar</Text>
                <div className="text-2xl font-bold text-blue-600 mt-1">
                  {totalStudents}
                </div>
              </div>
              <UserOutlined className="text-3xl text-blue-400" />
            </div>
          </Card>

          <Card
            className="border border-green-200 bg-green-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleTabChange("true")}
          >
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Band studentlar</Text>
                <div className="text-2xl font-bold text-green-600 mt-1">
                  {busyStudents}
                </div>
                <Text className="text-xs text-green-500">
                  {totalStudents > 0
                    ? `${((busyStudents / totalStudents) * 100).toFixed(1)}%`
                    : "0%"}
                </Text>
              </div>
              <BookOutlined className="text-3xl text-green-400" />
            </div>
          </Card>

          <Card
            className="border border-orange-200 bg-orange-50 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleTabChange("false")}
          >
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-gray-600">Band bo'lmagan</Text>
                <div className="text-2xl font-bold text-orange-600 mt-1">
                  {notBusyStudents}
                </div>
                <Text className="text-xs text-orange-500">
                  {totalStudents > 0
                    ? `${((notBusyStudents / totalStudents) * 100).toFixed(1)}%`
                    : "0%"}
                </Text>
              </div>
              <WarningOutlined className="text-3xl text-orange-400" />
            </div>
          </Card>
        </div>

        <Tabs
          activeKey={filters.busy || "all"}
          onChange={handleTabChange}
          className="mb-4"
        >
          <TabPane
            tab={
              <span>
                Barcha studentlar <Badge count={totalStudents} showZero />
              </span>
            }
            key="all"
          />
          <TabPane
            tab={
              <span>
                Band studentlar{" "}
                <Badge count={busyStudents} showZero className="bg-green-500" />
              </span>
            }
            key="true"
          />
          <TabPane
            tab={
              <span>
                Band bo'lmaganlar{" "}
                <Badge
                  count={notBusyStudents}
                  showZero
                  className="bg-orange-500"
                />
              </span>
            }
            key="false"
          />
        </Tabs>

        <Table
          columns={columns}
          dataSource={students}
          rowKey="_id"
          scroll={{ x: 1200 }}
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
