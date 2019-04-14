const express = require('express');

module.exports = function resource(name,params){
    const router = express.Router();

    router.use(`/:${name}Id`,async function(req,res,next){
        req[`${name}Id`]=req.params[`${name}Id`];
        if(params.middle && typeof params.middle == 'function'){
            return params.middle(req,(status,send)=>{
                return res.status(status).send(send);
            },()=>{next();});
        }else
        return next();
    });
    
    if(params.create && typeof params.create == 'function'){
        router.post('/',params.create);
    }

    if(params.show && typeof params.show == 'function'){
        router.get(`/:${name}Id`,params.show);
    }

    if(params.index && typeof params.index == 'function'){
        router.get('/',params.index);
    }

    if(params.update && typeof params.update == 'function'){
        router.put(`/:${name}Id`,params.update);
    }

    if(params.delete && typeof params.delete == 'function'){
        router.delete(`/:${name}Id`,params.delete);
    }

    return router;
}


