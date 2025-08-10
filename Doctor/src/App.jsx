// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/login/Login.jsx";
import Home from './pages/home/Home.jsx'; 
import AcceptedAppointment from "./pages/acceptedappointment/AcceptedAppointment.jsx";
import DetailAcceptedAppointment from "./pages/detailacceptedappointment/DetailAcceptedAppointment.jsx";
import CreatePatientRecord from "./pages/createpatientrecord/CreatePatientRecord.jsx";
import AppointmentDetails from "./pages/appointmentdetail/AppointmentDetail.jsx";
import CompletedFollowUp from "././pages/completedpatientrecord/CompletedPatientRecord.jsx";
import CreateFollowUpAppointment from "./pages/createfollowupappointment/CreateFollowUpAppointment.jsx";
import FollowUpAppointments from "./pages/followupappointments/FollowUpAppointments.jsx";
import DetailFollowUpAppointment from "./pages/detailfollowupappointment/DetailFollowUpAppointment.jsx";
  // import Sidebar from "./components/Sidebar.jsx"; // Import Sidebar
import { Context } from "./main";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function App() {
  const { isAuthenticated, setIsAuthenticated, setDoctor } =
    useContext(Context);
  // Fetch thông tin user khi ứng dụng khởi động
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/user/doctor/me",
          { withCredentials: true }
        );
        setIsAuthenticated(true);
        setDoctor(response.data.user);
      } catch (error) {
        toast.error("Bác sĩ chưa đăng nhập", error);
      }
    };
    fetchUser();
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="app-container-doctor">
        {isAuthenticated} {/* Render Sidebar khi đăng nhập */}
        <div className="content-doctor">
          <Routes>

            <Route path="/login" element={<Login />} />

            <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />

            <Route path="/accepted-appointments" element={<AcceptedAppointment />}/>

            <Route path="/appointmentdetail/:id" element={<AppointmentDetails />} />

            <Route path="/acceptedappointmentdetails/:id" element={<DetailAcceptedAppointment />}/>

            <Route path="/create-patient-record/:appointmentId" element={<CreatePatientRecord />}/>    
            <Route
              path="/doctor/getcompletedpatientrecord" element={<CompletedFollowUp />}
            />
            <Route path="/doctor/getfollowupappointment" element={<FollowUpAppointments />} />

            <Route path="/doctor/detailfollowupappointment/:followUpAppointmentId" element={<DetailFollowUpAppointment />} />

            <Route path="/doctor/createpatientrecord/:followUpAppointmentId"  element={<CreateFollowUpAppointment />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
