const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const config = require('../config');
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_KEY);

async function getAll(name) { const {data}=await supabase.from(name).select('*'); return data; }
async function setAll(name, val) { await supabase.from(name).delete().neq('id',''); if(val.length>0) await supabase.from(name).insert(val); }
async function findAll(name) { const {data}=await supabase.from(name).select('*').order('created_at',{ascending:false}); return data; }
async function findOne(name,field,val) { const {data}=await supabase.from(name).select('*').eq(field,val).single(); return data; }
async function insert(name,item) {
  item.id=Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  item.created_at=item.updated_at=new Date().toISOString();
  const {data}=await supabase.from(name).insert(item).select().single(); return data;
}
async function update(name,id,patch) {
  patch.updated_at=new Date().toISOString();
  const {data}=await supabase.from(name).update(patch).eq('id',id).select().single(); return data;
}
async function remove(name,id) { const {error}=await supabase.from(name).delete().eq('id',id); return !error; }
async function verifyAdminPassword(pw) {
  const {data}=await supabase.from('admin').select('password_hash').single();
  return bcrypt.compareSync(pw, data.password_hash);
}
async function changeAdminPassword(newPw) {
  const hash=bcrypt.hashSync(newPw,10);
  const {error}=await supabase.from('admin').update({password_hash:hash}).neq('id',0);
  if(error) await supabase.from('admin').insert({password_hash:hash});
}
async function init() {
  const {data}=await supabase.from('admin').select('*');
  if(!data||!data.length) {
    const hash=bcrypt.hashSync(config.ADMIN_PASSWORD,10);
    await supabase.from('admin').insert({password_hash:hash});
    console.log('✅ Admin siap');
  }
}
module.exports={init,getAll,setAll,findAll,findOne,insert,update,remove,verifyAdminPassword,changeAdminPassword};
