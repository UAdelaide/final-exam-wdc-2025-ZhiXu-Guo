router.get('/api/walkrequests/open', async(req, res){
    try{
        const query = `SELECT d.name AS dog_name, wr.request_id, wr.requested_time, wr.duration_minutes,
        wr.location, u.username AS owner_username FROM WalkRequest AS wr
        LEFT JOIN Dogs AS d ON d.dog_id = wr.dog_id 
        LEFT JOIN Users AS u ON u.user_id = d.owner_id WHERE wr.status = 'open'`
        const [rows] = await db.query(query);
        res.json(rows); 
    }catch(err){
        res.status(500).json({error: e.toString()})
    }
})