const get=(name:string)=>(globalThis as any).Deno?.env.get(name) ?? (typeof process!=='undefined'?process.env[name]:undefined);
import {SupabaseStore} from './supabase-store';
export const env={
 MUM_OPENROUTER_KEY:get('MUM_OPENROUTER_KEY'),
 MUM_OPENROUTER_MODEL:get('MUM_OPENROUTER_MODEL') || 'openai/gpt-4.1-mini',
 MUM_USER_ID:get('MUM_USER_ID'),
 MUM_PASSPHRASE_HASH:get('MUM_PASSPHRASE_HASH'),
 MUM_SESSION_SECRET:get('MUM_SESSION_SECRET'),
 MUM_ULTRAHUMAN_TOKEN:get('MUM_ULTRAHUMAN_TOKEN'),
 MUM_ULTRAHUMAN_USER_ID:get('MUM_ULTRAHUMAN_USER_ID'),
 DB:get('MUM_SUPABASE_URL')&&get('MUM_SUPABASE_KEY')&&get('MUM_STORAGE_SECRET')?new SupabaseStore(get('MUM_SUPABASE_URL')!,get('MUM_SUPABASE_KEY')!,get('MUM_STORAGE_SECRET')!) as any:undefined,
};
