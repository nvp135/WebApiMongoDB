const uri = 'api/Books';
let books = [];
const jsonFields = [];
const jsonHiddenFields = ['Id'];

function getItems() {
    fetch(uri)
    .then(response => response.json())
    .then(data => _displayItems(data))
    .then(() => createAddForm())
    .then(() => createEditForm())
    .catch(error => console.log(`Unable to get items. ${error}`));  
}

function addItem() {
    let item = { };
    console.log(jsonFields.length);

    for(let key in jsonFields) {
        item[key] = document.getElementById(`add${key}`)?.value.trim();
    }

    fetch (uri, {
        method: 'POST',
        headers: {
            'Accept': 'Application/json',
            'Content-Type': 'Application/json'
        },
        body: JSON.stringify(item)
    })
    .then(response => response.json())
    .then(() => getItems())
    .catch(error => console.error(`Unable to add Item. ${error}`));

    jsonFields.forEach(field => document.getElementById(`add${field}`)?.setAttribute('value', ''));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
    .then(() => getItems())
    .catch(error => console.log(`Unable to delete Item. ${error}`));
}

function createForm(inputPostfix = '') {
    let form = document.createElement('form');
    for(const key in jsonFields) {
        let input = document.createElement('input');
        input.type = jsonFields[key];
        input.id = `${inputPostfix}${key}`;
        form.appendChild(input);
    }
    return form;
}

function createAddForm() {
    let addFormDiv = document.getElementById('addFormDiv');
    addFormDiv.innerHTML = '';
    let text = document.createElement('h3');
    text.innerText = 'Add';
    addFormDiv.appendChild(text);
    let form = createForm('add');
    form.setAttribute('action', 'javascript:void(0);');
    form.setAttribute('onsubmit', 'addItem()');
    form.setAttribute('method', 'POST');
    let submit = document.createElement('input');
    submit.type ='submit';
    submit.value='Add';
    form.appendChild(submit);

    addFormDiv.appendChild(form);

}

function createEditForm() {
    let editFormDiv = document.getElementById('editFormDiv');
    editFormDiv.innerHTML = '';
    editFormDiv.style.display = 'none';
    let text = document.createElement('h3');
    text.innerText = 'Edit';
    editFormDiv.appendChild(text);
    let form = createForm();
    form.setAttribute('action', 'javascript:void(0);');
    form.setAttribute('onsubmit', 'updateItem()');
    let submit = document.createElement('input');
    submit.type ='submit';
    submit.value='Save';
    form.appendChild(submit);
    let close = document.createElement('a');
    close.setAttribute('onclick', 'closeInput()');
    close.setAttribute('aria-label', 'Close');
    close.innerHTML = '&#10006';
    form.appendChild(close);

    editFormDiv.appendChild(form);
}

function displayEditForm(id) {
    const item = books.find(item => item.Id == id);
    for(const key in jsonFields) {
        document.getElementById(key).value = item[key];
    }
    document.getElementById('editFormDiv').style.display = 'block';
}

function updateItem() {
    const itemId = document.getElementById('Id').value;
    const item = { };
    for(const key in jsonFields){
        item[key] = document.getElementById(key).value
    }

    fetch(
        `${uri}/${itemId}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item)
        })
    .then(() => getItems())
    .catch(error => console.log('Unable to update Item', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editFormDiv').style.display = 'none';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'Book' : 'Books';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('books');

    tBody.innerHTML = '';

    _displayCount(data.length);

    if (data.length > 0 && Object.keys(jsonFields).length === 0) {
        setFields(data[0]);
        let tableHeader = document.getElementById('tableHeader');
        tableHeader.innerHTML = '';
        for(const key in jsonFields) {
            let th = document.createElement('th');
            th.innerHTML = key;
            tableHeader.appendChild(th);
        }
    }

    const button = document.createElement('button');

    data.forEach(item => {
        
        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm("${item.Id}")`);
        
        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem("${item.Id}")`);

        let tr = tBody.insertRow();

        let index = 0;
        for(let key in item) {
            let td = tr.insertCell(index++);
            let textNode = document.createTextNode(item[key]);
            td.appendChild(textNode);
        }

        let td6 = tr.insertCell(index++);
        td6.appendChild(editButton);

        let td7 = tr.insertCell(index++);
        td7.appendChild(deleteButton);
    });

    books = data;
}

function setFields(field) {
    for(let key in field) {
        if(typeof field[key] == 'string'){
            jsonFields[key] = 'text';
        } else {
            jsonFields[key] = 'number';
        }
    }
    jsonHiddenFields.forEach(field => jsonFields[field] = 'hidden');
}