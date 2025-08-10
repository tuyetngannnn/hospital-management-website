import express from "express"
import { createPatientRecord, getPatientRecordsByPatientId, doctorGetPatientRecordsByPatientId, getDetailPatientRecordsByPatientId} from "../controller/patientRecordController.js"
import { isDoctorAuthenticated, isPatientAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/createpatientrecord", isDoctorAuthenticated, createPatientRecord)
router.get("/getpatientrecord", isPatientAuthenticated, getPatientRecordsByPatientId);
router.get("/getdetailpatientrecord/:id",getDetailPatientRecordsByPatientId);
router.get("/doctorgetpatientrecord", isDoctorAuthenticated, doctorGetPatientRecordsByPatientId);
export default router