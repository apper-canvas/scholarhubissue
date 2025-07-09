import studentsData from "@/services/mockData/students.json";

let students = [...studentsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const studentService = {
  async getAll() {
    await delay(300);
    return [...students];
  },

  async getById(id) {
    await delay(200);
    return students.find(student => student.Id === id);
  },

  async create(studentData) {
    await delay(400);
    const newStudent = {
      ...studentData,
      Id: Math.max(...students.map(s => s.Id), 0) + 1,
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
    students.push(newStudent);
    return newStudent;
  },

  async update(id, studentData) {
    await delay(400);
    const index = students.findIndex(student => student.Id === id);
    if (index !== -1) {
      students[index] = { ...students[index], ...studentData };
      return students[index];
    }
    throw new Error("Student not found");
  },

  async delete(id) {
    await delay(300);
    const index = students.findIndex(student => student.Id === id);
    if (index !== -1) {
      const deleted = students.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Student not found");
  },

  async search(query) {
    await delay(250);
    const searchTerm = query.toLowerCase();
    return students.filter(student =>
      student.firstName.toLowerCase().includes(searchTerm) ||
      student.lastName.toLowerCase().includes(searchTerm) ||
student.email.toLowerCase().includes(searchTerm)
    );
  },

  async getDepartments() {
    await delay(200);
    const departments = [...new Set(students.map(student => student.department))];
    return departments.sort();
  },

  async filterByDepartment(department) {
    await delay(250);
    if (!department) return [...students];
    return students.filter(student => student.department === department);
  }
};