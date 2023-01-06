export function listenFormInput(form, constraints){//監聽input輸入是否符合規定
    const inputs = form.querySelectorAll("input[name]");
    inputs.forEach((item)=>{
      item.addEventListener('change',function(e){
        let itemName = item.getAttribute('name');
        form.querySelector(`[data-message=${itemName}]`).textContent = '';//先將錯誤訊息清空
        const errors = validate(form, constraints, {fullMessages: false}) || '';
        if(errors){//如果error有值，將error訊息印出
          renderFormError(form, errors);
        }
      })
    })
}

export function renderFormError(form, errors){//印出錯誤訊息
    Object.keys(errors).forEach((key)=>{
      form.querySelector(`[data-message=${key}]`).textContent = errors[key];
    })
}
