const task_Container = document.querySelector(".task_container");
console.log(task_Container);

//  Global Store
let globalStore = [];

const newCard = ({
    id,
    imageUrl,
    taskTitle,
    taskType,
    taskDescription,
}) => `<div class="col-md-6 col-lg-4 mt-4">
<div class="card" id=${id}>
    <div class="card-header d-flex justify-content-end gap-2">
        <button type="button"  class="btn btn-outline-success" onclick="editcard.apply(this, arguments)" id=${id}><i class="fas fa-pencil-alt" onclick="editcard.apply(this, arguments)" id=${id}></i></button>
        <button type="button" class="btn btn-outline-danger" onclick="deletecard.apply(this, arguments)" id=${id}><i class="fas fa-trash" onclick="deletecard.apply(this, arguments)" id=${id}></i></button>
    </div>
    <img src=${imageUrl}
class="card-img-top" alt="..." />
<div class="card-body">
<h5 class="card-title">${taskTitle}</h5>
<p class="card-text">${taskDescription}</p>
<span class="badge bg-primary">${taskType}</span>
</div>
    <div class="card-footer text-muted">
        <button type="button" class="btn btn-outline-primary float-end">Open Task</button>
    </div>
  </div>
</div>`;

const loadInitialTaskCards = () =>{
    //acess local storage
    const getInitialData  = localStorage.tasky;
    if(!getInitialData) return;
    //convert to stringify objects
    const { cards } = JSON.parse(getInitialData);
    //map around the array to generate HTML CARD and inject to DOM
    cards.map((card) =>{
        const createnewcard = newCard(card);
        task_Container.insertAdjacentHTML("beforeend",createnewcard);
        globalStore.push(card);
    });
};

const updateLocalStorage = () =>{
    localStorage.setItem("tasky", JSON.stringify({cards : globalStore }));
}

const savechanges = () => {
    const taskData = {
        id: `${Date.now()}`, //unique number for carrd id
        imageUrl: document.getElementById("imageurl").value,
        taskTitle: document.getElementById("tasktitle").value,
        taskType: document.getElementById("tasktype").value,
        taskDescription: document.getElementById("taskdescription").value,
    };

    const createnewcard = newCard(taskData);
    task_Container.insertAdjacentHTML("beforeend",createnewcard);
    globalStore.push(taskData);
    //add to local storage
    updateLocalStorage();
    
};

const deletecard = (event) =>{
    //id
    event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;
    //search the global store array /remove the object which matches with the id
    globalStore = globalStore.filter((cardObject) => cardObject.id !== targetID);
  
    updateLocalStorage();
    //access DOM to remove them

    if(tagname === "BUTTON"){
        return task_Container.removeChild(
            event.target.parentNode.parentNode.parentNode);
    }
    return task_Container.removeChild(
        event.target.parentNode.parentNode.parentNode.parentNode);
    };

    const editcard = (event) => {
        event = window.event;
    const targetID = event.target.id;
    const tagname = event.target.tagName;

    let parentElement;
        if(tagname === "BUTTON")
        {
            parentElement = event.target.parentNode.parentNode;
        }
        else{
            parentElement = event.target.parentNode.parentNode.parentNode;
        }

        let taskTitle = parentElement.childNodes[5].childNodes[1];
        let taskDescription = parentElement.childNodes[5].childNodes[3];
        let taskType = parentElement.childNodes[5].childNodes[5];
        let submitButton = parentElement.childNodes[7].childNodes[1];
        
        //setAtributes we use to edit method
        taskTitle.setAttribute("contenteditable","true");
        taskDescription.setAttribute("contenteditable","true");
        taskType.setAttribute("contenteditable","true");
        submitButton.innerHTML = "Save Changes";
    
    };
