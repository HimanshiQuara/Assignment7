const Sequelize = require('sequelize');

// Initialize Sequelize with database credentials
const sequelize = new Sequelize('student', 'root', 'Himanshi@123', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define Student model
const Student = sequelize.define('student', {
  name: Sequelize.STRING,
  age: Sequelize.INTEGER,
  gender: Sequelize.STRING,
});

// Sync database and table schema
sequelize.sync()
  .then(() => {
    console.log('Database and table created!');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Prompt user for input
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

function addStudent() {
  readline.question('Enter student name: ', (name) => {
    readline.question('Enter student age: ', (age) => {
      readline.question('Enter student gender: ', (gender) => {
        // Add student to database
        Student.create({
          name,
          age,
          gender,
        })
          .then(() => {
            console.log('Student added successfully!');
            readline.close();
          })
          .catch((error) => {
            console.error('Error adding student:', error);
            readline.close();
          });
      });
    });
  });
}

function updateStudent() {
  readline.question('Enter student name or roll number: ', (nameOrRollNumber) => {
    readline.question('Enter field to update (name, age, gender): ', (field) => {
      readline.question(`Enter new value for ${field}: `, (value) => {
        // Find student by name or roll number
        Student.findOne({
          where: Sequelize.or({ name: nameOrRollNumber }, { rollNumber: nameOrRollNumber }),
        })
          .then((student) => {
            if (student) {
              // Update student record
              student[field] = value;
              student.save()
                .then(() => {
                  console.log('Student updated successfully!');
                  readline.close();
                })
                .catch((error) => {
                  console.error('Error updating student:', error);
                  readline.close();
                });
            } else {
              console.error('Student not found!');
              readline.close();
            }
          })
          .catch((error) => {
            console.error('Error finding student:', error);
            readline.close();
          });
      });
    });
  });
}

function listStudents() {
  // List all students
  Student.findAll()
    .then((students) => {
      console.log('List of all students:');
      students.forEach((student) => {
        console.log(`- ${student.name} (${student.age}, ${student.gender})`);
      });
      readline.close();
    })
    .catch((error) => {
      console.error('Error listing students:', error);
      readline.close();
    });
}

// Prompt user for action
readline.question('Enter an action (1=add, 2=update, 3=list): ', (action) => {
  if (action === '1') {
    addStudent();
  } else if (action === '2') {
    updateStudent();
  } else if (action === '3') {
    listStudents();
  } else {
    console.error('Invalid action!');
    readline.close();
  }
});
