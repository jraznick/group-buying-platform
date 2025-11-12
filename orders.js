import { Router } from 'express';
import { db, activeTierPrice } from '../store.js';
import { v4 as uuid } from 'uuid';
const r=Router();
r.post('/:dealId/join',(req,res)=>{const deal=db.deals.find(d=>d.id===req.params.dealId);if(!deal)return res.status(404).json({error:'Deal not found'});const now=new Date();if(now<new Date(deal.starts_at)||now>new Date(deal.ends_at)||deal.state!=='published'){return res.status(400).json({error:'Deal not active'});}const userId=(req.body&&req.body.user_id)||'demo-user';const quantity=(req.body&&req.body.quantity)||1;const order={id:uuid(),deal_id:deal.id,user_id:userId,quantity,price_cents:null,status:'authorized',created_at:now.toISOString(),updated_at:now.toISOString()};db.orders.push(order);const {size,price_cents}=activeTierPrice(deal.id);res.status(201).json({order_id:order.id,group_size:size,current_price_cents:price_cents});});
export default r;
