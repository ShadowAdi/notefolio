import axios from "axios"

export const GetUser=async ()=>{
    try {
        await axios.get(`http://localhost:3000/api/user`)
    } catch (error) {
        
    }
}