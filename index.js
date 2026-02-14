(() => {
    const MODULE = "rp_tracker";

    // Получаем контекст SillyTavern
    const context = SillyTavern.getContext();

    // --- UI ---
    const icon = document.createElement("div");
    icon.className = "rptracker_icon";
    document.body.appendChild(icon);

    const panel = document.createElement("div");
    panel.className = "rptracker_panel";
    document.body.appendChild(panel);

    let data = {
        name: "",
        outfit: "",
        location: "",
        date: "",
        lastUpdate: ""
    };

    function renderPanel(){
        panel.innerHTML = `
            <h3>RP Tracker</h3>

            <label>Имя:</label>
            <input id="rp_name" value="${data.name}" /><br>

            <label>Одежда:</label>
            <input id="rp_outfit" value="${data.outfit}" /><br>

            <label>Локация:</label>
            <input id="rp_location" value="${data.location}" /><br>

            <label>Дата:</label>
            <input id="rp_date" value="${data.date}" /><br>

            <small>Последнее обновление: ${data.lastUpdate}</small><br><br>

            <button id="rp_save">Сохранить</button>
        `;

        document.getElementById("rp_save").onclick = () => {
            data.name = document.getElementById("rp_name").value;
            data.outfit = document.getElementById("rp_outfit").value;
            data.location = document.getElementById("rp_location").value;
            data.date = document.getElementById("rp_date").value;
            data.lastUpdate = new Date().toLocaleString();
            saveData();
            renderPanel();
        };
    }

    function saveData(){
        localStorage.setItem(`rptracker_${context.chatId}`, JSON.stringify(data));
    }

    function loadData(){
        const stored = localStorage.getItem(`rptracker_${context.chatId}`);
        if(stored){
            data = JSON.parse(stored);
        }
    }

    icon.onclick = () => {
        panel.style.display =
            panel.style.display === "none" || panel.style.display === ""
                ? "block"
                : "none";

        renderPanel();
    };

    // --- Правильная подписка на события ST ---
    if (context.eventSource && context.eventSource.on) {

        // После генерации сообщения ИИ
        context.eventSource.on("generationEnded", () => {
            const lastMsg = context.chat?.[context.chat.length - 1]?.mes;
            if (!lastMsg) return;

            // Простейший авто-парсинг
            if (lastMsg.toLowerCase().includes("одет")) {
                data.outfit = lastMsg;
                data.lastUpdate = new Date().toLocaleString();
                saveData();
            }

            if (lastMsg.toLowerCase().includes("локац")) {
                data.location = lastMsg;
                data.lastUpdate = new Date().toLocaleString();
                saveData();
            }
        });

        // При смене чата
        context.eventSource.on("chatChanged", () => {
            loadData();
        });
    }

    loadData();
})();
