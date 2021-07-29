const taskContainer= document.querySelector(".task__container");
const modalContainer = document.querySelector(".openModalBody");

//global store
let GlobalStore = [];

const newCard = ({
  id,
  imageUrl,
  taskTitle,
  taskDescription,
  taskType,
}) => `<div class="col-md-6 col-lg-4" id=${id}>
<div class="card">
  <div class="card-header d-flex justify-content-end gap-2">
    <button type="button" id=${id} class="btn btn-outline-success" onclick="editCard.apply(this, arguments)">
      <i class="fas fa-pencil-alt" id=${id} onclick="editCard.apply(this, arguments)" ></i>
    </button>
    <button type="button" id=${id} class="btn btn-outline-danger" onclick="deleteCard.apply(this, arguments)">
      <i class="fas fa-trash-alt" id=${id} onclick="deleteCard.apply(this, arguments)"></i>
    </button>
  </div>
  <img
    src=${imageUrl}
    class="card-img-top"
    alt="..."
  />
  <div class="card-body">
    <h5 class="card-title">${taskTitle}</h5>
    <p class="card-text">
      ${taskDescription}
    </p>
    <span class="badge bg-primary">${taskType}</span>
  </div>
  <div class="card-footer text-muted">
    
    <button type="button" id=${id} class="btn btn-outline-primary float-end">
      Open Task
    </button>
  </div>
</div>
</div>`;

const openTaskBody=({ imgUrl, taskTitle, taskType,taskDes}) =>`<div class="mb-3 img__Container">
<img src="${imgUrl}" style="width:450px; heigth:450px;" alt="picture"/>
</div>
<div class="mb-3 title__Container">
<h1>${taskTitle}</h1>
</div>
<div class="mb-3 title__Des">
<p> ${taskDes} </p>
</div>
<div class="mb-3 badge__Container">
<span class="badge bg-primary">${taskType}</span>
</div>`;


const updateLocalStorage =() => localStorage.setItem("tasky", JSON.stringify({cards: GlobalStore}));

const loadInitialCardData =() =>{
  const getInitialData = localStorage.tasky;
  if(!getInitialData)return;

  const {cards} = JSON.parse(getInitialData);

  cards.map((card) =>{
    const createNewCard = newCard(card);

  taskContainer.insertAdjacentHTML("beforeend",createNewCard);
  GlobalStore.push(card);

  });
};


const saveChanges = () =>{
    const taskdata={
        id: `${Date.now()}`, //unique id genration
        imgUrl:document.getElementById("imgurl").value,
        taskTitle:document.getElementById("tasktitle").value,
        taskType:document.getElementById("tasktype").value,
        taskDes:document.getElementById("taskdes").value,
    };

    console.log(taskdata);
    const createNewCard = newCard(taskdata);

taskContainer.insertAdjacentHTML("beforeend",createNewCard);
GlobalStore.push(taskdata);
updateLocalStorage();


};




const deleteCard =(event) =>{
  //id
  event = window.event;
  const targetId = event.target.id;
  const tagname = event.target.tagName;
  //search globalStore array

  GlobalStore = GlobalStore.filter(
    (card) => card.id !== targetId
  );
  updateLocalStorage();
 // window.location.reload(true);


  // access DOM to remove them

  if (tagname === "BUTTON") {
    // task__container
    return taskContainer.removeChild(
      event.target.parentNode.parentNode.parentNode // col-lg-4
    );
  }

  // task__container
  return taskContainer.removeChild(
    event.target.parentNode.parentNode.parentNode.parentNode // col-lg-4
  );


};



//Edit

const editCard =(event) =>{

  event = window.event;
  tagname= event.target.tagName;

  //make fields editable
  let parent;

  if (tagname === "BUTTON") {
    // task__container
    
     parent= event.target.parentNode.parentNode.parentNode // col-lg-4
    
  }else{ parent= event.target.parentNode.parentNode.parentNode.parentNode};
  const cardBody=parent.querySelector('#cardBody');
  var fields=cardBody.querySelectorAll(".editable");

  for(let i= 0; i<fields.length; i++){
    fields[i].setAttribute("contenteditable","true");
  }

  //transform open task button to save changes button

  saveButton = parent.querySelector(".card-footer").querySelector("button");
  saveButton.setAttribute("onClick","esaveChanges.apply(this, arguments)");
  saveButton.setAttribute("data-bs-toggle", "");
  saveButton.setAttribute("data-bs-target","");

  saveButton.textContent="save Changes";
};


//save changes after editting

const esaveChanges=(event) =>{
  event = window.event;
  const targetId = event.target.id;
  const targetname = event.target.tagName;

  //make fields non editable
  const parent= event.target.parentNode.parentNode;
  console.log(parent);
  const cardBody=parent.querySelector('#cardBody');
  
  var fields=cardBody.querySelectorAll(".editable");

  for(let i= 0; i<fields.length; i++){
    fields[i].setAttribute("contenteditable","false");
  };

  //save changes

  ctaskTitle = cardBody.querySelector(".card-title").textContent;
  ctaskDes = cardBody.querySelector(".card-text").textContent;
  ctaskType = cardBody.querySelector(".badge").textContent;

  GlobalStore.forEach((card)=>{
  if(card.id == targetId){
    console.log("got in the if block.")
    card.taskTitle =ctaskTitle;
    card.taskType =ctaskType;
    card.taskDes = ctaskDes;
    console.log(card);
  };
  })

  console.log(GlobalStore);
  updateLocalStorage();

  //change button back to Open Task
  openButton = parent.querySelector(".card-footer").querySelector("button");
  openButton.setAttribute("onClick","opentask.apply(this, arguments)");
  saveButton.setAttribute("data-bs-toggle", "modal");
  saveButton.setAttribute("data-bs-target","#openModal");

  openButton.textContent="Open task";
};


const opentask=(event) =>{
  event = window.event;
  const targetId = event.target.id;
  const parent= event.target.parentNode.parentNode;
  const cardBody=parent.querySelector('#cardBody');

  const opentaskobj ={
    imgUrl: cardBody.querySelector(".card-img-top").getAttribute('src'),
    taskTitle: cardBody.querySelector(".card-title").textContent,
    taskType: cardBody.querySelector(".badge").textContent,
    taskDes: cardBody.querySelector(".card-text").textContent,
  }

  const modalContext= openTaskBody(opentaskobj);
  console.log(opentaskobj);

  modalContainer.insertAdjacentHTML("beforeend",modalContext);
  console.log(modalContainer);

};