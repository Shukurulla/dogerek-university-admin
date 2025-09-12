import { Row, Col, Card, Statistic, Progress, Typography } from "antd";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  GlobalOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Line, Bar, Pie } from "recharts";
import { useGetDashboardQuery } from "../store/api/adminApi";
import LoadingSpinner from "../components/LoadingSpinner";
import React from "react";

const { Title, Text } = Typography;

export default function Dashboard() {
  const { data, isLoading, error } = useGetDashboardQuery();

  if (isLoading) return <LoadingSpinner size="large" />;
  if (error)
    return (
      <div className="text-center py-12 text-red-500">Xatolik yuz berdi</div>
    );

  const stats = data?.data || {};

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={2} className="!mb-0">
          Dashboard
        </Title>
        <Text className="text-gray-500">
          Oxirgi yangilanish: {new Date().toLocaleString("uz")}
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Jami studentlar"
            value={stats.totalStudents || 0}
            icon={<TeamOutlined />}
            color="#1890ff"
            suffix="ta"
          />
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <StatCard
            title="Faol to'garaklar"
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
        <Col xs={24} lg={16}>
          <Card title="Studentlar bandligi" className="shadow-md border-0">
            <Row gutter={[32, 16]}>
              <Col span={8}>
                <div className="text-center">
                  <Progress
                    type="circle"
                    percent={parseFloat(stats.busyPercentage || 0)}
                    strokeColor="#52c41a"
                    format={(percent) => `${percent}%`}
                  />
                  <div className="mt-3">
                    <Text strong>Band studentlar</Text>
                    <div className="text-2xl font-bold text-green-600">
                      {stats.enrolledStudents + stats.externalCourseStudents ||
                        0}
                    </div>
                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div className="text-center">
                  <Progress
                    type="circle"
                    percent={100 - parseFloat(stats.busyPercentage || 0)}
                    strokeColor="#ff4d4f"
                    format={(percent) => `${percent.toFixed(1)}%`}
                  />
                  <div className="mt-3">
                    <Text strong>Band bo'lmagan</Text>
                    <div className="text-2xl font-bold text-red-600">
                      {stats.notBusyStudents || 0}
                    </div>
                  </div>
                </div>
              </Col>

              <Col span={8}>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>To'garaklarda</Text>
                      <Text strong>{stats.enrolledStudents || 0}</Text>
                    </div>
                    <Progress
                      percent={70}
                      showInfo={false}
                      strokeColor="#1890ff"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Text>Tashqi kurslarda</Text>
                      <Text strong>{stats.externalCourseStudents || 0}</Text>
                    </div>
                    <Progress
                      percent={30}
                      showInfo={false}
                      strokeColor="#722ed1"
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Bugungi faollik" className="shadow-md border-0 h-full">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircleOutlined className="text-2xl text-blue-500" />
                  <div>
                    <Text className="block">Bugungi darslar</Text>
                    <Text strong className="text-xl">
                      {stats.todayAttendance || 0}
                    </Text>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <GlobalOutlined className="text-2xl text-green-500" />
                  <div>
                    <Text className="block">Faol to'garaklar</Text>
                    <Text strong className="text-xl">
                      {stats.activeClubs || 0}
                    </Text>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ClockCircleOutlined className="text-2xl text-orange-500" />
                  <div>
                    <Text className="block">Kutilayotgan</Text>
                    <Text strong className="text-xl">
                      12
                    </Text>
                  </div>
                </div>
              </div>
            </div>
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
              <button className="p-6 hover:bg-gray-50 transition-colors text-left">
                <UserOutlined className="text-2xl text-blue-500 mb-3" />
                <div className="font-medium">Fakultet admin qo'shish</div>
                <Text className="text-gray-500">
                  Yangi fakultet administratori
                </Text>
              </button>

              <button className="p-6 hover:bg-gray-50 transition-colors text-left">
                <BookOutlined className="text-2xl text-green-500 mb-3" />
                <div className="font-medium">To'garaklar ro'yxati</div>
                <Text className="text-gray-500">
                  Barcha to'garaklarni ko'rish
                </Text>
              </button>

              <button className="p-6 hover:bg-gray-50 transition-colors text-left">
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
