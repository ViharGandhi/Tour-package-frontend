import { Client, Storage,ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(`${import.meta.env.VITE_PROJECT_ID}`);

const storage = new Storage(client);

const Storefile = async (data)=>{
    const promise = await storage.createFile(
        `${import.meta.env.VITE_BUCKETT_ID}`,
        ID.unique(),
        data
    );
   
   return promise.$id
  
          
}
export const Getfileurl = async(id)=>{
    const result =  await storage.getFileView(`${import.meta.env.VITE_BUCKETT_ID}`,id)
    
    return result
}
export default Storefile
