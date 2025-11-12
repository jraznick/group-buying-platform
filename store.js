import { v4 as uuid } from 'uuid';
export const db={users:[],merchants:[],deals:[],tiers:[],orders:[]};
(function seed(){const dealId=uuid();const now=new Date();const ends=new Date(Date.now()+1000*60*60*6);
db.deals.push({id:dealId,title:'Wireless Earbuds – Group Deal',description:'Save more as more people join.',currency:'usd',base_price_cents:6900,min_group_size:10,max_group_size:100,starts_at:now.toISOString(),ends_at:ends.toISOString(),state:'published',created_at:now.toISOString(),updated_at:now.toISOString()});
db.tiers.push({id:uuid(),deal_id:dealId,threshold:10,price_cents:5900});
db.tiers.push({id:uuid(),deal_id:dealId,threshold:25,price_cents:5400});
db.tiers.push({id:uuid(),deal_id:dealId,threshold:50,price_cents:4900});})();
export function ordersForDeal(d){return db.orders.filter(o=>o.deal_id===d&&['reserved','authorized','captured'].includes(o.status));}
export function activeTierPrice(d){const deal=db.deals.find(x=>x.id===d);const tiers=db.tiers.filter(t=>t.deal_id===d).sort((a,b)=>a.threshold-b.threshold);const size=ordersForDeal(d).reduce((n,o)=>n+(o.quantity||1),0);const unlocked=tiers.filter(t=>t.threshold<=size).sort((a,b)=>b.threshold-a.threshold)[0];return {size,price_cents:unlocked?unlocked.price_cents:deal.base_price_cents};}
