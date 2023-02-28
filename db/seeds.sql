INSERT INTO department(name)
    VALUES ("HR"),
           ("Finance"),
           ("IT"),
           ("Marketing"),
           ("Sales");

INSERT INTO roles(title,salary, department_id)
    VALUES ("Product Manager", 70000, 1),
           ("Sales Representative", 70000, 5),
           ("Accountant", 90000, 2),
           ("Digital Marketing", 70000, 4),
           ("Backend Engineer", 1000000, 3);

INSERT INTO employees(first_name, last_name, manager_id, role_id)
    VALUES ("Tom", "Koracic", NULL, 1),
           ("Genny", "Lewis", NULL, 2),
           ("Avery", "Harpery", 1, 4),
           ("Sam", "Kolby", 2, 3);