import { StudentManager } from "./managers/StudentManager.js";
import { showList } from "./utils/showList.js";
const manager = new StudentManager();
manager.loadFromLocalStorage();
renderTable();
function renderTable(elementId = "studentTableBody") {
    const tableBody = document.getElementById(elementId);
    tableBody.innerHTML = "";
    const students = manager.getAllStudents();
    showList(students);
    students.forEach((s) => {
        tableBody.innerHTML += `
      <tr>
        <td>${s.id}</td>
        <td>${s.title_name}</td>
        <td>${s.first_name}</td>
        <td>${s.last_name}</td>
        <td>${s.email}</td>
        <td>${s.year}</td>
        <td>${s.major}</td>
      </tr>
    `;
    });
}
document.getElementById("addBtn").onclick = () => {
    const id = document.getElementById("id").value;
    const year = Number(document.getElementById("year").value);
    const major = document.getElementById("major").value;
    //  เพิ่ม title_name,first_name,last_name, email ให้ครบ
    const title_name = document.getElementById("title_name").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const student = { id, year, major, title_name, first_name, last_name, email };
    manager.addStudent(student);
    renderTable();
};
document.getElementById("searchNameBtn").onclick = () => {
    const firstname = document.getElementById("searchFirstName").value;
    const lastname = document.getElementById("searchLastName").value;
    const results = manager.findStudentsByName(firstname, lastname);
    showList(results);
    alert(`ผลการค้นหา: ${results.length} คน`);
};
document.getElementById("searchMajorBtn").onclick = () => {
    const keyword = document.getElementById("searchMajor").value;
    const results = manager.findStudentsByMajor(keyword);
    showList(results);
    alert(`พบในสาขา: ${results.length} คน`);
};
// เพิ่มค้นหาด้วย Email
document.getElementById("searchEmailBtn").onclick = () => {
    const keyword = document.getElementById("searchEmail").value;
    const results = manager.findStudentsByEmail(keyword);
    showList(results);
    alert(`พบEmail: ${results.length} คน`);
};
renderTable("studentTableBody");
