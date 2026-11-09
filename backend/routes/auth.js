import {Router} from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {body,validationResult} from 'express-validator';
import pool from '../config/db.js';
const router=Router();
const issue=(user)=>jwt.sign({id:user.id,email:user.email,role:user.role},process.env.JWT_SECRET,{expiresIn:'7d'});
router.post('/register',[body('name').trim().notEmpty(),body('email').isEmail(),body('password').isLength({min:6})],async(req,res,next)=>{
 try{const errors=validationResult(req);if(!errors.isEmpty())return res.status(400).json({message:'Enter a valid name, email and password (minimum 6 characters)'});
 const {name,email,password}=req.body;const [exists]=await pool.query('SELECT id FROM users WHERE email=?',[email]);if(exists.length)return res.status(409).json({message:'Email is already registered'});
 const hash=await bcrypt.hash(password,12);const [result]=await pool.query('INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,?)',[name,email,hash,'attendee']);
 const user={id:result.insertId,name,email,role:'attendee'};res.status(201).json({user,token:issue(user)});
 }catch(e){next(e);}
});
router.post('/login',async(req,res,next)=>{
 try{const {email,password}=req.body;const [rows]=await pool.query('SELECT id,name,email,password_hash,role FROM users WHERE email=?',[email]);if(!rows.length||!await bcrypt.compare(password||'',rows[0].password_hash))return res.status(401).json({message:'Incorrect email or password'});
 const {password_hash,...user}=rows[0];res.json({user,token:issue(user)});
 }catch(e){next(e);}
});
export default router;
