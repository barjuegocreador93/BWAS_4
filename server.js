const express = require('express');
const app = express();

const menu_router = require('./routers/menus.js');
const employee_router = require('./routers/employees.js');

app.use('/api/menus',menu_router);
app.use('/api/employees',employee_router);

app.listen(process.env.PORT || 400,()=>{

});

module.exports = app;