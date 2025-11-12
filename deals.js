import { Router } from 'express';
import { db, activeTierPrice } from '../store.js';
const r=Router();
r.get('/',(req,res)=>{const now=new Date();const state=req.query.state||'published';const deals=db.deals.filter(d=>d.state===state&&new Date(d.starts_at)<=now&&new Date(d.ends_at)>=now);res.json(deals.map(d=>{const {size,price_cents}=activeTierPrice(d.id);const tiers=db.tiers.filter(t=>t.deal_id===d.id).sort((a,b)=>a.threshold-b.threshold);return {...d,progress:{size,current_price_cents:price_cents,tiers}};}));});
r.get('/:id',(req,res)=>{const d=db.deals.find(x=>x.id===req.params.id);if(!d)return res.status(404).json({error:'Deal not found'});const {size,price_cents}=activeTierPrice(d.id);const tiers=db.tiers.filter(t=>t.deal_id===d.id).sort((a,b)=>a.threshold-b.threshold);const remaining=Math.max(0,Math.ceil((new Date(d.ends_at)-new Date())/1000));res.json({...d,tiers,progress:{size,current_price_cents:price_cents,seconds_left:remaining}});});
export default r;
