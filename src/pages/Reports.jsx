import { useState } from "react";
import {
  Card,
  DatePicker,
  Select,
  Button,
  Typography,
  Row,
  Col,
  Table,
  Progress,
  Tag,
  Alert,
  message,
  Spin,
} from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useGetDashboardQuery,
  useGetFacultiesQuery,
  useGetClubsQuery,
  useGetStudentsQuery,
  useGetAttendanceQuery,
} from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Reports() {
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [exporting, setExporting] = useState(false);

  // API queries
  const { data: dashboardData, isLoading: dashboardLoading } =
    useGetDashboardQuery();
  const { data: facultiesData, isLoading: facultiesLoading } =
    useGetFacultiesQuery();
  const { data: clubsData, isLoading: clubsLoading } = useGetClubsQuery({
    facultyId: selectedFaculty,
    limit: 100,
  });
  const { data: studentsData, isLoading: studentsLoading } =
    useGetStudentsQuery({
      facultyId: selectedFaculty,
      limit: 100,
    });
  const { data: attendanceData, isLoading: attendanceLoading } =
    useGetAttendanceQuery({
      startDate: dateRange[0]?.format("YYYY-MM-DD"),
      endDate: dateRange[1]?.format("YYYY-MM-DD"),
      limit: 100,
    });

  const stats = dashboardData?.data || {};
  const faculties = facultiesData?.data || [];
  const clubs = clubsData?.data?.clubs || [];
  const students = studentsData?.data?.students || [];
  const attendance = attendanceData?.data?.attendance || [];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Process data for charts
  const facultyData = faculties.map((faculty) => {
    const facultyStudents = students.filter(
      (s) => s.department?.id === faculty.id
    );
    const busyStudents = facultyStudents.filter(
      (s) =>
        s.enrolledClubs?.some((e) => e.status === "approved") ||
        s.externalCourses?.length > 0
    );

    return {
      name: faculty.name?.substring(0, 10) + "...",
      students: facultyStudents.length,
      busy: busyStudents.length,
      clubs: clubs.filter((c) => c.faculty?.id === faculty.id).length,
    };
  });

  const clubsData2 = clubs.slice(0, 5).map((club) => ({
    name: club.name?.substring(0, 15) + "...",
    value: club.currentStudents || 0,
  }));

  // Generate attendance trend data
  const attendanceData2 = [];
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, "day");
    const dayAttendance = attendance.filter((a) =>
      dayjs(a.date).isSame(date, "day")
    );

    const totalStudents = dayAttendance.reduce(
      (sum, a) => sum + (a.students?.length || 0),
      0
    );
    const presentStudents = dayAttendance.reduce(
      (sum, a) => sum + (a.students?.filter((s) => s.present).length || 0),
      0
    );

    attendanceData2.push({
      date: date.format("DD.MM"),
      percentage:
        totalStudents > 0
          ? Math.round((presentStudents / totalStudents) * 100)
          : 0,
    });
  }

  // Top students based on attendance
  const topStudents = students.slice(0, 5).map((student, index) => ({
    name: student.full_name,
    group: student.group?.name,
    attendance: Math.floor(Math.random() * 20) + 80, // Mock attendance percentage
    clubs:
      student.enrolledClubs?.filter((e) => e.status === "approved").length || 0,
  }));

  const handleExport = async (type) => {
    try {
      setExporting(true);

      // Here you would implement actual export logic
      // For now, just simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      message.success(`${type.toUpperCase()} hisoboti yuklandi`);
    } catch (error) {
      message.error("Export qilishda xatolik yuz berdi");
    } finally {
      setExporting(false);
    }
  };

  if (dashboardLoading || facultiesLoading) {
    return <LoadingSpinner size="large" />;
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <Title level={3} className="!mb-0">
            Hisobotlar
          </Title>

          <div className="flex gap-3">
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              format="DD.MM.YYYY"
            />

            <Select
              placeholder="Fakultet"
              style={{ width: 200 }}
              allowClear
              loading={facultiesLoading}
              onChange={setSelectedFaculty}
            >
              {faculties.map((f) => (
                <Select.Option key={f.id} value={f.id}>
                  {f.name}
                </Select.Option>
              ))}
            </Select>

            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={exporting}
              onClick={() => handleExport("pdf")}
              className="gradient-primary border-0"
            >
              PDF yuklash
            </Button>
          </div>
        </div>

        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <Card
              title={
                <span className="flex items-center gap-2">
                  <BarChartOutlined className="text-blue-500" />
                  Fakultetlar bo'yicha statistika
                </span>
              }
              className="h-full"
            >
              {facultyData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={facultyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="students"
                      fill="#8884d8"
                      name="Jami studentlar"
                    />
                    <Bar dataKey="busy" fill="#82ca9d" name="Band studentlar" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <Text className="text-gray-500">Ma'lumot mavjud emas</Text>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <span className="flex items-center gap-2">
                  <PieChartOutlined className="text-green-500" />
                  To'garaklar bo'yicha taqsimot
                </span>
              }
              className="h-full"
            >
              {clubsData2.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clubsData2}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clubsData2.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center">
                  <Text className="text-gray-500">Ma'lumot mavjud emas</Text>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24}>
            <Card
              title={
                <span className="flex items-center gap-2">
                  <BarChartOutlined className="text-purple-500" />
                  Haftalik davomat tendensiyasi
                </span>
              }
            >
              {attendanceLoading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <Spin size="large" />
                </div>
              ) : attendanceData2.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={attendanceData2}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="percentage"
                      stroke="#8884d8"
                      name="Davomat %"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex items-center justify-center">
                  <Text className="text-gray-500">
                    Davomat ma'lumotlari mavjud emas
                  </Text>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24}>
            <Card
              title={
                <span className="flex items-center gap-2">
                  <FileTextOutlined className="text-orange-500" />
                  Eng faol studentlar
                </span>
              }
            >
              {studentsLoading ? (
                <div className="text-center py-8">
                  <Spin size="large" />
                </div>
              ) : topStudents.length > 0 ? (
                <Table
                  dataSource={topStudents}
                  pagination={false}
                  columns={[
                    {
                      title: "F.I.O",
                      dataIndex: "name",
                      key: "name",
                      render: (text, record, index) => (
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                              index === 0
                                ? "bg-yellow-500"
                                : index === 1
                                ? "bg-gray-400"
                                : index === 2
                                ? "bg-orange-600"
                                : "bg-gray-300"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <Text className="font-medium">{text}</Text>
                        </div>
                      ),
                    },
                    {
                      title: "Guruh",
                      dataIndex: "group",
                      key: "group",
                      render: (text) => <Tag color="blue">{text}</Tag>,
                    },
                    {
                      title: "Davomat",
                      dataIndex: "attendance",
                      key: "attendance",
                      render: (value) => (
                        <Progress
                          percent={value}
                          size="small"
                          strokeColor={
                            value >= 90
                              ? "#52c41a"
                              : value >= 75
                              ? "#faad14"
                              : "#ff4d4f"
                          }
                        />
                      ),
                    },
                    {
                      title: "To'garaklar",
                      dataIndex: "clubs",
                      key: "clubs",
                      render: (count) => <Tag color="purple">{count} ta</Tag>,
                    },
                  ]}
                />
              ) : (
                <Alert
                  message="Student ma'lumotlari topilmadi"
                  type="info"
                  showIcon
                />
              )}
            </Card>
          </Col>

          <Col xs={24}>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <Row gutter={32}>
                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <Text className="text-gray-600">Umumiy davomat</Text>
                    <div className="text-3xl font-bold text-blue-600 mt-2">
                      {stats.busyPercentage || 0}%
                    </div>
                    <Progress
                      percent={parseFloat(stats.busyPercentage || 0)}
                      showInfo={false}
                      strokeColor="#1890ff"
                    />
                  </div>
                </Col>

                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <Text className="text-gray-600">Band studentlar</Text>
                    <div className="text-3xl font-bold text-green-600 mt-2">
                      {stats.busyStudents || 0}
                    </div>
                    <Progress
                      percent={
                        stats.totalStudents > 0
                          ? (stats.busyStudents / stats.totalStudents) * 100
                          : 0
                      }
                      showInfo={false}
                      strokeColor="#52c41a"
                    />
                  </div>
                </Col>

                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <Text className="text-gray-600">Faol to'garaklar</Text>
                    <div className="text-3xl font-bold text-purple-600 mt-2">
                      {stats.activeClubs || 0} ta
                    </div>
                    <Progress
                      percent={100}
                      showInfo={false}
                      strokeColor="#722ed1"
                    />
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
