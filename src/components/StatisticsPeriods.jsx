// src/components/StatisticsPeriods.jsx - Vaqt davrlari bo'yicha statistika
import { useState, useEffect } from "react";
import {
  Card,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Typography,
  Progress,
  Tag,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  useGetStatisticsByPeriodQuery,
  useGetAttendanceTrendsQuery,
  useGetTopPerformersQuery,
} from "../store/api/statisticsApi";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// Predefined periods
const PERIODS = [
  {
    key: "today",
    label: "Bugungi kun",
    startDate: () => dayjs().startOf("day"),
    endDate: () => dayjs().endOf("day"),
  },
  {
    key: "week",
    label: "Bu hafta",
    startDate: () => dayjs().startOf("week"),
    endDate: () => dayjs().endOf("week"),
  },
  {
    key: "month",
    label: "Bu oy",
    startDate: () => dayjs().startOf("month"),
    endDate: () => dayjs().endOf("month"),
  },
  {
    key: "3months",
    label: "3 oy",
    startDate: () => dayjs().subtract(3, "months").startOf("month"),
    endDate: () => dayjs().endOf("month"),
  },
  {
    key: "6months",
    label: "6 oy",
    startDate: () => dayjs().subtract(6, "months").startOf("month"),
    endDate: () => dayjs().endOf("month"),
  },
  {
    key: "year",
    label: "1 yil",
    startDate: () => dayjs().subtract(1, "year").startOf("year"),
    endDate: () => dayjs().endOf("month"),
  },
  {
    key: "all",
    label: "Barcha vaqt",
    startDate: () => null,
    endDate: () => null,
  },
  {
    key: "custom",
    label: "Boshqa davr",
    startDate: null,
    endDate: null,
  },
];

