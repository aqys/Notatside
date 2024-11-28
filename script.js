document.addEventListener('DOMContentLoaded', () => {
    loadNotes();
});

function addNote() {
    const textarea = document.querySelector('textarea');
    const content = textarea.value.trim();
    
    if (content) {
        const note = {
            id: Date.now(),
            content: content,
            timestamp: new Date().toLocaleString(),
            isPinned: false
        };

        const notes = JSON.parse(localStorage.getItem('notes') || '[]');
        notes.unshift(note);
        localStorage.setItem('notes', JSON.stringify(notes));

        loadNotes();
        textarea.value = '';
    }
}

function deleteNote(id) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const filteredNotes = notes.filter(note => note.id !== id);
    localStorage.setItem('notes', JSON.stringify(filteredNotes));
    loadNotes();
}

function loadNotes() {
    const notesGrid = document.querySelector('.notes-grid');
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    
    notes.sort((a, b) => b.isPinned - a.isPinned);
    
    notesGrid.innerHTML = notes.map(note => `
        <div class="note">
            ${note.isPinned ? '<img src="pinned.svg" alt="Pinned">' : ''}
            <p>${note.content}</p>
            <small>${note.timestamp}</small>
            <button onclick="pinNote(${note.id})">Pin</button>
            <button onclick="editNote(${note.id})">Edit</button>
            <button onclick="deleteNote(${note.id})">Delete</button>
        </div>
    `).join('');
}
function editNote(id) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const noteIndex = notes.findIndex(note => note.id === id);
    const note = notes[noteIndex];

    const newContent = prompt('Rediger notat:', note.content);
    if (newContent !== null && newContent.trim().length > 0) {
        note.content = newContent;
        localStorage.setItem('notes', JSON.stringify(notes));
        loadNotes();
    } else {
        alert('Feltet må ikke være tom.');
    }
}

function pinNote(id) {
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const noteIndex = notes.findIndex(note => note.id === id);
    notes[noteIndex].isPinned = !notes[noteIndex].isPinned;
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

function searchNotes() {
    const query = document.getElementById('search').value.toLowerCase();
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');
    const filteredNotes = notes.filter(note => note.content.toLowerCase().includes(query));
    
    const notesGrid = document.querySelector('.notes-grid');
    notesGrid.innerHTML = filteredNotes.map(note => `
        <div class="note">
            <p>${note.content}</p>
            <small>${note.timestamp}</small>
            <button onclick="pinNote(${note.id})">Pin</button>
            <button onclick="editNote(${note.id})">Edit</button>
            <button onclick="deleteNote(${note.id})">Delete</button>
        </div>
    `).join('');
}