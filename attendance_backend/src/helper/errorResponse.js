export let errorResponse = ({res,message,statusCode})=>{
    res.status(statusCode).json({
        success:false,
        message,
       
    })
}