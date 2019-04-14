const resource = require('./resource.js');
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

const employee_router = resource("employee",{
    middle(req,res,next){           
        db.get(`SELECT * FROM Employee WHERE is_current_employee=1 AND id=${req.employeeId}`,(e,employee)=>{
            if(e)return res(500);
            if(!employee)return res(404);
            req.Employee = employee;
            next();         
        });
    },
    index(req,res){
        db.all("SELECT * FROM Employee WHERE is_current_employee=1",(e,employees)=>{
            if(e)return res.status(500).send();
            return res.status(200).send({employees:employees});         
        });
    },
    create(req,res){
        var employee = req.query;        
        employee.wage = Number(employee.wage);        
        if(employee.name&&employee.position&&typeof employee.wage === typeof 5){
            try{
                var sender=(id)=>{
                    return res.status(201).send({employee_id:id});
                }
                db.run(`INSERT INTO Employee (name, position, wage) VALUES ('${employee.name}', '${employee.position}', ${employee.wage})`,function(e){
                    sender(this.lastID);
                });                
            }catch(e){
                return res.status(500).send();
            }        
        }
        return res.status(401).send();            
    },
    show(req,res){
        return res.status(200).send({employee:req.Employee});
    },
    update(req,res){
        var employee = req.query;
        employee.wage = Number(employee.wage);        
        var sender=(id)=>{
            return res.status(201).send({employee_id:id});
        }
        
        if(employee.name&&employee.position&&typeof employee.wage === typeof 5){
            db.run(`UPDATE Employee SET name='${employee.name}', position='${employee.position}', wage=${employee.wage} WHERE id=${req.employeeId} ; SELECT * FROM Employee WHERE id=${req.employeeId} ;`,function(e){
                
                if(e)return res.status(500).send();                
                sender(req.Employee.id);                 
            });                     
        }else
        return res.status(400).send();  
    },
    delete(req,res){  
        db.get(`UPDATE Employee SET is_current_employee=0 WHERE id=${req.employeeId} ;`,(e,employee)=>{
            if(e)return res.status(500).send();                
            return res.status(200).send(req.Employee); 
        });  
    }
});

const timesheets_router = resource("timesheet",{
    middle(req,res,next){
        db.get(`SELECT * FROM Timesheet WHERE id=${req.timesheetId} AND employee_id=${req.employeeId}`,(e,timesheet)=>{
            if(e)return res(500);
            if(!timesheet)return res(404);
            req.Timesheet = timesheet;
            next();         
        }); 
    },
    index(req,res){
        db.all(`SELECT * FROM Timesheet WHERE employee_id=${req.employeeId}`,(e,timesheets)=>{
            if(e)return res.status(500).send();
            return res.status(200).send(timesheets);         
        });
    },
    create(req,res){
        var timesheet = req.query;
        if(!timesheet.hours&&!timesheet.rate&&!timesheet.date)return res.status(401).send();
        db.run(`INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES (${Number(timesheet.hours)}, ${Number(timesheet.rate)}, ${Number(timesheet.date)}, ${req.employeeId})`);
        return res.status(201).send();
    },
    update(req,res){
        var timesheet = req.query;
        if(!timesheet.hours&&!timesheet.rate&&!timesheet.date)return res.status(400).send();
        db.get(`UPDATE Timesheet SET hours=${timesheet.hours}, rate=${timesheet.rate}, date=${timesheet.date} WHERE employee_id=${req.employeeId} AND id=${req.timesheetId} ;`,(e,timesheet)=>{
            if(e)return res.status(500).send();                
            return res.status(200).send(); 
        });
    },
    delete(req,res){
        db.get(`DELETE FROM Timesheet WHERE id=${req.timesheetId} ;`,(e,mi)=>{
            if(e)return res.status(500).send();                
            return res.status(200).send(); 
        });
    }
});



employee_router.use('/:employeeId/timesheets',timesheets_router);
module.exports = employee_router;