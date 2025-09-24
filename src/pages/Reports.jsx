import { useState, useEffect } from "react";
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
  Statistic,
  Empty,
} from "antd";
import {
  DownloadOutlined,
  FileTextOutlined,
  BarChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
  CalendarOutlined,
  TeamOutlined,
  BookOutlined,
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
  useGetAttendanceReportQuery,
} from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";
import dayjs from "dayjs";
import * as XLSX from "xlsx";

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
      limit: 1000,
    });
  const { data: attendanceData, isLoading: attendanceLoading } =
    useGetAttendanceQuery({
      startDate: dateRange[0]?.format("YYYY-MM-DD"),
      endDate: dateRange[1]?.format("YYYY-MM-DD"),
      limit: 1000,
    });
  const { data: attendanceReportData, isLoading: reportLoading } =
    useGetAttendanceReportQuery({
      startDate: dateRange[0]?.format("YYYY-MM-DD"),
      endDate: dateRange[1]?.format("YYYY-MM-DD"),
      facultyId: selectedFaculty,
    });

  const stats = dashboardData?.data || {};
  const faculties = facultiesData?.data || [];
  const clubs = clubsData?.data?.clubs || [];
  const students = studentsData?.data?.students || [];
  const attendance = attendanceData?.data?.attendance || [];
  const attendanceReport = attendanceReportData?.data || {};

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  // Process data for faculty statistics chart
  const facultyData = faculties
    .map((faculty) => {
      const facultyClubs = clubs.filter((c) => c.faculty?.id === faculty.id);
      const facultyStudents = students.filter(
        (s) => s.department?.id === faculty.id
      );
      const busyStudents = facultyStudents.filter(
        (s) =>
          s.enrolledClubs?.some((e) => e.status === "approved") ||
          s.externalCourses?.length > 0
      );

      return {
        name:
          faculty.name?.length > 15
            ? faculty.name.substring(0, 15) + "..."
            : faculty.name,
        fullName: faculty.name,
        students: faculty.studentCount || facultyStudents.length,
        busy: busyStudents.length,
        clubs: facultyClubs.length,
        percentage:
          faculty.studentCount > 0
            ? Math.round((busyStudents.length / faculty.studentCount) * 100)
            : 0,
      };
    })
    .filter((f) => f.students > 0);

  // Process data for clubs pie chart
  const clubsChartData = clubs
    .filter((club) => club.currentStudents > 0)
    .sort((a, b) => b.currentStudents - a.currentStudents)
    .slice(0, 5)
    .map((club) => ({
      name:
        club.name?.length > 20 ? club.name.substring(0, 20) + "..." : club.name,
      value: club.currentStudents || 0,
      capacity: club.capacity || 0,
      faculty: club.faculty?.name,
    }));

  // Generate attendance trend data based on real data
  const attendanceTrendData = [];
  for (let i = 6; i >= 0; i--) {
    const date = dayjs().subtract(i, "day");
    const dateStr = date.format("YYYY-MM-DD");

    const dayAttendance = attendance.filter(
      (a) => dayjs(a.date).format("YYYY-MM-DD") === dateStr
    );

    const totalStudents = dayAttendance.reduce(
      (sum, a) => sum + (a.students?.length || 0),
      0
    );
    const presentStudents = dayAttendance.reduce(
      (sum, a) => sum + (a.students?.filter((s) => s.present).length || 0),
      0
    );

    attendanceTrendData.push({
      date: date.format("DD.MM"),
      sessions: dayAttendance.length,
      percentage:
        totalStudents > 0
          ? Math.round((presentStudents / totalStudents) * 100)
          : 0,
      present: presentStudents,
      total: totalStudents,
    });
  }

  // Process top students based on real attendance data
  const studentAttendanceMap = {};

  attendance.forEach((session) => {
    session.students?.forEach((record) => {
      const studentId = record.student?._id || record.student;
      if (!studentAttendanceMap[studentId]) {
        studentAttendanceMap[studentId] = {
          total: 0,
          present: 0,
        };
      }
      studentAttendanceMap[studentId].total++;
      if (record.present) {
        studentAttendanceMap[studentId].present++;
      }
    });
  });

  const topStudents = students
    .map((student) => {
      const attendanceData = studentAttendanceMap[student._id] || {
        total: 0,
        present: 0,
      };
      const attendanceRate =
        attendanceData.total > 0
          ? Math.round((attendanceData.present / attendanceData.total) * 100)
          : 0;

      return {
        id: student._id,
        name: student.full_name,
        group: student.group?.name,
        faculty: student.department?.name,
        attendance: attendanceRate,
        sessions: attendanceData.total,
        present: attendanceData.present,
        clubs:
          student.enrolledClubs?.filter((e) => e.status === "approved")
            .length || 0,
        external: student.externalCourses?.length || 0,
      };
    })
    .filter((s) => s.sessions > 0)
    .sort((a, b) => b.attendance - a.attendance)
    .slice(0, 10);

  // Export functions
  const handleExportExcel = async () => {
    try {
      setExporting(true);

      // Prepare data for export
      const exportData = {
        summary: [
          ["Hisobot sanasi", new Date().toLocaleDateString("uz")],
          [
            "Davr",
            `${dateRange[0].format("DD.MM.YYYY")} - ${dateRange[1].format(
              "DD.MM.YYYY"
            )}`,
          ],
          [""],
          ["UMUMIY STATISTIKA"],
          ["Jami studentlar", stats.totalStudents || 0],
          ["Band studentlar", stats.busyStudents || 0],
          ["Band bo'lmagan studentlar", stats.notBusyStudents || 0],
          ["Faol to'garaklar", stats.activeClubs || 0],
          ["Fakultet adminlar", stats.totalFacultyAdmins || 0],
          ["Tutorlar", stats.totalTutors || 0],
        ],
        facultyStats: facultyData.map((f) => ({
          Fakultet: f.fullName,
          "Jami studentlar": f.students,
          "Band studentlar": f.busy,
          "To'garaklar soni": f.clubs,
          "Band %": f.percentage,
        })),
        topStudents: topStudents.map((s, i) => ({
          "O'rin": i + 1,
          "F.I.O": s.name,
          Guruh: s.group,
          Fakultet: s.faculty,
          "Davomat %": s.attendance,
          "Darslar soni": s.sessions,
          Kelgan: s.present,
          "To'garaklar": s.clubs,
          "Tashqi kurslar": s.external,
        })),
        clubs: clubs.map((c) => ({
          "To'garak nomi": c.name,
          Fakultet: c.faculty?.name,
          Tutor: c.tutor?.profile?.fullName,
          "Studentlar soni": c.currentStudents,
          "Sig'im": c.capacity || "Cheklanmagan",
          "Bo'sh joylar": c.availableSlots || "Cheklanmagan",
        })),
      };

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Add summary sheet
      const ws1 = XLSX.utils.aoa_to_sheet(exportData.summary);
      XLSX.utils.book_append_sheet(wb, ws1, "Umumiy");

      // Add faculty statistics sheet
      const ws2 = XLSX.utils.json_to_sheet(exportData.fakultyStats);
      XLSX.utils.book_append_sheet(wb, ws2, "Fakultetlar");

      // Add top students sheet
      const ws3 = XLSX.utils.json_to_sheet(exportData.topStudents);
      XLSX.utils.book_append_sheet(wb, ws3, "Top studentlar");

      // Add clubs sheet
      const ws4 = XLSX.utils.json_to_sheet(exportData.clubs);
      XLSX.utils.book_append_sheet(wb, ws4, "To'garaklar");

      // Generate file
      XLSX.writeFile(wb, `Hisobot_${dayjs().format("YYYY-MM-DD")}.xlsx`);

      message.success("Hisobot muvaffaqiyatli yuklandi");
    } catch (error) {
      console.error("Export error:", error);
      message.error("Export qilishda xatolik yuz berdi");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = () => {
    message.info("PDF export funksiyasi tez orada qo'shiladi");
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
              allowClear={false}
            />

            <Select
              placeholder="Fakultet"
              style={{ width: 200 }}
              allowClear
              loading={facultiesLoading}
              onChange={setSelectedFaculty}
              value={selectedFaculty}
            >
              {faculties.map((f) => (
                <Select.Option key={f.id} value={f.id}>
                  {f.name}
                </Select.Option>
              ))}
            </Select>
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
                    <XAxis
                      dataKey="name"
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      interval={0}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded shadow-lg border">
                              <p className="font-medium">{data.fullName}</p>
                              <p className="text-sm">Jami: {data.students}</p>
                              <p className="text-sm text-green-600">
                                Band: {data.busy}
                              </p>
                              <p className="text-sm text-blue-600">
                                To'garaklar: {data.clubs}
                              </p>
                              <p className="text-sm font-medium">
                                Band: {data.percentage}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="students"
                      fill="#8884d8"
                      name="Jami studentlar"
                    />
                    <Bar dataKey="busy" fill="#82ca9d" name="Band studentlar" />
                    <Bar dataKey="clubs" fill="#ffc658" name="To'garaklar" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Ma'lumot mavjud emas" />
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card
              title={
                <span className="flex items-center gap-2">
                  <PieChartOutlined className="text-green-500" />
                  Top 5 to'garak (studentlar soni bo'yicha)
                </span>
              }
              className="h-full"
            >
              {clubsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={clubsChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {clubsChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded shadow-lg border">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm">
                                Fakultet: {data.faculty}
                              </p>
                              <p className="text-sm">
                                Studentlar: {data.value}
                              </p>
                              <p className="text-sm">
                                Sig'im: {data.capacity || "Cheklanmagan"}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="To'garak ma'lumotlari mavjud emas" />
              )}
            </Card>
          </Col>

          <Col xs={24}>
            <Card
              title={
                <span className="flex items-center gap-2">
                  <CalendarOutlined className="text-purple-500" />
                  Haftalik davomat tendensiyasi
                </span>
              }
            >
              {attendanceLoading ? (
                <div className="h-[250px] flex items-center justify-center">
                  <Spin size="large" />
                </div>
              ) : attendanceTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={attendanceTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload?.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-3 rounded shadow-lg border">
                              <p className="font-medium">{data.date}</p>
                              <p className="text-sm">
                                Darslar: {data.sessions}
                              </p>
                              <p className="text-sm">
                                Jami: {data.total} student
                              </p>
                              <p className="text-sm">
                                Kelgan: {data.present} student
                              </p>
                              <p className="text-sm font-medium">
                                Davomat: {data.percentage}%
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="percentage"
                      stroke="#8884d8"
                      name="Davomat %"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="sessions"
                      stroke="#82ca9d"
                      name="Darslar soni"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Empty description="Davomat ma'lumotlari mavjud emas" />
              )}
            </Card>
          </Col>

          <Col xs={24}>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <Title level={4} className="mb-4">
                Umumiy ko'rsatkichlar
              </Title>
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={8} md={4}>
                  <Statistic
                    title="Jami studentlar"
                    value={stats.totalStudents || 0}
                    prefix={<TeamOutlined />}
                    valueStyle={{ color: "#1890ff" }}
                  />
                </Col>
                <Col xs={24} sm={8} md={4}>
                  <Statistic
                    title="Band studentlar"
                    value={stats.busyStudents || 0}
                    suffix={
                      <span className="text-sm ml-1">
                        ({stats.busyPercentage || 0}%)
                      </span>
                    }
                    valueStyle={{ color: "#52c41a" }}
                  />
                </Col>
                <Col xs={24} sm={8} md={4}>
                  <Statistic
                    title="Band bo'lmaganlar"
                    value={stats.notBusyStudents || 0}
                    valueStyle={{ color: "#fa8c16" }}
                  />
                </Col>
                <Col xs={24} sm={8} md={4}>
                  <Statistic
                    title="Faol to'garaklar"
                    value={stats.activeClubs || 0}
                    prefix={<BookOutlined />}
                    valueStyle={{ color: "#722ed1" }}
                  />
                </Col>
                <Col xs={24} sm={8} md={4}>
                  <Statistic
                    title="Fakultetlar"
                    value={stats.facultiesCount || 0}
                    valueStyle={{ color: "#13c2c2" }}
                  />
                </Col>
                <Col xs={24} sm={8} md={4}>
                  <Statistic
                    title="Bugungi darslar"
                    value={stats.todayAttendance || 0}
                    prefix={<CalendarOutlined />}
                    valueStyle={{ color: "#eb2f96" }}
                  />
                </Col>
              </Row>

              {attendanceReport.overallStatistics && (
                <div className="mt-6 pt-6 border-t">
                  <Title level={5}>Davomat statistikasi (tanlangan davr)</Title>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={6}>
                      <Text className="text-gray-600">Jami mashg'ulotlar</Text>
                      <div className="text-2xl font-bold">
                        {attendanceReport.overallStatistics.totalSessions || 0}
                      </div>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Text className="text-gray-600">Jami qatnashganlar</Text>
                      <div className="text-2xl font-bold text-green-600">
                        {attendanceReport.overallStatistics.totalPresent || 0}
                      </div>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Text className="text-gray-600">Jami kelmaganlar</Text>
                      <div className="text-2xl font-bold text-red-600">
                        {attendanceReport.overallStatistics.totalAbsent || 0}
                      </div>
                    </Col>
                    <Col xs={24} sm={6}>
                      <Text className="text-gray-600">O'rtacha davomat</Text>
                      <div className="text-2xl font-bold text-blue-600">
                        {attendanceReport.overallStatistics
                          .averageAttendanceRate || 0}
                        %
                      </div>
                    </Col>
                  </Row>
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
