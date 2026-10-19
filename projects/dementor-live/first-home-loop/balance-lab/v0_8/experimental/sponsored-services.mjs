// WORLD ORGANISM 0.8.2 SHADOW ONLY — finite citizen-funded public sessions.
// A citizen authorizes a real civic service; two physical deliverables have
// reserved supplier payouts, with a small municipal coordination fee reserved
// separately until BOTH are fulfilled. No sale, ticket or municipal fee is
// a claim that this mechanism exists in the live game.
export const SESSION_CONTRACT=Object.freeze({
  menu:Object.freeze([{asset:'PAPER_SHEET',quantity:1,unitPrice:12},
    {asset:'CARROT',quantity:1,unitPrice:3}]),
  municipalFee:2,
  price:17,
});
const invariant=(v,label)=>{if(!v)throw Error(label);};
const owner=(s,id)=>s.players.find(p=>p.id===id);
export function openSponsoredSession(s,{eventId,facility,sponsorId,actorId,accepted=false,at=s.day,expiresIn=14}){
  invariant(s.services instanceof Array,'missing service register');
  invariant(typeof eventId==='string'&&eventId.length>4,'bad service event ID');
  invariant(typeof facility==='string'&&facility.length>0,'bad service facility');
  invariant(actorId===sponsorId,'caller must be the account holder');
  invariant(accepted===true,'explicit sponsor consent required');
  const old=s.services.find(v=>v.id===eventId);
  if(old)return old; // exact replay must not charge again
  const sponsor=owner(s,sponsorId);
  invariant(sponsor,'sponsor is not a registered player');
  if(sponsor.wallet<SESSION_CONTRACT.price)return null;
  // One authorization debits exactly 17, held as 15 supplier escrow + 2 fee escrow.
  sponsor.wallet-=SESSION_CONTRACT.price;
  const service={id:eventId,facility,sponsorId,
    status:'OPEN',at,items:[],orderIds:[],serviceFeeEscrow:SESSION_CONTRACT.municipalFee,
    feePaid:0,delivered:0,utility:0,refunded:0};
  for(const item of SESSION_CONTRACT.menu){
    const amount=item.quantity*item.unitPrice;
    const order={id:'D'+String(s.nextOrder++).padStart(6,'0'),
      referenceEvent:eventId,asset:item.asset,quantity:item.quantity,
      remaining:item.quantity,filled:0,unitPrice:item.unitPrice,escrow:amount,
      status:'OPEN',postedAt:at,expiresAt:at+expiresIn,
      paidBy:'citizen',serviceId:eventId,sponsorId};
    s.orders.push(order);service.items.push(item.asset);
    service.orderIds.push(order.id);
  }
  s.services.push(service);
  s.postedEvents.push(eventId);
  s.ledgerEvents++;
  return service;
}
export const serviceFeeEscrow=s=>(s.services||[]).reduce((n,v)=>n+v.serviceFeeEscrow,0);
export function onSponsoredDelivery(s,order){
  if(order.paidBy!=='citizen')return;
  const service=s.services.find(v=>v.id===order.serviceId);
  invariant(service&&service.status==='OPEN','delivery without a pending citizen authorization');
  service.delivered++;
  service.utility++; // each physical delivered good was consumed in its identified public session
  if(service.orderIds.every(id=>s.orders.find(o=>o.id===id)?.status==='FILLED')){
    const earned=service.serviceFeeEscrow;
    service.serviceFeeEscrow=0;service.feePaid=earned;
    s.city+=earned;s.servicesRevenue+=earned;
    service.status='COMPLETE';
    s.ledgerEvents++;
  }
}
export function onSponsoredExpiry(s,order,refunded){
  if(order.paidBy!=='citizen')return;
  const service=s.services.find(v=>v.id===order.serviceId);
  invariant(service,'missing service escrow on order expiry');
  const sponsor=owner(s,service.sponsorId);
  invariant(sponsor,'missing original sponsor for refund');
  sponsor.wallet+=refunded;
  service.refunded+=refunded;
  if(service.orderIds.every(id=>s.orders.find(o=>o.id===id)?.status!=='OPEN')){
    invariant(service.status==='OPEN','service closed twice');
    sponsor.wallet+=service.serviceFeeEscrow;
    service.refunded+=service.serviceFeeEscrow;
    service.serviceFeeEscrow=0;
    service.status=service.delivered===0?'EXPIRED':'PARTIAL';
    s.ledgerEvents++;
  }
}
export function validateServices(s){
  let revenue=0;
  for(const v of (s.services||[])){
    invariant(['OPEN','COMPLETE','EXPIRED','PARTIAL'].includes(v.status),'bad public service state');
    invariant(Number.isSafeInteger(v.serviceFeeEscrow)&&v.serviceFeeEscrow>=0,'invalid fee escrow');
    invariant(v.orderIds.length===SESSION_CONTRACT.menu.length,'missing service order');
    invariant(new Set(v.orderIds).size===v.orderIds.length,'service order replay duplicated');
    const orders=v.orderIds.map(id=>s.orders.find(o=>o.id===id));
    invariant(orders.every(o=>o&&o.serviceId===v.id&&o.sponsorId===v.sponsorId),'escrow order mismatch');
    invariant(v.delivered===orders.reduce((n,o)=>n+o.filled,0),
      'delivered item ledger mismatch');
    if(v.status==='COMPLETE'){
      invariant(orders.every(o=>o.status==='FILLED')&&v.serviceFeeEscrow===0,'fee paid for incomplete service');
    }
    if(v.status==='PARTIAL'||v.status==='EXPIRED')
      invariant(orders.every(o=>o.status!=='OPEN')&&v.serviceFeeEscrow===0,'closed service still has reserved fee');
    revenue+=v.feePaid;
  }
  invariant((s.servicesRevenue||0)===revenue,'unaccounted municipal service fee');
  return true;
}
