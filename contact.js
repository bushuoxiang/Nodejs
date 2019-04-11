var contactList = $('#contact-list')

var addContactButton = $('#add-contact-button')
var addContactModel = $('#add-contact-model')
var addContactSubmit = $('#add-contact-submit')
var addContactNameInput = $('#add-contact-name')
var addContactphoneNumber = $('#add-contact-phoneNumber')


var addEventListener = function(){
    var removeBtn = $('.remove-btn')
    removeBtn.on('click',function(){
        console.log($(this).attr('data_id'))
        removeContact($(this).attr('data_id'))
    })
}

var fillData = function(arr){
    var html=''
    arr.forEach(element => {
        html+=`
        <li class="list-group-item">
        <h3>${element.name}</h3> 
        <p>${element.phoneNumber}</p>
        <div class="btn-group" role="group" aria-label="...">
                <a type="button" href="tel:${element.phoneNumber}" class="btn btn-default">拨打号码</a>
                <button  type="button" class="btn btn-default" >修改联系人</button>
                <button type="button" class="btn btn-default remove-btn"data_id="${element._id}">删除联系人</button>
              </div>
    </li>`
    })
    contactList.html(html)
    addEventListener()
}
var getAllContact = function(){
    $.ajax(
        {
            type:'GET',
            url:'/getAllContact',
            data:{},
            success:function(result){
                //获取到数据之后填充数据
                fillData(result)

            }
        }
    )
}
//添加联系人
addContact = function(name,phoneNumber){
    $.ajax({
        type:'POST',
        url:'/addContact',
        data:{
            name:name,
            phoneNumber:phoneNumber
        },
        success:function(result){
            //添加完之后重新获取全部联系人的方法
            getAllContact()
        }
    })
}
//删除联系人
var removeContact = function(_id){
    $.ajax({
        type:'GET',
        url:'/removeContact',
        data:{
            _id:_id
        },success:function(){
            getAllContact()
        }
    })
}
var initListener = function(){
    addContactButton.on ('click',function(){
        addContactModel.modal('show')
    })
    addContactSubmit.on('click',function(){
        var name = addContactNameInput.val()
        addContactNameInput.val('')
        var phoneNumber = addContactphoneNumber.val()
        addContactphoneNumber.val('')
        addContact(name,phoneNumber)
        addContactModel.modal('hide')
    })
    
}
var main = function(){
    getAllContact()
    initListener()
}
main()