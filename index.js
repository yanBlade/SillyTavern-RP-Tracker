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

alert("Привет, мир! - 8");

    const render = () => {
        panel.innerHTML = `
            <h3>RP Tracker</h3>

            <div class="rpt--row">
                <label>Name</label>
                <input id="rpt-name" value="${state.name}">
            </div>

            <div class="rpt--row">
                <label>Outfit</label>
                <input id="rpt-outfit" value="${state.outfit}">
            </div>

            <div class="rpt--row">
                <label>Location</label>
                <input id="rpt-location" value="${state.location}">
            </div>

            <div class="rpt--row">
                <label>Date</label>
                <input id="rpt-date" value="${state.date}">
            </div>

            <div class="rpt--row">
                <label>Notes</label>
                <textarea id="rpt-notes">${state.notes}</textarea>
            </div>

            <button id="rpt-save">Save</button>
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
        panel.classList.toggle('rpt--panel-open');
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
