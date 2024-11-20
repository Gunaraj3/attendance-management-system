

// export let compareDate=expressAsyncHandler(async(someDate)=>{
//     let dateNow=new Date()
//     let yearNow=dateNow.getFullYear()
//     let monthNow=dateNow.getMonth()+1
//     let dayNow=dateNow.getDate()
//     let Today=`${yearNow}-${monthNow}-${dayNow}`
//     let year=someDate.getFullYear()
//     let month=someDate.getMonth()+1
//     let day=someDate.getDate()
//     let date2=`${year}-${month}-${day}`
//     if(Today===date2)
//     return true
//     else
//     return false
//   })

export let dateNow = ()=> new Date().toISOString().split("T")[0]

export let matchDate=(rawString)=>new Date(rawString).toISOString()
