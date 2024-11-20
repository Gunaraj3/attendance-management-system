// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
import { Route, Routes } from "react-router-dom";
import HideRoute from "./components/HideRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/auth";
import AttendanceViewStudent from "./pages/Student/AttendanceViewStudent";
import BatchViewStudent from "./pages/Student/BatchViewStudent";
import SettingStudent from "./pages/Student/SettingStudent";
import StudentLayout from "./pages/Student/StudentLayout";
import StudentLogin from "./pages/Student/StudentLogin";
import BatchAttendanceTeacher from "./pages/Teacher/BatchAttendanceTeacher";
import SettingTeacher from "./pages/Teacher/SettingTeacher";
import TeacherLayout from "./pages/Teacher/TeacherLayout";
import TeacherLogin from "./pages/Teacher/TeacherLogin";
import AddTeacherAndAdmin from "./pages/admin/AddTeacherAndAdmin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminList from "./pages/admin/AdminList";
import AdminLogin from "./pages/admin/AdminLogin";
import AttendanceView from "./pages/admin/AttendanceView";
import BatchView from "./pages/admin/BatchView";
import SettingAdmin from "./pages/admin/SettingAdmin";
import StudentView from "./pages/admin/StudentView";
import TeacherView from "./pages/admin/TeacherView";
import BatchViewTeacher from "./pages/teacher/BatchViewTeacher";
import Home from "./pages/Home";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<h1>page not found</h1>}>
          {" "}
        </Route>
        <Route path="/" element={<HideRoute redirect="/admin/login"><Home></Home></HideRoute>}></Route>
        <Route path="/admin">
          <Route
            path="login"
            element={
              <HideRoute redirect="/admin/list">
                <AdminLogin></AdminLogin>
              </HideRoute>
            }
          ></Route>

          <Route element={<ProtectedRoute redirect="/admin"></ProtectedRoute>}>
            <Route element={<AdminLayout></AdminLayout>}>
              <Route path="list" element={<AdminList></AdminList>}></Route>
              <Route
                path="batch/:batchId"
                element={<AddTeacherAndAdmin></AddTeacherAndAdmin>}
              ></Route>
              <Route path="batch" element={<BatchView></BatchView>}></Route>
              <Route
                path="teacher"
                element={<TeacherView></TeacherView>}
              ></Route>
              <Route
                path="student"
                element={<StudentView></StudentView>}
              ></Route>
              <Route
                path="attendance"
                element={<AttendanceView></AttendanceView>}
              ></Route>
              <Route
                path="setting"
                element={<SettingAdmin></SettingAdmin>}
              ></Route>
            </Route>
          </Route>
        </Route>
        <Route path="/student">
          <Route
            path="login"
            element={
              <HideRoute redirect={"/student/batch"}>
                <StudentLogin></StudentLogin>
              </HideRoute>
            }
          ></Route>

          <Route
            element={<ProtectedRoute redirect="/student"></ProtectedRoute>}
          >
            <Route element={<StudentLayout></StudentLayout>}>
              <Route path="list" element={<AdminList></AdminList>}></Route>
              <Route
                path="batch/:batchId"
                element={<AttendanceViewStudent></AttendanceViewStudent>}
              ></Route>
              <Route
                path="batch"
                element={<BatchViewStudent></BatchViewStudent>}
              ></Route>
              <Route
                path="teacher"
                element={<TeacherView></TeacherView>}
              ></Route>
              <Route
                path="student"
                element={<StudentView></StudentView>}
              ></Route>
              <Route
                path="attendance"
                element={<AttendanceView></AttendanceView>}
              ></Route>
              <Route
                path="setting"
                element={<SettingStudent></SettingStudent>}
              ></Route>
            </Route>
          </Route>
        </Route>
        <Route path="/teacher">
          <Route
            path="login"
            element={
              <HideRoute redirect="/teacher/batch">
                <TeacherLogin></TeacherLogin>
              </HideRoute>
            }
          ></Route>

          <Route
            element={<ProtectedRoute redirect="/teacher"></ProtectedRoute>}
          >
            <Route element={<TeacherLayout></TeacherLayout>}>
              <Route path="list" element={<AdminList></AdminList>}></Route>
              <Route
                path="batch/:batchId"
                element={<BatchAttendanceTeacher></BatchAttendanceTeacher>}
              ></Route>
              <Route
                path="batch"
                element={<BatchViewTeacher></BatchViewTeacher>}
              ></Route>
              <Route
                path="teacher"
                element={<TeacherView></TeacherView>}
              ></Route>
              <Route
                path="student"
                element={<StudentView></StudentView>}
              ></Route>
              <Route
                path="attendance"
                element={<AttendanceView></AttendanceView>}
              ></Route>
              <Route
                path="setting"
                element={<SettingTeacher></SettingTeacher>}
              ></Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
