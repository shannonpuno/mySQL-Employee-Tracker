const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connects the database

const db = mysql.createConnection(
    {
        host: 'local host',
        user: 'root',
        password: 'shannonSQL72',
        database: 'employee_tracker_db'
    
    },
    console.log(`Connected to the employee_tracker_db database.`)
);

//I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const init = () => {
    viewOptions()
}
const viewOptions = () => {
    inquirer.prompt ([
        {
            type: "list",
            name:  "start",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an Employee",
                "Update employee role",
                "I'm done."
            ]
        }
    ]).then(answers => {
        switch(answers.start) {
            case "View all departments":
                departments();
                    break;
            case "View all roles": 
                roles();
                    break;
            case "View all employees":
                employees();
                    break;
            case "Add a department":
                addDepartment();
                    break;
            case "Add a role":
                addRole();
                    break;
            case "Add an Employee":
                addEmployee();
                    break;
            case "Update employee role":
                updateEmpRole();
                    break;
            case "I'm done.":
                process.exit();
        }
    })
}

// WHEN I choose to view all departments
//THEN I am presented with a formatted table showing department names and department ids
const departments = () => {
    db.query(`SELECT * FROM department`, (err, results) => {
        if (err) throw err;
        console.table(results);
        viewOptions();
    })
};

//WHEN I choose to view all roles
//THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
const roles = () => {
    db.query(`SELECT * FROM roles`, (err, results) => {
        if (err) throw err;
        console.table(results);
        viewOptions();
    })
};

//WHEN I choose to view all employees
//THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
const employees = () => {
    db.query(`SELECT * FROM employees`, (err, results) => {
        if (err) throw err;
        console.table(results);
        viewOptions();
    })
};

//WHEN I choose to add a department
//THEN I am prompted to enter the name of the department and that department is added to the database
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "department",
            message: "What is the name of the department?"
        }
    ]).then(answers => {
        db.query(`INSERT INTO department (name) VALUES (?)`, [answers.department], (err, results) => {
            if (err) throw err; 
            viewOptions();
        })
    })
};

//WHEN I choose to add a role
//THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
const addRole = () => {
    //mySQL2 exposes a .promise() function on Connections, to "upgrade" an existing non-promise connection to use promise
    const deptList = () => db.promise().query(`SELECT * FROM department`)
        .then((rows) => {
            array = rows [0].map(obj => obj.name);
            return array
        })
    inquirer.prompt([
        {
            type:"input",
            name:"roleName",
            message:"What is the role?"
        },
        {
            type:"input",
            name:"roleSalary",
            message:"What is the salary for this role?"
        },
        {
            type:"list",
            name:"department",
            message:"What department does this role belong in?",
            choices: deptList
        }
    ]).then(answers => {
        db.promise().query(`SELECT id FROM department WHERE name = ?`, answers.department)
            .then(answer => {
                let deptID = answer[0].map(obj => obj.id);
                return deptID[0]
            }).then((deptID) => {
                db.promise().query(`INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`, [answers.roleName, answers.roleSalary, deptID], (err,results) => {
                    if (err) throw err;
                    viewOptions();
                })
            })
    })
};

//WHEN I choose to add an employee
//THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
const addEmployee = () => {
    //mySQL2 exposes a .promise() function on Connections, to "upgrade" an existing non-promise connection to use promise
    const rolesList = () => db.promise().query(`SELECT * FROM roles`)
        .then((rows) => {
            array = rows [0].map(obj => obj.name);
            return array
        })
    inquirer.prompt([
        {
            type:"input",
            name:"firstName",
            message:"What is the employee's first name?"
        },
        {
            type:"input",
            name:"lastName",
            message:"What is the employee's last name?"
        },
        {
            type:"input",
            name:"manager",
            message:"Who is this employee's manager?"
        },
        {
            type:"list",
            name:"roleName",
            message:"What is this employee's role?",
            choices: rolesList
        }
    ]).then(answers => {
        db.promise().query(`SELECT id FROM roles WHERE name = ?`, answers.roles)
            .then(answer => {
                let roleID = answer[0].map(obj => obj.id);
                return roleID[0]
            }).then((roleID) => {
                db.promise().query(`INSERT INTO employees(first_name, last_name, manager_id, role_id) VALUES (?,?,?)`, [answers.firstName, answers.lastName, answers.manager, roleID,], (err,results) => {
                    if (err) throw err;
                    viewOptions();
                })
            })
    })
};
//WHEN I choose to update an employee role
//THEN I am prompted to select an employee to update and their new role and this information is updated in the database
const updateEmpRole = () => {
    const empList = () => db.promise().query(`SELECT * FROM employees`)
        .then((rows) => {
            array = rows [0].map(obj => obj.name);
            return array
        })
    const rolesList = () => db.promise().query(`SELECT * FROM roles`)
        .then((rows) => {
            array = rows [0].map(obj => obj.name);
            return array
        })
    inquirer.prompt([
        {
            type:"list",
            name:"employees",
            message:"Which employee would you like to update?",
            choices: empList
        },
        {
            type:"list",
            name:"roles",
            message:"What is this employees new role?",
            choices:rolesList
        }
    ]).then(answers => {
        db.promise().query(`SELECT id FROM roles WHERE name = ?`, answers.roles)
            .then(answer => {
                let roleID = answer[0].map(obj => obj.id);
                return roleID[0]
            }).then((roleID) => {
                db.promise().query(`UPDATE employees SET ? WHERE ?`,[{role_id: roleID, first_name: id}], (err,results) => {
                    if (err) throw err;
                    viewOptions();
                })
            })
    })
}