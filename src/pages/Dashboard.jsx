import { useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Progress,
  Typography,
  Button,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  WarningOutlined,
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useGetDashboardQuery } from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";
import React from "react";

const { Title, Text } = Typography;

export default function Dashboard() {
  const { data, isLoading, error, refetch } = useGetDashboardQuery();

  // Auto-refetch every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  if (isLoading) return <LoadingSpinner size="large" />;

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-2">
          Ma'lumotlarni yuklashda xatolik
        </div>
        <Text className="text-gray-500">
          {error.message || "Server bilan aloqa yo'q"}
        </Text>
        <Button
          type="primary"
          icon={<ReloadOutlined />}
          onClick={refetch}
          className="mt-4"
        >
          Qayta yuklash
        </Button>
      </div>
    );
  }

  const stats = data?.data || {};

  // Debug log
  if (stats.debug) {
    console.log("Dashboard stats debug:", stats.debug);
  }

  const StatCard = ({ title, value, icon, color, suffix, prefix }) => (
    <Card className="card-hover border-0 shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-gray-500 text-sm">{title}</Text>
          <div className="mt-2">
            <Statistic
              value={value}
              suffix={suffix}
              prefix={prefix}
              valueStyle={{ fontSize: "28px", fontWeight: 600, color }}
            />
          </div>
        </div>
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center`}
          style={{ backgroundColor: `${color}20` }}
        >
          {React.cloneElement(icon, { style: { fontSize: "24px", color } })}
        </div>
      </div>
    </Card>
  );

  // Get values with proper defaults
  const totalStudents = stats.totalStudents || 0;
  const busyStudents = stats.busyStudents || 0;
  const notBusyStudents = stats.notBusyStudents || 0;
  const enrolledStudents = stats.enrolledStudents || 0;
  const externalCourseStudents = stats.externalCourseStudents || 0;

  // Calculate percentages correctly
  const busyPercentage =
    totalStudents > 0 ? ((busyStudents / totalStudents) * 100).toFixed(2) : 0;

  const notBusyPercentage =
    totalStudents > 0
      ? ((notBusyStudents / totalStudents) * 100).toFixed(2)
      : 0;

  const enrolledPercentage =
    totalStudents > 0
      ? ((enrolledStudents / totalStudents) * 100).toFixed(2)
      : 0;

  const externalPercentage =
    totalStudents > 0
      ? ((externalCourseStudents / totalStudents) * 100).toFixed(2)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!mb-0">
          Dashboard
        </Title>
        <div className="flex items-center gap-3">
          <Text className="text-gray-500">
            Oxirgi yangilanish: {new Date().toLocaleString("uz")}
          </Text>
          <Button
            type="text"
            icon={<ReloadOutlined />}
            onClick={refetch}
            loading={isLoading}
          >
            Yangilash
          </Button>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Jami studentlar"
            value={totalStudents}
            icon={<TeamOutlined />}
            color="#1890ff"
            suffix="ta"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="To'garaklar"
            value={stats.activeClubs || 0}
            icon={<BookOutlined />}
            color="#52c41a"
            suffix="ta"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Fakultet adminlar"
            value={stats.totalFacultyAdmins || 0}
            icon={<UserOutlined />}
            color="#722ed1"
            suffix="ta"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Tutorlar"
            value={stats.totalTutors || 0}
            icon={<UserOutlined />}
            color="#fa8c16"
            suffix="ta"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={24}>
          <Card
            title={
              <div className="flex items-center gap-2">
                <span>Studentlar bandligi</span>
                <Tooltip title="Band studentlar = to'garakdagilar + tashqi kursdagilar (takrorlanmasdan)">
                  <InfoCircleOutlined className="text-gray-400 text-sm" />
                </Tooltip>
              </div>
            }
            className="shadow-md border-0"
            extra={
              <div className="text-sm text-gray-500">
                Jami: {totalStudents} student
              </div>
            }
          >
            <Row gutter={[32, 16]}>
              <Col span={8}>
                <div className="text-center">
                  <Progress
                    type="circle"
                    percent={busyPercentage}
                    strokeColor="#52c41a"
                    format={(percent) => `${percent}%`}
                  />
                  <div className="mt-3">
                    <Text strong>Band studentlar</Text>
                    <div className="text-2xl font-bold text-green-600">
                      {busyStudents}
                    </div>
                    <Tooltip
                      title={`To'garakda: ${enrolledStudents}, Tashqi kursda: ${externalCourseStudents}`}
                    >
                      <Text className="text-xs text-gray-500 cursor-help">
                        Kamida bitta faoliyatda
                      </Text>
                    </Tooltip>
                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div className="text-center">
                  <Progress
                    type="circle"
                    percent={notBusyPercentage}
                    strokeColor="#ff4d4f"
                    format={(percent) => `${percent}%`}
                  />
                  <div className="mt-3">
                    <Text strong>Band bo'lmagan</Text>
                    <div className="text-2xl font-bold text-red-600">
                      {notBusyStudents}
                    </div>
                    <Text className="text-xs text-gray-500">
                      Faoliyatga jalb qilish kerak
                    </Text>
                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>To'garaklarda</Text>
                      <Text strong>{enrolledStudents}</Text>
                    </div>
                    <Progress
                      percent={enrolledPercentage}
                      showInfo={false}
                      strokeColor="#1890ff"
                      size="small"
                    />
                    <Text className="text-xs text-gray-500 block mt-1">
                      {enrolledPercentage}% studentlar
                    </Text>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>Tashqi kurslarda</Text>
                      <Text strong>{externalCourseStudents}</Text>
                    </div>
                    <Progress
                      percent={externalPercentage}
                      showInfo={false}
                      strokeColor="#722ed1"
                      size="small"
                    />
                    <Text className="text-xs text-gray-500 block mt-1">
                      {externalPercentage}% studentlar
                    </Text>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <Text strong>Umumiy bandlik</Text>
                      <span className="text-xl font-bold text-blue-600">
                        {busyPercentage}%
                      </span>
                    </div>
                    <Text className="text-xs text-gray-500 mt-1">
                      {busyStudents} / {totalStudents} student
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Debug info - faqat development uchun */}
            {process.env.NODE_ENV === "development" && stats.debug && (
              <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
                <Text className="text-gray-500">
                  Debug: Enrolled: {stats.debug.enrolledOnly}, External:{" "}
                  {stats.debug.externalOnly}, Both:{" "}
                  {stats.debug.bothClubAndExternal}, Busy:{" "}
                  {stats.debug.calculatedBusy}, Not Busy:{" "}
                  {stats.debug.calculatedNotBusy}
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card
            title="Tezkor harakatlar"
            className="shadow-md border-0"
            bodyStyle={{ padding: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
              <button
                className="p-6 hover:bg-gray-50 transition-colors text-left"
                onClick={() => window.open("/faculty-admins", "_self")}
              >
                <UserOutlined className="text-2xl text-blue-500 mb-3" />
                <div className="font-medium">Fakultet admin qo'shish</div>
                <Text className="text-gray-500">
                  Yangi fakultet administratori
                </Text>
              </button>

              <button
                className="p-6 hover:bg-gray-50 transition-colors text-left"
                onClick={() => window.open("/clubs", "_self")}
              >
                <BookOutlined className="text-2xl text-green-500 mb-3" />
                <div className="font-medium">To'garaklar ro'yxati</div>
                <Text className="text-gray-500">
                  Barcha to'garaklarni ko'rish
                </Text>
              </button>

              <button
                className="p-6 hover:bg-gray-50 transition-colors text-left relative"
                onClick={() => window.open("/students?busy=false", "_self")}
              >
                {notBusyStudents > 0 && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {notBusyStudents}
                    </div>
                  </div>
                )}
                <WarningOutlined className="text-2xl text-orange-500 mb-3" />
                <div className="font-medium">Band bo'lmaganlar</div>
                <Text className="text-gray-500">Faol bo'lmagan studentlar</Text>
              </button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
