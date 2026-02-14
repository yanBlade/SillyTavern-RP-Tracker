import {
    chat,
    chat_metadata,
    event_types,
    eventSource,
    saveSettingsDebounced
} from '../../../../script.js';

alert("Привет, мир!");

// Импорты для SlashCommand
import { SlashCommand } from '../../../slash-commands/SlashCommand.js';
import { SlashCommandParser } from '../../../slash-commands/SlashCommandParser.js';
alert("Привет, мир! - 1");

const META_KEY = 'rp_tracker_state';
alert("Привет, мир! - 2");

let state = {
    name: '',
    outfit: '',
    location: '',
    date: '',
    notes: ''
};
alert("Привет, мир! - 3");

const loadState = () => {
    if (!chat_metadata[META_KEY]) {
        chat_metadata[META_KEY] = structuredClone(state);
    }
    state = chat_metadata[META_KEY];
};
alert("Привет, мир! - 4");

const saveState = () => {
    chat_metadata[META_KEY] = state;
    saveSettingsDebounced();
};
alert("Привет, мир! - 5");

const init = () => {
alert("Привет, мир! - 6");

    loadState();
alert("Привет, мир! - 7");

    // --- UI ---
    const trigger = document.createElement('div');
    trigger.classList.add('rpt--trigger');
    trigger.textContent = '📘';
    trigger.title = 'RP Tracker';

    const panel = document.createElement('div');
    panel.classList.add('rpt--panel');

    // Стили для trigger и panel
    trigger.style.position = 'fixed';
    trigger.style.top = '10px';
    trigger.style.right = '10px';
    trigger.style.background = 'orange';
    trigger.style.padding = '5px 10px';
    trigger.style.cursor = 'pointer';
    trigger.style.zIndex = 9999;

    panel.style.position = 'fixed';
    panel.style.top = '50px';
    panel.style.right = '10px';
    panel.style.width = '320px';
    panel.style.maxHeight = '400px';
    panel.style.overflowY = 'auto';
    panel.style.background = 'white';
    panel.style.border = '1px solid black';
    panel.style.padding = '10px';
    panel.style.display = 'none';
    panel.style.zIndex = 9999;
    panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    panel.style.fontFamily = 'sans-serif';
    panel.style.fontSize = '14px';

alert("Привет, мир! - 8");

    const render = () => {
        panel.innerHTML = `
            <h3>RP Tracker</h3>

            <div class="rpt--row" style="margin-bottom:5px;">
                <label>Name</label>
                <input id="rpt-name" value="${state.name}" style="width:100%;box-sizing:border-box;">
            </div>

            <div class="rpt--row" style="margin-bottom:5px;">
                <label>Outfit</label>
                <input id="rpt-outfit" value="${state.outfit}" style="width:100%;box-sizing:border-box;">
            </div>

            <div class="rpt--row" style="margin-bottom:5px;">
                <label>Location</label>
                <input id="rpt-location" value="${state.location}" style="width:100%;box-sizing:border-box;">
            </div>

            <div class="rpt--row" style="margin-bottom:5px;">
                <label>Date</label>
                <input id="rpt-date" value="${state.date}" style="width:100%;box-sizing:border-box;">
            </div>

            <div class="rpt--row" style="margin-bottom:5px;">
                <label>Notes</label>
                <textarea id="rpt-notes" style="width:100%;box-sizing:border-box;">${state.notes}</textarea>
            </div>

            <button id="rpt-save" style="width:100%;padding:5px;">Save</button>
        `;
alert("Привет, мир! - 10");

        document.getElementById('rpt-save').onclick = () => {
            state.name = document.getElementById('rpt-name').value;
            state.outfit = document.getElementById('rpt-outfit').value;
            state.location = document.getElementById('rpt-location').value;
            state.date = document.getElementById('rpt-date').value;
            state.notes = document.getElementById('rpt-notes').value;
            alert("Привет, мир! - 11");
            saveState();
            alert("Привет, мир! - 12");
        };
    };

alert("Привет, мир! - 13");

    document.body.append(trigger);
    document.body.append(panel);
alert("Привет, мир! - 15");

    render(); // сразу отрисовать, чтобы кнопка Save была готова
alert("Привет, мир! - 17");

    // Toggle панели
    trigger.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        alert("Привет, мир! - 14");
    });

    // --- Auto update after generation ---
    eventSource.on(event_types.GENERATION_ENDED, () => {
        const last = chat.at(-1);
        alert("Привет, мир! - 18");
        if (!last?.mes) return;
        alert("Привет, мир! - 19");

        const text = last.mes.toLowerCase();
        alert("Привет, мир! - 20");
        if (text.includes('одет')) state.outfit = last.mes;
        alert("Привет, мир! - 21");
        if (text.includes('локац')) state.location = last.mes;

        saveState();
    });
alert("Привет, мир! - 22");

    // --- reload on chat change ---
    eventSource.on(event_types.CHAT_CHANGED, () => {
        loadState();
    });
alert("Привет, мир! - 23");

    // --- Slash command ---
    SlashCommandParser.addCommandObject(
        SlashCommand.fromProps({
            name: 'rp-get',
            callback: () => JSON.stringify(state, null, 2),
            helpString: 'Get current RP tracker state',
            returns: 'JSON'
        })
    );
};
alert("Привет, мир! - 24");

init();
alert("Привет, мир! - 25");
