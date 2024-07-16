import axios from "axios";

export const commonApi = async (method,url,body,headers)=>{
    const urlConfig={
        method,
        url,
        data:body,
        headers:headers?headers:{'Content-Type':'application/json'}
    }

    return await axios(urlConfig).then(res =>{return res}).catch(err=>{return err})
}