
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

module.exports = {
    up(){
        db.run("CREATE TABLE Employee (\
            id INTEGER PRIMARY KEY NOT NULL,\
            name TEXT NOT NULL,\
            position TEXT NOT NULL,\
            wage INTEGER NOT NULL,\
            is_current_employee INTEGER DEFAULT 1\
        );");
        db.run("CREATE TABLE Timesheet (\
            id INTEGER PRIMARY KEY NOT NULL,\
            hours INTEGER NOT NULL,\
            rate INTEGER NOT NULL,\
            date INTEGER NOT NULL,\
            employee_id INTEGER FOREING KEY NOT NULL\
        );");
        db.run("CREATE TABLE Menu (\
             id INTEGER PRIMARY KEY NOT NULL,\
             title INTEGER NOT NULL\
        );");
        db.run("CREATE TABLE MenuItem (\
            id INTEGER PRIMARY KEY NOT NULL,\
            name TEXT NOT NULL,\
            description TEXT NOT NULL,\
            inventory INTEGER NOT NULL,\
            price INTEGER NOT NULL,\
            menu_id INTEGER FOREING KEY NOT NULL\
        );");

    },
    down(){
        db.run("DROP TABLE Employee;");        
        db.run("DROP TABLE Timesheet;");
        db.run("DROP TABLE Menu;");
        db.run("DROP TABLE MenuItem;");        
    }
}

require('make-runnable');