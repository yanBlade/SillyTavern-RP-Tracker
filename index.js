import {
    chat,
    chat_metadata,
    event_types,
    eventSource,
    saveSettingsDebounced
} from '../../../../script.js';

import { SlashCommand } from '../../slash-commands/SlashCommand.js';
import { SlashCommandParser } from '../../slash-commands/SlashCommandParser.js';

const META_KEY = 'rp_tracker_state';

let state = {
    name: '',
    outfit: '',
    location: '',
    date: '',
    notes: ''
};

const loadState = () => {
    if (!chat_metadata[META_KEY]) {
        chat_metadata[META_KEY] = structuredClone(state);
    }
    state = chat_metadata[META_KEY];
};

const saveState = () => {
    chat_metadata[META_KEY] = state;
    saveSettingsDebounced();
};

const init = () => {

    loadState();

    const trigger = document.createElement('div');
    trigger.classList.add('rpt--trigger');
    trigger.textContent = '📘';
    trigger.title = 'RP Tracker';

    const panel = document.createElement('div');
    panel.classList.add('rpt--panel');

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

        document.getElementById('rpt-save').onclick = () => {
            state.name = document.getElementById('rpt-name').value;
            state.outfit = document.getElementById('rpt-outfit').value;
            state.location = document.getElementById('rpt-location').value;
            state.date = document.getElementById('rpt-date').value;
            state.notes = document.getElementById('rpt-notes').value;
            saveState();
        };
    };

    trigger.addEventListener('click', () => {
        panel.style.display =
            panel.style.display === 'none' ? 'block' : 'none';
        render();
    });

    document.body.append(trigger);
    document.body.append(panel);

    eventSource.on(event_types.GENERATION_ENDED, () => {
        const last = chat.at(-1);
        if (!last?.mes) return;

        const text = last.mes.toLowerCase();

        if (text.includes('одет')) {
            state.outfit = last.mes;
        }

        if (text.includes('локац')) {
            state.location = last.mes;
        }

        saveState();
    });

    eventSource.on(event_types.CHAT_CHANGED, () => {
        loadState();
    });

    SlashCommandParser.addCommandObject(
        SlashCommand.fromProps({
            name: 'rp-get',
            callback: () => JSON.stringify(state, null, 2),
            helpString: 'Get current RP tracker state',
            returns: 'JSON'
        })
    );
};

init();
