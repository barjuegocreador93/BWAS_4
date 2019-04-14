const resource = require('./resource.js');
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


const menu_router = resource("menu",{
    middle(req,res,next){
        db.get(`SELECT * FROM Menu WHERE id=${req.menuId}`,(e,menu)=>{
            if(e)return res(500);
            if(!menu)return res(404);
            req.Menu = menu;
            next();                                
        });
    },
    index(req,res){
        db.all("SELECT * FROM Menu",(e,menus)=>{
            if(e)return res.status(500).send();
            return res.status(200).send(menus);         
        });
    },
    create(req,res){
        var menu = req.query;            
        if(menu.title){
            try{
                db.run(`INSERT INTO Menu (title) VALUES ('${menu.title}')`);
                return res.status(201).send();
            }catch(e){
                return res.status(500).send();
            }        
        }
        return res.status(401).send();
    },
    show(req,res){
        return res.status(200).send(req.Menu);
    },
    update(req,res){
        var menu = req.query;              
        if(menu.title){
            db.get(`UPDATE Menu SET title='${menu.title}' WHERE id=${req.menuId}`,(e,m)=>{
                if(e)return res.status(500).send();                
                return res.status(200).send(); 
            });                   
        }else
        return res.status(400).send();
    },
    delete(req,res){
        db.get(`DELETE FROM Menu WHERE id=${req.menuId} ;`,(e,m)=>{
            if(e)return res.status(500).send();                
            return res.status(200).send(); 
        });
    }
});

const menu_items_router = resource("menuitem",{
    middle(req,res,next){
        db.get(`SELECT * FROM MenuItem WHERE id=${req.menuitemId} AND menu_id=${req.menuId}`,(e,menuItem)=>{
            if(e){                               
                return res(500);
            }
            if(!menuItem)return res(404);
            req.MenuItem = menuItem;
            next();                                
        });
    },
    index(req,res){
        db.all(`SELECT * FROM MenuItem WHERE menu_id=${req.menuId}`,(e,menuItems)=>{
            if(e){ 
                console.log(req.MenuItem);
                                             
                return res.status(500).send();
            }
            return res.status(200).send(menuItems);         
        });
    },
    create(req,res){
        var menuItem = req.query;
        if(menuItem.name&&menuItem.description&&menuItem.inventory&&menuItem.price){
            try{
                db.run(`INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ('${menuItem.name}', '${menuItem.description}', ${menuItem.inventory}, ${menuItem.price}, ${req.menuId})`);
                return res.status(201).send();
            }catch(e){
                return res.status(500).send();
            }  
        }return res.status(401).send();
    },
    update(req,res){
        var menuItem = req.query;              
        if(menuItem.name&&menuItem.description&&menuItem.inventory&&menuItem.price){
            db.get(`UPDATE MenuItem SET name='${menuItem.name}', description='${menuItem.description}', inventory=${menuItem.inventory}, price=${menuItem.price} WHERE menu_id=${req.menuId} AND id=${req.MenuItem.id} ;`,(e,m)=>{
                if(e){
                    console.log(e);
                    
                    return res.status(500).send();
                }

                return res.status(200).send(); 
            });                  
        }else
        return res.status(400).send();
    },
    delete(req,res){
        db.get(`DELETE FROM MenuItem WHERE id=${req.MenuItem.id} ;`,(e,m)=>{
            if(e)return res.status(500).send();                
            return res.status(200).send(); 
        });
    }
});



menu_router.use('/:menuId/menu-items',menu_items_router);
module.exports = menu_router;