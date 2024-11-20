export let findIndex=(content,contentArr)=>{
    for(let i=0;i<contentArr.length;i++) {
      if(contentArr[i]==content)
      return i
    }
  }
  export function deleteElementByIndex(array, index) {
    if (index < 0 || index >= array.length) {
      return array; 
    }
  
    array.splice(index, 1); // Remove the element at the specified index
  
    return array.filter((element) => element !== undefined);
  }