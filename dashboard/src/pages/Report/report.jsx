import { useState, useEffect } from "react";
import {
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Sidebar from '../../components/Sidebar/Sidebar.jsx'
import './report.css'

const Stats = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [doctorStats, setDoctorStats] = useState([]);
  const [DTDATA, setDTDATA] = useState([]);
  const [serviceData, setServiceData] = useState([]);
  const [isBarChart, setIsBarChart] = useState(true); // State để chuyển đổi giữa LineChart và BarChart
  const [activeTab, setActiveTab] = useState('doctor'); // New state for switching tabs

  // Hàm gọi API để lấy dữ liệu thống kê
  const fetchStats = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/v1/report/report/${month}/${year}`
      );
      const data = await response.json();
      setDoctorStats(data.doctorStats);
      setServiceData(data.serviceData);
      setDTDATA(data.dailyRevenueArray);
      // setEquipmentData(data.totalRevenue);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Sử dụng useEffect để tự động gọi API mỗi khi thay đổi các giá trị
  useEffect(() => {
    if (month && year) {
      fetchStats(); // Gọi API khi các giá trị thay đổi
    }
  }, [month, year]);

  const sortedDoctorStats = [...doctorStats].sort(
    (a, b) => b.visitCount - a.visitCount
  );
  const totalDoctorStats = sortedDoctorStats.reduce(
    (total, item) => total + item.visitCount,
    0
  );

  //Sắp xếp thiết bị sử dụng từ cao xuống thấp và tính tổng số lượng
  const sortedDTData = [...DTDATA].sort((a, b) => b.revenue - a.revenue);
  const totalDT = sortedDTData.reduce((total, item) => total + item.revenue, 0);

  const sortedServiceData = [...serviceData].sort((a, b) => b.count - a.count);
  const totalServiceCount = sortedServiceData.reduce(
    (total, item) => total + item.count,
    0
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'doctor':
        return (
          <>
            <h2 className='h2-content lato-bold'>Thống kê lượt khám của bác sĩ</h2>
            <div className="content-container-tk">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  {isBarChart ? (
                    <BarChart data={doctorStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="doctorName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="visitCount" fill="#73BDDF" name="Số lượng" />
                    </BarChart>
                  ) : (
                    <LineChart data={doctorStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="doctorName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="visitCount"
                        stroke="#73BDDF"
                        name="Số lượng"
                        strokeWidth={1.5}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
              <div className="table-container">
                <table className="service-table-1">
                  <caption className="table-caption lato-bold">Lượt khám của bác sĩ</caption>
                  <thead>
                    <tr className="table-header">
                      <th className="table-header-cell lato-bold">Số thứ tự</th>
                      <th className="table-header-cell lato-bold">Tên bác sĩ</th>
                      <th className="table-header-cell lato-bold">Số lượng khám</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDoctorStats.map((item, index) => (
                      <tr key={index} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">{item.doctorName}</td>
                        <td className="table-cell">{item.visitCount}</td>
                      </tr>
                    ))}
                    <tr className="table-row">
                      <td colSpan="2" className="table-cell">
                        <strong>Tổng số lượng</strong>
                      </td>
                      <td className="table-cell">
                        <strong>{totalDoctorStats}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );

      case 'dthu':
        return (
          <>
            <h2 className='h2-content lato-bold'>Thống kê doanh thu theo ngày</h2>
                <ResponsiveContainer width="100%" height={300}>
                  {isBarChart ? (
                    <BarChart data={DTDATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#7096D1" name="Doanh thu" />
                    </BarChart>
                  ) : (
                    <LineChart data={DTDATA}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#7096D1"
                        name="Doanh số"
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
                <table className="service-table-1">
                  <caption className="table-caption lato-bold">Bảng thống kê doanh thu theo ngày</caption>
                  <thead>
                    <tr className="table-header">
                      <th className="table-header-cell lato-bold">Số thứ tự</th>
                      <th className="table-header-cell lato-bold">Ngày</th>
                      <th className="table-header-cell lato-bold">Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedDTData.map((item, index) => (
                      <tr key={index} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">{item.date}</td>
                        <td className="table-cell">{item.revenue}</td>
                      </tr>
                    ))}
                    <tr className="table-row">
                      <td colSpan="2" className="table-cell">
                        <strong>Tổng số thiết bị sử dụng</strong>
                      </td>
                      <td className="table-cell">
                        <strong>{totalDT}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
          </>
        );

      case 'service':
        return (
          <>
            <h2 className='h2-content lato-bold'>Sử dụng dịch vụ</h2>
                <ResponsiveContainer width="100%" height={300}>
                  {isBarChart ? (
                    <BarChart data={serviceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="serviceName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#274C77" name="Số lượng" />
                    </BarChart>
                  ) : (
                    <LineChart data={serviceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="serviceName" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#274C77"
                        name="Số lượng"
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
                <table className="service-table-1">
                  <caption className="table-caption">Bảng thống kê dịch vụ</caption>
                  <thead>
                    <tr className="table-header">
                      <th className="table-header-cell lato-bold">Số thứ tự</th>
                      <th className="table-header-cell lato-bold">Tên dịch vụ</th>
                      <th className="table-header-cell lato-bold">Số lượng sử dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedServiceData.map((item, index) => (
                      <tr key={index} className="table-row">
                        <td className="table-cell">{index + 1}</td>
                        <td className="table-cell">{item.serviceName}</td>
                        <td className="table-cell">{item.count}</td>
                      </tr>
                    ))}
                    <tr className="table-row">
                      <td colSpan="2" className="table-cell">
                        <strong>Tổng số dịch vụ sử dụng</strong>
                      </td>
                      <td className="table-cell">
                        <strong>{totalServiceCount}</strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
          </>
        );
      default:
        return null;
    }
  }
  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="service-manager-content">
        <h1>THỐNG KÊ</h1>

        {/* Form chọn chi nhánh, ngày, tháng và năm */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="horizontal-form-tk"
        >
          <div className="form-group-tk">
            <label className="form-label-tk">
              Tháng:
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
                className="form-select-tk"
              >
                {[...Array(12).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    Tháng {i + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-group-tk">
            <label className="form-label-tk">
              Năm:
              <select
                className="form-select-tk"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="2023">2023</option>
                <option value="2024">2024</option>
                <option value="2022">2025</option>
              </select>
            </label>
          </div>
          <div className="form-group-tk">
            <button onClick={() => setIsBarChart(!isBarChart)} className="button-tk">
              {isBarChart ? "Chuyển sang biểu đồ đường" : "Chuyển sang biểu đồ cột"}
            </button>
          </div>
        </form>

        <div className="tab-nav-tk">
          <button onClick={() => setActiveTab('doctor')} className={`tab-button-tk ${activeTab === 'doctor' ? 'active' : ''}`}>Thống kê lượt khám</button>
          <button onClick={() => setActiveTab('dthu')} className={`tab-button-tk ${activeTab === 'dthu' ? 'active' : ''}`}>Thống kê doanh thu</button>
          <button onClick={() => setActiveTab('service')} className={`tab-button-tk ${activeTab === 'service' ? 'active' : ''}`}>Thống kê dịch vụ</button>
        </div>

        {/* Render content based on selected tab */}
        {renderContent()}

      </div>
    </div>
  );
};
export default Stats;
