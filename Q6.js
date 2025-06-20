var express = require('express');
var router = express.Router();
const mysql = require('mysql2/promise')
const database = mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'Gg200502171310',
    database:'DogWalkService',
})

router.get('/',function(req,res,next){
    res.render('index', {title:'Express'})
})

router.get('/api/dogs', async(req,res) {
    try{
        const sql=`SELECT d.name AS dog_name, d.size, u.username AS owner_username 
        From Dogs AS d
        LEFT JOIN Users AS u ON u.user_id = d.owner_id`;
        const [rows] = await db.query(query);
        if(rows.length === 0){
            return res.status(404).json({error:'not found' });
        }
        res.json(rows); 
    }catch(err){
        res.status(500).json({error: e.toString()})
    }
});