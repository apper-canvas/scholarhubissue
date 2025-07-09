import gradesData from "@/services/mockData/grades.json";

let grades = [...gradesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const gradeService = {
  async getAll() {
    await delay(300);
    return [...grades];
  },

  async getById(id) {
    await delay(200);
    return grades.find(grade => grade.Id === id);
  },

  async getByStudentId(studentId) {
    await delay(250);
    return grades.filter(grade => grade.studentId === studentId);
  },

  async create(gradeData) {
    await delay(400);
    const newGrade = {
      ...gradeData,
      Id: Math.max(...grades.map(g => g.Id), 0) + 1,
      date: typeof gradeData.date === 'string' ? gradeData.date : gradeData.date.toISOString().split('T')[0]
    };
    grades.push(newGrade);
    return newGrade;
  },

  async update(id, gradeData) {
    await delay(400);
    const index = grades.findIndex(grade => grade.Id === id);
    if (index !== -1) {
      grades[index] = { ...grades[index], ...gradeData };
      return grades[index];
    }
    throw new Error("Grade not found");
  },

  async delete(id) {
    await delay(300);
    const index = grades.findIndex(grade => grade.Id === id);
    if (index !== -1) {
      const deleted = grades.splice(index, 1)[0];
      return deleted;
    }
    throw new Error("Grade not found");
  },

  async getStudentGPA(studentId) {
    await delay(250);
    const studentGrades = grades.filter(grade => grade.studentId === studentId);
    if (studentGrades.length === 0) return 0;

    const totalPercentage = studentGrades.reduce((sum, grade) => 
      sum + (grade.score / grade.maxScore) * 100, 0);
    const averagePercentage = totalPercentage / studentGrades.length;

    // Convert percentage to GPA scale (4.0)
    if (averagePercentage >= 97) return 4.0;
    if (averagePercentage >= 93) return 3.7;
    if (averagePercentage >= 90) return 3.3;
    if (averagePercentage >= 87) return 3.0;
    if (averagePercentage >= 83) return 2.7;
    if (averagePercentage >= 80) return 2.3;
    if (averagePercentage >= 77) return 2.0;
    if (averagePercentage >= 73) return 1.7;
    if (averagePercentage >= 70) return 1.3;
    if (averagePercentage >= 67) return 1.0;
    if (averagePercentage >= 65) return 0.7;
    return 0.0;
  }
};