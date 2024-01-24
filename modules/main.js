const express = require('express');
const app = express({xPoweredBy:false});
const fs = require('fs');

app.set('view engine', 'ejs');
app.set('views', 'templates');

app.use(require('./setting'));

app.use('/user', (req,res,next)=>{
    req.users = 
        JSON.parse(
            fs.readFileSync(
                'user.json',{encoding:'utf-8'}
            )
        ).users;
    next();
});


app.use('/board', (req,res,next)=>{
    req.boards = 
        JSON.parse(
            fs.readFileSync(
                'board.json',{encoding:'utf-8'}
            )
        ).boards;
    next();
});

app.post('/board', (req,res,next)=>{
    if(req.body.id){
        res.send(req.boards
            .filter(board=>
                board.id === req.body.id));
    }
    else if(req.body.page){
        res.send(req.boards
            .filter((board,index)=>
                page * 10 - 10 <= index &&
                index < page * 10));
    }
    else res.status(200).send({});
});

app.put('/board/write', (req,res,next)=>{
    req.body = req.body.data;
    if(req.body.id && req.body.content){
        req.boards.push({
            id:req.body.id,
            content:req.body.content
        });
        fs.writeFileSync(
            'board.json',
            JSON.stringify(
                {boards:req.boards}
            ),
            {encoding:"utf8"}
        );
        res.send({data:"ok"});
    }
    else res.status(200).send({});
});

app.post('/user/total', (req,res,next)=>{
    res.send(
        req.users
            .filter(
                user=>
                    user.role === "user"
            )
            .map(user=>
                {return {id:user.id}}
            )
    );
});

app.post('/user', (req,res,next)=>{
    if(req.body.id && req.body.pw){
        let user = req.users
            .filter(
                user=>
                    req.body.id.toLowerCase() === 
                    user.id.toLowerCase() &&
                    req.body.pw ===
                    user.pw
            );
        if(user.length === 0) res.status(200).send({});
        else res.send(user[0]);
    }
    else res.status(200).send({});
});
app.put('/user', (req,res,next)=>{
    req.body = req.body.data;
    if(req.body.id && req.body.pw){
        if(req.users
            .filter(
                user=>
                    req.body.id.toLowerCase() === 
                    user.id.toLowerCase()
            ).length === 0){
            req.users.push({
                id:req.body.id,
                pw:req.body.pw,
                role:"user"
            });
            fs.writeFileSync(
                'user.json',
                JSON.stringify(
                    {users:req.users}
                ),
                {encoding:"utf8"}
            );
            res.send({data:"ok"});
        }
        else res.status(200).send({});
    }
    else res.status(200).send({});
});

module.exports = app;