import { createClient } from "@supabase/supabase-js";

const url = "https://tonolaeymuuycnfkzzkv.supabase.co";
const key = "sb_publishable_4OUIgTc3fG65fLANLG8hjQ_bJWq_wsC";

const supabase = createClient(url,key);

export default function mediaUpload(file){
    const mediaUploadPromise = new Promise(
        (resolve, reject)=>{
            if(file == null){
                reject("No file selected")
                return;
            }
            const timestamp = new Date().getTime()
            const newName = timestamp+file.name;

            supabase.storage.from("images").upload(newName, file, {
                upsert:false,
                cacheControl:"3600"
            }).then(()=>{
                const publicUrl = supabase.storage.from("images").getPublicUrl(newName).data.publicUrl
                resolve(publicUrl);
            }).catch(
                (e)=>{
                    reject("Error occured in supabase connection")
                }
            )
        }
    )

    return mediaUploadPromise
}

