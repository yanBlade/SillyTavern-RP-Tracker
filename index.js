(() => {
    const MODULE = "rp_tracker";
    const context = SillyTavern.getContext();

    // Создаём элементы
    const icon = document.createElement("div");
    icon.className = "rptracker_icon";
    document.body.appendChild(icon);

    const panel = document.createElement("div");
    panel.className = "rptracker_panel";
    document.body.appendChild(panel);

    let data = {
        name: "",
        outfit: "",
        lastUpdate: new Date().toLocaleString()
    };

    function renderPanel(){
        panel.innerHTML = `
            <h3>RP Tracker</h3>
            <label>Имя: </label><input id="rp_name" value="${data.name}" /><br>
            <label>Одежда: </label><input id="rp_outfit" value="${data.outfit}" /><br>
            <label>Дата/Время: </label><span>${data.lastUpdate}</span><br>
            <button id="rp_save">Сохранить</button>
        `;
        panel.querySelector("#rp_save").onclick = () => {
            data.name = panel.querySelector("#rp_name").value;
            data.outfit = panel.querySelector("#rp_outfit").value;
            data.lastUpdate = new Date().toLocaleString();
            saveData();
            renderPanel();
        };
    }

    function saveData(){
        localStorage.setItem(`rptracker_${MODULE}`, JSON.stringify(data));
    }

    function loadData(){
        const stored = localStorage.getItem(`rptracker_${MODULE}`);
        if(stored) data = JSON.parse(stored);
    }

    icon.onclick = () => {
        panel.style.display = panel.style.display === "none" ? "block" : "none";
        renderPanel();
    };

    // Слушаем событие генерирования чата
    context.eventSource.addEventListener("GENERATION_ENDED", () => {
        const lastMsg = context.chat[context.chat.length - 1]?.message;
        if(lastMsg){
            // Простая логика извлечения имени/описания
            if(lastMsg.includes("одет")){
                data.outfit = lastMsg;
                data.lastUpdate = new Date().toLocaleString();
                saveData();
            }
        }
    });

    loadData();
})();
