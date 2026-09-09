export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Attendance Management System API",
    version: "1.0.0",
    description:
      "Comprehensive REST API documentation for the Attendance Management System. Supports Admin, Teacher, and Student roles with JWT Bearer authentication.",
    contact: {
      name: "Attendance System Support",
    },
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Local Development Server",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token obtained from `/login`",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "admin@example.com" },
          password: { type: "string", example: "Admin@123" },
        },
      },
      AddAdminRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", example: "newadmin@example.com" },
          password: { type: "string", example: "AdminPass@123" },
        },
      },
      AddTeacherRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Ram Sharma" },
          email: { type: "string", example: "ram.teacher@example.com" },
          password: { type: "string", example: "Teacher@123" },
        },
      },
      AddStudentRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Sita Kumari" },
          email: { type: "string", example: "sita.student@example.com" },
          password: { type: "string", example: "Student@123" },
        },
      },
      AddBatchRequest: {
        type: "object",
        required: ["name", "course"],
        properties: {
          name: { type: "string", example: "Class of 2024" },
          course: { type: "string", example: "Database Management Systems" },
        },
      },
      UpdatePasswordRequest: {
        type: "object",
        required: ["oldPassword", "newPassword"],
        properties: {
          oldPassword: { type: "string", example: "OldPass@123" },
          newPassword: { type: "string", example: "NewPass@123" },
        },
      },
      AttendanceSubmission: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: {
              type: "object",
              properties: {
                studentId: { type: "string", example: "645a2b3c4d5e6f7a8b9c0d1e" },
                name: { type: "string", example: "Sita Kumari" },
                status: {
                  type: "integer",
                  description: "0 = Present, 1 = Absent, 2 = Leave",
                  enum: [0, 1, 2],
                  example: 0,
                },
              },
            },
          },
        },
      },
    },
  },
  tags: [
    { name: "Auth & Helper", description: "Authentication and token verification" },
    { name: "Admin", description: "Admin operations: batches, teachers, students" },
    { name: "Teacher", description: "Teacher portal operations" },
    { name: "Student", description: "Student portal operations" },
    { name: "Attendance", description: "Attendance marking, history, and Excel export" },
  ],
  paths: {
    "/login": {
      post: {
        tags: ["Auth & Helper"],
        summary: "Login (All roles: Admin, Teacher, Student)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: { description: "Login successful with JWT token and role" },
          401: { description: "Credentials did not match" },
        },
      },
    },
    "/logout": {
      get: {
        tags: ["Auth & Helper"],
        summary: "Logout user",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Logged out successfully" },
        },
      },
    },
    "/verifyToken": {
      get: {
        tags: ["Auth & Helper"],
        summary: "Verify JWT token validity",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Token is valid" },
          401: { description: "Invalid or expired token" },
        },
      },
    },
    "/admin/info": {
      get: {
        tags: ["Admin"],
        summary: "Get logged in admin information",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Admin details" } },
      },
    },
    "/admin/all": {
      get: {
        tags: ["Admin"],
        summary: "Get all admins",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "List of admins" } },
      },
    },
    "/admin/add": {
      post: {
        tags: ["Admin"],
        summary: "Create a new admin",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddAdminRequest" },
            },
          },
        },
        responses: { 200: { description: "Admin created" } },
      },
    },
    "/admin/{adminId}": {
      put: {
        tags: ["Admin"],
        summary: "Update an admin",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { data: { type: "object", properties: { email: { type: "string" } } } },
              },
            },
          },
        },
        responses: { 200: { description: "Admin updated" } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete an admin",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "adminId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Admin deleted" } },
      },
    },
    "/admin/batch": {
      get: {
        tags: ["Admin"],
        summary: "Get all batches",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "List of batches" } },
      },
      post: {
        tags: ["Admin"],
        summary: "Create a new batch",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddBatchRequest" },
            },
          },
        },
        responses: { 200: { description: "Batch created" } },
      },
    },
    "/admin/batch/{batchId}": {
      get: {
        tags: ["Admin"],
        summary: "Get batch details",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "batchId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Batch details" } },
      },
      put: {
        tags: ["Admin"],
        summary: "Update batch course details",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "batchId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Batch updated" } },
      },
    },
    "/admin/teacher": {
      get: {
        tags: ["Admin"],
        summary: "Get all teachers",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "List of teachers" } },
      },
      post: {
        tags: ["Admin"],
        summary: "Add a new teacher",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddTeacherRequest" },
            },
          },
        },
        responses: { 200: { description: "Teacher created" } },
      },
    },
    "/admin/teacher/{teacherId}": {
      get: {
        tags: ["Admin"],
        summary: "Get teacher details",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "teacherId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Teacher details" } },
      },
      put: {
        tags: ["Admin"],
        summary: "Update teacher info",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "teacherId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Teacher updated" } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete teacher",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "teacherId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Teacher deleted" } },
      },
    },
    "/admin/teacher/{teacherId}/{batchId}": {
      put: {
        tags: ["Admin"],
        summary: "Assign teacher to a batch",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "teacherId", in: "path", required: true, schema: { type: "string" } },
          { name: "batchId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "Teacher assigned to batch" } },
      },
      patch: {
        tags: ["Admin"],
        summary: "Unassign teacher from a batch",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "teacherId", in: "path", required: true, schema: { type: "string" } },
          { name: "batchId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "Teacher unassigned from batch" } },
      },
    },
    "/admin/teacher/batch/{batchId}": {
      get: {
        tags: ["Admin"],
        summary: "Get teachers assigned to a batch",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "batchId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Teachers in batch" } },
      },
    },
    "/admin/student": {
      get: {
        tags: ["Admin"],
        summary: "Get all students",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "List of students" } },
      },
      post: {
        tags: ["Admin"],
        summary: "Add a new student",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddStudentRequest" },
            },
          },
        },
        responses: { 200: { description: "Student created" } },
      },
    },
    "/admin/student/{studentId}": {
      get: {
        tags: ["Admin"],
        summary: "Get student details",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "studentId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Student details" } },
      },
      put: {
        tags: ["Admin"],
        summary: "Update student info",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "studentId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Student updated" } },
      },
      delete: {
        tags: ["Admin"],
        summary: "Delete student",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "studentId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Student deleted" } },
      },
    },
    "/admin/student/{studentId}/{batchId}": {
      put: {
        tags: ["Admin"],
        summary: "Assign student to a batch",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "studentId", in: "path", required: true, schema: { type: "string" } },
          { name: "batchId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "Student assigned to batch" } },
      },
      patch: {
        tags: ["Admin"],
        summary: "Unassign student from a batch",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "studentId", in: "path", required: true, schema: { type: "string" } },
          { name: "batchId", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "Student unassigned from batch" } },
      },
    },
    "/admin/student/batch/{batchId}": {
      get: {
        tags: ["Admin"],
        summary: "Get students assigned to a batch",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "batchId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Students in batch" } },
      },
    },
    "/admin/update-password": {
      post: {
        tags: ["Admin"],
        summary: "Update admin password",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePasswordRequest" },
            },
          },
        },
        responses: { 200: { description: "Password updated successfully" } },
      },
    },
    "/teacher/batch": {
      get: {
        tags: ["Teacher"],
        summary: "Get all batches assigned to the logged in teacher",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "List of teacher batches" } },
      },
    },
    "/teacher/info": {
      get: {
        tags: ["Teacher"],
        summary: "Get logged in teacher details",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Teacher details" } },
      },
    },
    "/teacher/update-password": {
      post: {
        tags: ["Teacher"],
        summary: "Update teacher password",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePasswordRequest" },
            },
          },
        },
        responses: { 200: { description: "Password updated successfully" } },
      },
    },
    "/student/class": {
      get: {
        tags: ["Student"],
        summary: "Get enrolled classes for logged in student",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Enrolled classes" } },
      },
    },
    "/student/student-detail": {
      get: {
        tags: ["Student"],
        summary: "Get student details",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Student profile info" } },
      },
    },
    "/student/info": {
      get: {
        tags: ["Student"],
        summary: "Get logged in student info",
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: "Student info" } },
      },
    },
    "/student/attendance-detail/{batchId}": {
      get: {
        tags: ["Student"],
        summary: "Get attendance details for a specific batch",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "batchId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Attendance records for batch" } },
      },
    },
    "/student/update-password": {
      post: {
        tags: ["Student"],
        summary: "Update student password",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdatePasswordRequest" },
            },
          },
        },
        responses: { 200: { description: "Password updated successfully" } },
      },
    },
    "/attendance/studentList/{batchId}": {
      get: {
        tags: ["Attendance"],
        summary: "Get list of students in batch for marking attendance",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "batchId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Students list" } },
      },
    },
    "/attendance/submit/{batchId}": {
      post: {
        tags: ["Attendance"],
        summary: "Submit attendance records for a batch",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "batchId", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AttendanceSubmission" },
            },
          },
        },
        responses: { 200: { description: "Attendance submitted successfully" } },
      },
    },
    "/attendance/{batchId}": {
      get: {
        tags: ["Attendance"],
        summary: "Get all attendance records for a batch",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "batchId", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "All attendance records for batch" } },
      },
    },
    "/attendance/{batchId}/{year}/{month}": {
      get: {
        tags: ["Attendance"],
        summary: "Get attendance records filtered by year and month",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "batchId", in: "path", required: true, schema: { type: "string" } },
          { name: "year", in: "path", required: true, schema: { type: "string", example: "2024" } },
          { name: "month", in: "path", required: true, schema: { type: "string", example: "6" } },
        ],
        responses: { 200: { description: "Filtered attendance records" } },
      },
    },
    "/attendance/{batchId}/{email}": {
      get: {
        tags: ["Attendance"],
        summary: "Get individual student attendance by email",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "batchId", in: "path", required: true, schema: { type: "string" } },
          { name: "email", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: { 200: { description: "Student attendance records" } },
      },
    },
    "/attendance/export/{batchId}": {
      get: {
        tags: ["Attendance"],
        summary: "Export all attendance records to Excel sheet",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "batchId", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "Excel file download",
            content: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
    },
    "/attendance/export/{batchId}/{year}/{month}": {
      get: {
        tags: ["Attendance"],
        summary: "Export attendance records to Excel by date (year/month)",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "batchId", in: "path", required: true, schema: { type: "string" } },
          { name: "year", in: "path", required: true, schema: { type: "string", example: "2024" } },
          { name: "month", in: "path", required: true, schema: { type: "string", example: "6" } },
        ],
        responses: {
          200: {
            description: "Excel file download",
            content: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
    },
    "/attendance/export/{batchId}/{email}": {
      get: {
        tags: ["Attendance"],
        summary: "Export individual student attendance to Excel",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "batchId", in: "path", required: true, schema: { type: "string" } },
          { name: "email", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: {
            description: "Excel file download",
            content: {
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
                schema: { type: "string", format: "binary" },
              },
            },
          },
        },
      },
    },
  },
};
