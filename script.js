document.getElementById('visitorForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const idNum = document.getElementById('idNum').value;
    const purpose = document.getElementById('purpose').value;
    const timeIn = new Date().toLocaleString();

    const table = document.getElementById('logTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();

    newRow.innerHTML = `
        <td>${name}</td>
        <td>${idNum}</td>
        <td>${purpose}</td>
        <td>${timeIn}</td>
    `;

    document.getElementById('visitorForm').reset();
});
