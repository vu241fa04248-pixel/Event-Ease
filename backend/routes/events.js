import {Router} from 'express';
import {body,validationResult} from 'express-validator';
import pool from '../config/db.js';
import {authenticate,allowRoles} from '../middleware/auth.js';
const router=Router();
router.get('/',async(req,res,next)=>{try{const [events]=await pool.query(`SELECT e.id,e.title,e.description,e.category,e.event_date AS date,e.event_time AS time,e.location,e.ticket_price AS price,e.image_url AS image,u.name AS organizer FROM events e JOIN users u ON u.id=e.organizer_id WHERE e.status='published' ORDER BY e.event_date ASC`);res.json({events});}catch(e){next(e);}});
router.get('/:id',async(req,res,next)=>{try{const [rows]=await pool.query('SELECT * FROM events WHERE id=? AND status=?',[req.params.id,'published']);if(!rows.length)return res.status(404).json({message:'Event not found'});res.json({event:rows[0]});}catch(e){next(e);}});
router.post('/',authenticate,allowRoles('organizer','admin'),[body('title').trim().notEmpty(),body('date').isDate(),body('location').trim().notEmpty(),body('price').isFloat({min:0})],async(req,res,next)=>{
 try{if(!validationResult(req).isEmpty())return res.status(400).json({message:'Please provide a valid title, date, location and event budget'});
 const {title,description,category,date,time,location,price,image}=req.body;
 const [result]=await pool.query('INSERT INTO events(organizer_id,title,description,category,event_date,event_time,location,ticket_price,image_url,status) VALUES(?,?,?,?,?,?,?,?,?,?)',[req.user.id,title,description,category,date,time,location,price,image||null,'published']);
 res.status(201).json({message:'Event created',eventId:result.insertId});
 }catch(e){next(e);}
});
export default router;
