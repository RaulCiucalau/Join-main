async function loadcontacts()
{
    async function loadContacts() {
  try {
    const response = await fetch("https://join-460-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"
);
    const data = await response.json();

    if (data) {
      // Falls Kontakte als Objekt gespeichert sind → in Array umwandeln
      const contacts = Object.values(data);
      console.log("Geladene Kontakte:", contacts);
      return contacts;
    } else {
      console.warn("Keine Kontakte gefunden.");
      return [];
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
    return [];
  }
}

}

async function initContacts() {
  const contacts = await loadContacts();
  renderContacts(contacts); // deine eigene Renderfunktion
}
