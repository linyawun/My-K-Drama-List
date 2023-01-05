import {localLoginChecker, sweetAlert, sweetAlertToast, toggleLoading} from './util.js';
function addList(list, dramaId){
    const userId = parseInt(localStorage.getItem('userId'));
    const token = localStorage.getItem('token');
    const listName = list=='lovelists'? '最愛清單' : '待看清單';
    toggleLoading();
    axios.post(`http://localhost:3001/600/${list}`,{
        "dramaId": dramaId,
        "userId": userId
    },{
        headers:{
          "authorization": `Bearer ${token}`
        }
    })
    .then((response)=>{
        sweetAlertToast(`已加入${listName}`, "success", 2000);
        //sweetAlert(`已加入${listName}`, "success")
        //alert(`已加入${listName}`);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
       
    })
    .catch((error)=>{
      if (error?.response?.status === 401) {
        // localStorage.removeItem('myCat');
        sweetAlert('登入逾時，請重新登入', 'warning');
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
      console.log(error.response);
    })
    .finally(()=>{
      toggleLoading();
    })
  }
  function removeList(list, dramaId){
    const userId = parseInt(localStorage.getItem('userId'));
    const token = localStorage.getItem('token');
    const listName = list=='lovelists'? '最愛清單' : '待看清單'
    let id;
    //取得要刪除那篇的id
    toggleLoading();
    axios.get(`${baseUrl}/600/users/${userId}/${list}?dramaId=${dramaId}`
    ,{
      headers:{
          "authorization": `Bearer ${token}`
      }
    })
    .then((res)=>{
        id = res.data[0].id;
        //console.log(res.data[0].id)
        //delete該篇
        axios.delete(`${baseUrl}/600/${list}/${id}`,{
          headers:{
            "authorization": `Bearer ${token}`
          }
        })
        .then((response)=>{
            sweetAlertToast(`已從${listName}刪除`, "success", 2000);
            setTimeout(() => {
              window.location.reload();
            }, 1000);
            // alert(`已從${listName}刪除`);
            // window.location.reload();
        })
        .catch((error)=>{
          if (error?.response?.status === 401) {
            sweetAlert('登入逾時，請重新登入', 'warning');
            localStorage.clear();
            setTimeout(() => {
              window.location.reload();
            }, 1200);
          }
          console.log(error.response);
        })
    })
    .catch((error)=>{
      if (error?.response?.status === 401) {
        sweetAlert('登入逾時，請重新登入', 'warning');
        //alert('登入逾時，請重新登入');
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      }
      console.log(error);
    })
    .finally(()=>{
      toggleLoading();
    })
  
  }
export function updateList(e){
    if(e.target.hasAttribute('data-id')==false){
      return
    }
    
    if(localLoginChecker()==null){
      sweetAlert('請先登入', 'warning');
      //alert('請先登入');
      return 
    }
  
    const dramaId = parseInt(e.target.getAttribute('data-id'));
    
    if(e.target.hasAttribute('data-love')){
      e.preventDefault();
      if(e.target.getAttribute('data-love')=='symbols-fill'){
        removeList('lovelists', dramaId);
      }else{
        addList('lovelists', dramaId);
      }
      return
    }
  
    if(e.target.hasAttribute('data-wish')){
      e.preventDefault();
      if(e.target.getAttribute('data-wish')=='done'){
        removeList('wishlists', dramaId);
      }else{
        addList('wishlists', dramaId);
      }
      return
    }
  }