import {Router} from 'express';
import pool from '../config/db.js';
import {authenticate} from '../middleware/auth.js';
const router=Router();
router.post('/',authenticate,async(req,res,next)=>{
 const connection=await pool.getConnection();
 try{
  const {eventId}=req.body;
  await connection.beginTransaction();
  const [events]=await connection.query('SELECT id,ticket_price,status FROM events WHERE id=? FOR UPDATE',[eventId]);
  if(!events.length||events[0].status!=='published') {await connection.rollback();return res.status(404).json({message:'Event not available'});}
  const event=events[0];const total=Number(event.ticket_price);
  const [result]=await connection.query('INSERT INTO bookings(user_id,event_id,quantity,total_amount,status) VALUES(?,?,?,?,?)',[req.user.id,eventId,1,total,'confirmed']);
  await connection.query('INSERT INTO payments(booking_id,amount,payment_method,status,transaction_ref) VALUES(?,?,?,?,?)',[result.insertId,total,'demo','paid',`DEMO-${Date.now()}`]);
  await connection.commit();res.status(201).json({message:'Event booking confirmed',booking:{id:result.insertId,total,status:'confirmed'}});
 }catch(e){await connection.rollback();next(e);}finally{connection.release();}
});
router.get('/mine',authenticate,async(req,res,next)=>{try{const [rows]=await pool.query('SELECT b.id,b.quantity,b.total_amount,b.status,b.created_at,e.title,e.event_date,e.location FROM bookings b JOIN events e ON e.id=b.event_id WHERE b.user_id=? ORDER BY b.created_at DESC',[req.user.id]);res.json({bookings:rows});}catch(e){next(e);}});
export default router;
