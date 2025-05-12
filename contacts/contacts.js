let contacts = [];

const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
    onloadFunc();
}

async function onloadFunc() {
    const contactsResponse = await fetchData("contacts");
    contacts = [];

    for (const [id, data] of Object.entries(contactsResponse)) {
        contacts.push({ id, ...data });
    }

    contacts.forEach(contact => console.log(contact.name));
    console.table(contacts);

    renderContactstoHTML();
}

async function fetchData(path) {
    const response = await fetch(BASE_URL + path + ".json");
    return await response.json();
}

function renderContactstoHTML() {
    const mainDiv = document.getElementById('mainContent');

    const contact = contacts[0];

    if (!contact) {
        mainDiv.innerHTML += <p>No contact found.</p>;
        return;
    }

    document.getElementById('name').textContent = contact.name  || "N/A";
    document.getElementById('phone').textContent = contact.phone  || "N/A";
    document.getElementById('e-mail').textContent = contact.e_mail || "N/A";
}