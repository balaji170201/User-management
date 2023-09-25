let url = `https://65111d32829fa0248e3f85b0.mockapi.io/Users`
let itemList = document.getElementById('itemList');

function createTableRow(value1,value2,value3,id){
    let tr = document.createElement('tr');

    let td1 = document.createElement('td');
    td1.setAttribute('id',`name${id}`);
    td1.innerHTML = value1;

    let td2 = document.createElement('td');
    td2.setAttribute('id',`email${id}`);
    td2.innerHTML = value2;

    let td3 = document.createElement('td');
    td3.setAttribute('id',`place${id}`);
    td3.innerHTML = value3;

    let td4 = document.createElement('td');
    td4.innerHTML = `
        <button type="button" onclick = "editById('${value1}','${value2}','${value3}','${id}')" class="btn btn-primary" data-toggle="modal" data-target='#exampleModal${id}' id='name${id}'>
        <i class="fa-solid fa-pen-to-square"></i></button>
        <button type="button" class="btn btn-danger id='delete${id}'" onclick="deleteUserData(${id})"><i class="fa-solid fa-trash"></i></button> `;

    tr.append(td1,td2,td3,td4);
    itemList.append(tr);
}

//Read
async function getUsersData(){
    let data = await fetch(url);
    let response = await data.json();
    //console.log(response);
    response.map((element) => {
        const {name,email,place,id} = element;   //destructuring
        console.log(element);
        createTableRow(name,email,place,id);
    })
}
getUsersData();

async function createUserData(){
    var nameInput = document.getElementById('nameInput');
    let nameValue = nameInput.value;

    var emailInput = document.getElementById('mailInput');
    let emailValue = emailInput.value;

    var placeInput = document.getElementById('placeInput');
    let placeValue = placeInput.value;

    if(nameValue != "" && emailValue != "" && placeValue != ""){    //create the data only when it is not empty
        console.log(nameValue,emailValue,placeValue);

        let newUser = {                                             //data should be passed as an object
            name : nameValue,
            email : emailValue,
            place : placeValue
        }
        
        let data = await fetch(url,{                                //fetch the url and add the method,headers and body
            method : "POST",
            headers : {"content-type" : "application/json"},        //JSON.stringify the object that is being passed
            body : JSON.stringify(newUser)
        });
        let newData = await data.json();

        getUserSpecificData(newData.id);                
    }
    else{
        alert("Enter the details");
    }
    
}

async function getUserSpecificData(id){            //createUserData function will only create the data in MOCK API
    let data = await fetch(url+"/"+id);           //To get that created data we use this function by passing that specific ID
    let response = await data.json();
    console.log(response);
    createTableRow(response.name,response.email,response.place,response.id);
}

//delete
async function deleteUserData(id){
    alert("Are you sure you want to delete it?");
    await fetch(url+"/"+id,{method : "DELETE"});
    itemList.innerHTML = "";                   //It deletes in the browser only when we refresh the browser but it's perfect in MOCK API
    getUsersData();                    //To avoid that we clear the enter table and then call the getUsersData to append everything back
}

//edit
const editById = (value1,value2,value3,id) => {

    var modal = document.createElement('span');
    modal.innerHTML = `
    
        <div class="modal fade" id='exampleModal${id}' tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Update User Details</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="editName${id}" class="col-form-label">Name:</label>
                    <input type="text" class="form-control" id="editName${id}" value=${value1}>
                </div>
                <div class="form-group">
                    <label for="editEmail${id}" class="col-form-label">Email:</label>
                    <input type="email" class="form-control" id="editEmail${id}" value=${value2}>
                </div>
                <div class="form-group">
                    <label for="editPlace${id}" class="col-form-label">City:</label>
                    <input type="text" class="form-control" id="editPlace${id}" value=${value3}>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary" onclick = "updateUserData(${id})">Save changes</button>
            </div>
            </div>
            
        </div>
        </div>
        `
    //modal.append(span);
    document.body.append(modal);
    
};

async function updateUserData(id){
    var modalName = document.getElementById('editName'+id).value;
    var modalMail = document.getElementById('editEmail'+id).value;
    var modalPlace = document.getElementById('editPlace'+id).value;

    let newData = {                                             //data should be passed as an object
        name : modalName,
        email : modalMail,
        place : modalPlace
    }
    
    let data = await fetch(url+"/"+id,{                                //fetch the url and add the method,headers and body
        method : "PUT",
        headers : {"content-type" : "application/json"},        //JSON.stringify the object that is being passed
        body : JSON.stringify(newData)
    });
    let updatedData = await data.json();
    console.log(updatedData);

    document.getElementById('name'+id).innerText = updatedData.name;    //changing the table contents by getting id
    document.getElementById('email'+id).innerText = updatedData.email;
    document.getElementById('place'+id).innerText = updatedData.place;
}