const url = "http://127.0.0.1:8000/api/tasks/";
let edit_mode = false;
let edit_id = null;

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
let csrftoken = getCookie('csrftoken');

async function list_data() {
    let data = await fetch(url);
    let data_json = await data.json();
    console.log(data_json);
    task_list = document.getElementById("task-wrapper");
    task_list.innerHTML = "";
    for (let i in data_json) {

        let task = '<div class="item">';
        task += "<p data-id=" + data_json[i]['id']  + ">" + data_json[i]['title'] + "</p>";
        task += '<button data-id="' + data_json[i]['id'] + '"class="btn btn-sm btn-outline-info edit">Edit</button>'
        task += '<button data-id="' + data_json[i]['id'] + '"class="btn btn-sm btn-danger delete">Delete</button>'
        task += "</div>"
        task_list.innerHTML += task;
        
        console.log(data_json[i]);
    } 
}

async function add_task() {
    let title = document.getElementById('task-input').value;
    console.log(title);
    try{
        let response = await fetch(url, {
                                method: 'POST',
                                headers: {
                                    'Content-type': 'application/json',
                                    'X-CSRFToken':csrftoken
                                },
                                body:JSON.stringify({'title':title})
        });
    }
    catch(e) {
        console.log(e);
    }
}

function attach_delete_functionality(){
    let delete_buttons = document.getElementsByClassName("delete");
    console.log(delete_buttons.length);
    for(let i=0; i<delete_buttons.length; i++){
        delete_buttons[i].addEventListener('click', function() 
        { delete_item(delete_buttons[i].getAttribute('data-id')) });
    }
}

function attach_edit_functionality(){
    let edit_buttons = document.getElementsByClassName("edit");
    for(let i=0; i<edit_buttons.length; i++){
        edit_buttons[i].addEventListener('click', () => {
            on_edit_click(edit_buttons[i].getAttribute('data-id'));
        });
    }
}

function on_edit_click(id){
    task_input = document.getElementById('task-input');
    task_input.placeholder = document.querySelector(`p[data-id="${id}"]`).textContent;
    edit_mode = true;
    button = document.querySelector('#task-form button');
    button.innerHTML = 'Update';
    edit_id = id;
}

async function delete_item(id){
    try{
        let response = await fetch(url + id + '/', {
                        method: 'DELETE',
                        headers: {
                            'Content-type': 'application/json',
                            'X-CSRFToken': csrftoken,
                        }
        });
        list_data().then(() => attach_delete_functionality());
    }
    catch(e) {
        console.log(e);
    }
}

async function edit_item(id, title){
    try{
        console.log(url + id);
        let response = await fetch(url + id + '/', {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken
            },
            body: JSON.stringify({"title":title})    
        });
        console.log(response);
    }
    catch(e){
        console.log(e);
    }
}

function main(){
    list_data().then(() => {
        attach_delete_functionality();
        attach_edit_functionality();
    });
    let form = document.getElementById("form-wrapper");
    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        if(!edit_mode){
                            add_task().then(() => {
                                list_data().then(() => {
                                    attach_delete_functionality();
                                    attach_edit_functionality();
                                });
                                document.getElementById("task-form").reset();
                            });
                        }
                        else{
                            let new_title = document.getElementById('task-input').value;
                            edit_item(edit_id, new_title).then(() => {
                                list_data().then(() => {
                                    attach_edit_functionality();
                                    attach_delete_functionality();
                                    }
                                )
                            }
                            );
                            };                            
                        }
                    );
                        
}
     



main();