export default function StatisticsPeriods({ userRole = "faculty_admin" }) {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [customDates, setCustomDates] = useState([null, null]);

  // Get period dates
  const getPeriodDates = () => {
    const period = PERIODS.find((p) => p.key === selectedPeriod);
    if (selectedPeriod === "custom") {
      return {
        startDate: customDates[0]?.format("YYYY-MM-DD") || null,
        endDate: customDates[1]?.format("YYYY-MM-DD") || null,
      };
    }
    return {
      startDate: period?.startDate?.()?.format("YYYY-MM-DD") || null,
      endDate: period?.endDate?.()?.format("YYYY-MM-DD") || null,
    };
  };

  const { startDate, endDate } = getPeriodDates();

  // API queries
  const { data: statsData, isLoading: statsLoading } =
    useGetStatisticsByPeriodQuery({
      startDate,
      endDate,
      scope: userRole === "university_admin" ? "university" : "faculty",
    });

  const { data: trendsData, isLoading: trendsLoading } =
    useGetAttendanceTrendsQuery({
      startDate,
      endDate,
      scope: userRole === "university_admin" ? "university" : "faculty",
    });

  const { data: topPerformersData, isLoading: topLoading } =
    useGetTopPerformersQuery({
      startDate,
      endDate,
      scope: userRole === "university_admin" ? "university" : "faculty",
      limit: 5,
    });

  const stats = statsData?.data || {};
  const trends = trendsData?.data || [];
  const topPerformers = topPerformersData?.data || [];

  const isLoading = statsLoading || trendsLoading || topLoading;

  // Chart colors
  const COLORS = ["#52c41a", "#1890ff", "#722ed1", "#fa8c16", "#eb2f96"];

  // Pie chart data for student distribution
  const studentDistribution = [
    { name: "Band", value: stats.busyStudents || 0, color: "#52c41a" },
    { name: "Band emas", value: stats.notBusyStudents || 0, color: "#ff4d4f" },
  ];

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <Card className="border-0 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="!mb-0">
            Statistika davri
          </Title>

          <div className="flex gap-3 items-center">
            <Select
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              style={{ width: 200 }}
              size="large"
            >
              {PERIODS.map((period) => (
                <Select.Option key={period.key} value={period.key}>
                  {period.label}
                </Select.Option>
              ))}
            </Select>

            {selectedPeriod === "custom" && (
              <RangePicker
                value={customDates}
                onChange={setCustomDates}
                format="DD.MM.YYYY"
                placeholder={["Boshlanish", "Tugash"]}
                size="large"
              />
            )}
          </div>
        </div>

        {/* Period Info */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CalendarOutlined className="text-blue-500" />
            <Text className="font-medium">
              Tanlangan davr:{" "}
              {PERIODS.find((p) => p.key === selectedPeriod)?.label}
            </Text>
          </div>
          {startDate && endDate && (
            <Text className="text-gray-600 text-sm block mt-1">
              {dayjs(startDate).format("DD.MM.YYYY")} -{" "}
              {dayjs(endDate).format("DD.MM.YYYY")}
            </Text>
          )}
        </div>
      </Card>

      {isLoading ? (
        <Card className="text-center py-12">
          <Spin size="large" />
          <Text className="block mt-4 text-gray-500">
            Ma'lumotlar yuklanmoqda...
          </Text>
        </Card>
      ) : (
        <>
          {/* Main Statistics */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card className="border border-blue-200 bg-blue-50">
                <Statistic
                  title="Jami studentlar"
                  value={stats.totalStudents || 0}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: "#1890ff" }}
                />
                <Text className="text-xs text-blue-500">
                  {stats.studentGrowth > 0
                    ? `+${stats.studentGrowth}`
                    : stats.studentGrowth}{" "}
                  oldingi davrdan
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="border border-green-200 bg-green-50">
                <Statistic
                  title="Band studentlar"
                  value={stats.busyStudents || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: "#52c41a" }}
                />
                <Progress
                  percent={
                    stats.totalStudents > 0
                      ? Math.round(
                          (stats.busyStudents / stats.totalStudents) * 100
                        )
                      : 0
                  }
                  showInfo={false}
                  strokeColor="#52c41a"
                  className="mt-2"
                />
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="border border-purple-200 bg-purple-50">
                <Statistic
                  title="To'garaklar"
                  value={stats.totalClubs || 0}
                  prefix={<BookOutlined />}
                  valueStyle={{ color: "#722ed1" }}
                />
                <Text className="text-xs text-purple-500">
                  {stats.activeClubs || 0} faol to'garak
                </Text>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card className="border border-orange-200 bg-orange-50">
                <Statistic
                  title="O'rtacha davomat"
                  value={stats.averageAttendance || 0}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: "#fa8c16" }}
                />
                <Text className="text-xs text-orange-500">
                  {stats.totalSessions || 0} mashg'ulot
                </Text>
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row gutter={[16, 16]}>
            {/* Attendance Trends */}
            <Col xs={24} lg={16}>
              <Card title="Davomat tendensiyasi" className="h-full">
                {trends.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => dayjs(date).format("DD.MM")}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(date) =>
                          dayjs(date).format("DD.MM.YYYY")
                        }
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="attendanceRate"
                        stroke="#52c41a"
                        strokeWidth={2}
                        dot={{ fill: "#52c41a" }}
                        name="Davomat %"
                      />
                      <Line
                        type="monotone"
                        dataKey="totalSessions"
                        stroke="#1890ff"
                        strokeWidth={2}
                        dot={{ fill: "#1890ff" }}
                        name="Mashg'ulotlar"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Ma'lumot mavjud emas
                  </div>
                )}
              </Card>
            </Col>

            {/* Student Distribution */}
            <Col xs={24} lg={8}>
              <Card title="Studentlar taqsimoti" className="h-full">
                {studentDistribution.some((d) => d.value > 0) ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={studentDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {studentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500">
                    Ma'lumot mavjud emas
                  </div>
                )}
              </Card>
            </Col>
          </Row>

          {/* Top Performers */}
          {topPerformers.length > 0 && (
            <Card title="Eng faol ishtirokchilar">
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Title level={5}>Top studentlar</Title>
                  <div className="space-y-2">
                    {topPerformers.students
                      ?.slice(0, 5)
                      .map((student, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="flex items-center gap-2">
                            <Tag
                              color={
                                index === 0
                                  ? "gold"
                                  : index === 1
                                  ? "silver"
                                  : "default"
                              }
                            >
                              {index + 1}
                            </Tag>
                            <Text className="font-medium">{student.name}</Text>
                          </div>
                          <Tag color="green">{student.attendanceRate}%</Tag>
                        </div>
                      ))}
                  </div>
                </Col>

                <Col xs={24} md={12}>
                  <Title level={5}>Top to'garaklar</Title>
                  <div className="space-y-2">
                    {topPerformers.clubs?.slice(0, 5).map((club, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-2">
                          <Tag
                            color={
                              index === 0
                                ? "gold"
                                : index === 1
                                ? "silver"
                                : "default"
                            }
                          >
                            {index + 1}
                          </Tag>
                          <Text className="font-medium">{club.name}</Text>
                        </div>
                        <div className="flex gap-2">
                          <Tag color="blue">{club.studentCount} student</Tag>
                          <Tag color="green">{club.attendanceRate}%</Tag>
                        </div>
                      </div>
                    ))}
                  </div>
                </Col>
              </Row>
            </Card>
          )}

          {/* Additional Metrics */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={8}>
              <Card className="bg-gradient-to-r from-blue-50 to-cyan-50">
                <div className="text-center">
                  <ClockCircleOutlined className="text-4xl text-blue-500 mb-3" />
                  <Title level={4} className="!mb-1">
                    {stats.totalSessions || 0}
                  </Title>
                  <Text className="text-gray-600">Jami mashg'ulotlar</Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
                <div className="text-center">
                  <CheckCircleOutlined className="text-4xl text-green-500 mb-3" />
                  <Title level={4} className="!mb-1">
                    {stats.totalPresent || 0}
                  </Title>
                  <Text className="text-gray-600">Jami qatnashganlar</Text>
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={8}>
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="text-center">
                  <TrophyOutlined className="text-4xl text-purple-500 mb-3" />
                  <Title level={4} className="!mb-1">
                    {Math.round(stats.averageAttendance || 0)}%
                  </Title>
                  <Text className="text-gray-600">O'rtacha samaradorlik</Text>
                </div>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
