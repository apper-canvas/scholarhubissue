import attendanceData from "@/services/mockData/attendance.json";

let attendance = [...attendanceData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const attendanceService = {
  async getAll() {
    await delay(300);
    return [...attendance];
  },

  async getById(id) {
    await delay(200);
    return attendance.find(record => record.Id === id);
  },

  async getByStudentId(studentId) {
    await delay(250);
    return attendance.filter(record => record.studentId === studentId);
  },

  async getByDate(date) {
    await delay(250);
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return attendance.filter(record => record.date === dateStr);
  },

  async create(attendanceData) {
    await delay(400);
    const newRecord = {
      ...attendanceData,
      Id: Math.max(...attendance.map(a => a.Id), 0) + 1,
      date: typeof attendanceData.date === 'string' ? attendanceData.date : attendanceData.date.toISOString().split('T')[0]
    };
    attendance.push(newRecord);
    return newRecord;
  },

  async update(id, attendanceData) {
    await delay(400);
    const index = attendance.findIndex(record => record.Id === id);
    if (index !== -1) {
      attendance[index] = { ...attendance[index], ...attendanceData };
      return attendance[index];
    }
    throw new Error("Attendance record not found");
  },

  async delete(id) {
    await delay(300);
    const index = attendance.findIndex(record => record.Id === id);
    if (index !== -1) {
      const deleted = attendance.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Attendance record not found");
  },

  async markAttendance(studentId, date, status, reason = "") {
    await delay(400);
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const existingIndex = attendance.findIndex(record => 
      record.studentId === studentId && record.date === dateStr
    );

    if (existingIndex !== -1) {
      attendance[existingIndex] = {
        ...attendance[existingIndex],
        status,
        reason
      };
      return attendance[existingIndex];
    } else {
      return await this.create({
        studentId,
        date: dateStr,
        status,
        reason
      });
    }
  }
};