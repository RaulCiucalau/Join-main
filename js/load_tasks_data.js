let tasks = [];
const BASE_URL = "https://join-460-default-rtdb.europe-west1.firebasedatabase.app/";

async function onloadFunc() {
    let tasksResponse = await fetchData("tasks");
    let tasksKeysArrays = Object.keys(tasksResponse);
    for (let index = 0; index < tasksKeysArrays.length; index++) {
        let data = tasksResponse[tasksKeysArrays[index]];
        tasks.push(
            {
                id : tasksKeysArrays[index],
                title: data.title,
                description: data.description,
                category: data.category,
                priority: data.priority,
                due_date: data.due_date,
                assigned_to: data.assigned_to,
                status: data.status,
                subtasks: data.subtasks
            }
        
        )
    }
}

async function fetchData(path) {
    let response = await fetch(BASE_URL + path + ".json");
    return responseToJson = await response.json();
}
