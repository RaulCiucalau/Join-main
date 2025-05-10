let contacts = [];

const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
    onloadFunc();
}

async function onloadFunc() {
    let contactsResponse = await fetchData("contacts");
    let ContactsKeysArrays = Object.keys(contactsResponse);
    for (let index = 0; index < ContactsKeysArrays.length; index++) {
        contacts.push(
            {
                id: ContactsKeysArrays[index],
                name: contactsResponse[ContactsKeysArrays[index]],
            }
        )
        contacts.forEach(contact => console.log(contact.name));

    }
}

async function fetchData(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}
