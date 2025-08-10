import express from "express";
import { adminPostAppointment, filterAppointments, getAppointmentHistory, getAppointmentById, getDetailAppointmentById, deleteAppointment, getAppointmentDetails, getAllAppointments,DoctorgetAcceptedAppointments, postAppointment, updateAppointmentStatus, countAppointments, DoctorgetPendingAppointments, DoctorupdateAppointmentStatus, getBookedTime } from "../controller/appointmentController.js";
import { isAdminAuthenticated,isPatientAuthenticated, isDoctorAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/post",isPatientAuthenticated, postAppointment);
router.get("/getall", isAdminAuthenticated, getAllAppointments);
router.get("/patient/getall", isPatientAuthenticated, getAppointmentById);
router.get("/patient/getdetail/:id", isPatientAuthenticated, getDetailAppointmentById);
router.get("/getpendingappointments", isDoctorAuthenticated, DoctorgetPendingAppointments);
router.get("/getacceptedappointments", isDoctorAuthenticated, DoctorgetAcceptedAppointments);
router.get("/getappointment/:id", isDoctorAuthenticated, getAppointmentDetails);
router.put("/update/:id",isAdminAuthenticated, updateAppointmentStatus);
router.put("/doctorupdate/:id", isDoctorAuthenticated, DoctorupdateAppointmentStatus);
router.delete("/delete/:id",isAdminAuthenticated, deleteAppointment);
router.get("/count", countAppointments);
router.get("/getbookedtime", getBookedTime);
router.post("/appointments/addnew",isAdminAuthenticated,adminPostAppointment);
router.get("/getall",isAdminAuthenticated, getAllAppointments);
router.get("/filter",filterAppointments);
router.get("/historyappointments/:userId",getAppointmentHistory);
export default router;