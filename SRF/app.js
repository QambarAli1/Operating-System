const form = document.getElementById("inputForm");
const processInputs = document.getElementById("processInputs");
const outputTable = document.getElementById("outputTable").querySelector("tbody");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const processCount = document.getElementById("processCount").value;
    const processes = [];

    for (let i = 0; i < processCount; i++) {
        const arrival = parseInt(document.getElementById(`arrival${i}`).value);
        const execution = parseInt(document.getElementById(`execution${i}`).value);
        processes.push({ id: `P${i + 1}`, arrival, execution, remaining: execution });
    }

    const result = srtfScheduling(processes);
    displayOutput(result);
});

document.getElementById("processCount").addEventListener("change", () => {
    const processCount = document.getElementById("processCount").value;
    processInputs.innerHTML = "";
    for (let i = 0; i < processCount; i++) {
        processInputs.innerHTML += `
            <div>
            <br /><br />
                <label for="arrival${i}"><b>Process P${i + 1}:</b> <br /> Arr  Time:</label>
                <input type="number" id="arrival${i}" min="0" required>
                <label for="execution${i}"> <br /><br /> Exe Time:</label>
                <input type="number" id="execution${i}" min="1" required>
            </div>
        `;
    }
});

function srtfScheduling(processes) {
    let time = 0;
    const schedule = [];
    const completedProcesses = [];

    while (processes.length > 0) {
        const availableProcesses = processes.filter(p => p.arrival <= time);
        if (availableProcesses.length > 0) {
            availableProcesses.sort((a, b) => a.remaining - b.remaining || a.arrival - b.arrival);
            const current = availableProcesses[0];
            current.remaining--;

            if (schedule.length === 0 || schedule[schedule.length - 1].process !== current.id) {
                schedule.push({ process: current.id, start: time });
            }

            if (current.remaining === 0) {
                const turnaroundTime = time + 1 - current.arrival;
                completedProcesses.push({
                    id: current.id,
                    arrival: current.arrival,
                    execution: current.execution,
                    start: schedule.find(s => s.process === current.id).start,
                    wait: turnaroundTime - current.execution,
                    turnaround: turnaroundTime,
                    finish: time + 1,
                    utilization: ((current.execution / turnaroundTime) * 100).toFixed(2)
                });
                processes = processes.filter(p => p.id !== current.id);
            }
        }
        time++;
    }
    return completedProcesses;
}

function displayOutput(result) {
    outputTable.innerHTML = "";
    result.forEach(process => {
        outputTable.innerHTML += `
            <tr>
                <td>${process.id}</td>
                <td>${process.arrival}</td>
                <td>${process.execution}</td>
                <td>${process.start}</td>
                <td>${process.wait}</td>
                <td>${process.turnaround}</td>
                <td>${process.finish}</td>
                <td>${process.utilization}%</td>
            </tr>
        `;
    });
}
