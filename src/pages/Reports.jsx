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
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function Reports() {
  const [dateRange, setDateRange] = useState([
    dayjs().startOf("month"),
    dayjs(),
  ]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Mock data
  const facultyData = [
    { name: "Matematika", students: 450, clubs: 12, busy: 380 },
    { name: "Fizika", students: 320, clubs: 8, busy: 250 },
    { name: "Informatika", students: 380, clubs: 15, busy: 350 },
    { name: "Tarix", students: 280, clubs: 6, busy: 180 },
  ];

  const attendanceData = [
    { date: "01.12", percentage: 85 },
    { date: "02.12", percentage: 92 },
    { date: "03.12", percentage: 78 },
    { date: "04.12", percentage: 88 },
    { date: "05.12", percentage: 90 },
    { date: "06.12", percentage: 83 },
    { date: "07.12", percentage: 87 },
  ];

  const clubsData = [
    { name: "Web dasturlash", value: 45 },
    { name: "Robototexnika", value: 38 },
    { name: "Chess club", value: 32 },
    { name: "English speaking", value: 56 },
    { name: "Sport", value: 42 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  const topStudents = [
    { name: "Aliyev Jasur", group: "101-guruh", attendance: 98, clubs: 3 },
    { name: "Karimova Dilnoza", group: "102-guruh", attendance: 96, clubs: 2 },
    { name: "Rashidov Azizbek", group: "201-guruh", attendance: 95, clubs: 2 },
    { name: "Umarova Gulnora", group: "301-guruh", attendance: 94, clubs: 3 },
    { name: "Saidov Bekzod", group: "202-guruh", attendance: 93, clubs: 1 },
  ];

  const handleExport = (type) => {
    // Export logic here
    console.log(`Exporting ${type} report...`);
  };

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
              onChange={setSelectedFaculty}
            >
              {facultyData.map((f) => (
                <Select.Option key={f.name} value={f.name}>
                  {f.name}
                </Select.Option>
              ))}
            </Select>

            <Button
              type="primary"
              icon={<DownloadOutlined />}
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
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={clubsData}
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
                    {clubsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={attendanceData}>
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
            </Card>
          </Col>

          <Col xs={24}>
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
              <Row gutter={32}>
                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <Text className="text-gray-600">Umumiy davomat</Text>
                    <div className="text-3xl font-bold text-blue-600 mt-2">
                      87.5%
                    </div>
                    <Progress
                      percent={87.5}
                      showInfo={false}
                      strokeColor="#1890ff"
                    />
                  </div>
                </Col>

                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <Text className="text-gray-600">Band studentlar</Text>
                    <div className="text-3xl font-bold text-green-600 mt-2">
                      78.3%
                    </div>
                    <Progress
                      percent={78.3}
                      showInfo={false}
                      strokeColor="#52c41a"
                    />
                  </div>
                </Col>

                <Col xs={24} sm={8}>
                  <div className="text-center">
                    <Text className="text-gray-600">Faol to'garaklar</Text>
                    <div className="text-3xl font-bold text-purple-600 mt-2">
                      41 ta
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
