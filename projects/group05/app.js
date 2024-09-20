const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');
const studentsData = require('./students.json');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', 'views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('landing'); // Render the landing.hbs template
});

app.get('/index', (req, res) => {
  res.render('index', { students: studentsData });
});

app.get('/add-student', (req, res) => {
  res.render('addStudent');
});

app.post('/add-student', (req, res) => {
  const { studentId, name } = req.body;
  const isStudentExists = studentsData.some(student => student.studentId === studentId);
  if (isStudentExists) {
    return res.status(400).send(`
      <p>Student ID already exists</p>
      <meta http-equiv="refresh" content="2;url=/">
    `);
  }
  studentsData.push({ studentId, name, attendance: {} });
  fs.writeFileSync('./students.json', JSON.stringify(studentsData));
  res.redirect('/index');
});

app.get('/edit-student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const student = studentsData.find(s => s.studentId === studentId);
  res.render('editStudent', { student });
});

app.post('/edit-student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const { name } = req.body;
  const studentIndex = studentsData.findIndex(s => s.studentId === studentId);

  if (studentIndex !== -1) {
    studentsData[studentIndex].name = name;
    fs.writeFileSync('./students.json', JSON.stringify(studentsData));
  }

  res.redirect('/index');
});

app.get('/delete-student/:studentId', (req, res) => {
  const { studentId } = req.params;
  const updatedStudentsData = studentsData.filter(student => student.studentId !== studentId);

  fs.writeFile('./students.json', JSON.stringify(updatedStudentsData), (err) => {
    if (err) {
      console.error('Error writing to students.json:', err);
      return res.status(500).send('Internal Server Error');
    } 
    res.redirect('/index');
  });
});



app.get('/edit-attendance/:studentId', (req, res) => {
  const student = studentsData.find(s => s.studentId === req.params.studentId);
  res.render('editAttendance', { student });
});

app.post('/edit-attendance/:studentId', (req, res) => {
  const { sessionId, status } = req.body;
  const student = studentsData.find(s => s.studentId === req.params.studentId);
  student.attendance[sessionId] = status;
  fs.writeFileSync('./students.json', JSON.stringify(studentsData));
  res.redirect('/index');
});

app.get('/view-attendance/:studentId', (req, res) => {
  const { studentId } = req.params;
  const student = studentsData.find(s => s.studentId === studentId);
  res.render('viewAttendance', { student });
});

app.post('/view-attendance/:studentId', (req, res) => {
  res.redirect('/index');
});

app.get('/create-attendance/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  res.render('createAttendance', { students: studentsData, sessionId });
});

app.post('/submit-attendance', (req, res) => {
  const { sessionId, attendance } = req.body;

  studentsData.forEach(student => {
    if (attendance[student.studentId]) {
      student.attendance[sessionId] = attendance[student.studentId];
    }
  });

  fs.writeFileSync('./students.json', JSON.stringify(studentsData));
  res.redirect('/index');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

