// Elements
const noteForm = document.getElementById('noteForm');
const noteTitle = document.getElementById('noteTitle');
const noteBody = document.getElementById('noteBody');
const noteCategory = document.getElementById('noteCategory');
const notesContainer = document.getElementById('notesContainer');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Load notes
let notes = JSON.parse(localStorage.getItem('notes')) || [];
displayNotes(notes);

// Notifications
Notification.requestPermission();

// Form Submit
noteForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();
  const category = noteCategory.value;
  const createdAt = new Date().toLocaleString();
  const reminder = document.getElementById('reminderDate')?.value;

  if (title && body) {
    const note = {
      id: Date.now(),
      title,
      body,
      category,
      createdAt,
      reminder
    };
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes(notes);
    noteForm.reset();
  }
});

// Display Notes
function displayNotes(filteredNotes) {
  notesContainer.innerHTML = '';
  filteredNotes.forEach(note => {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note');

    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.body}</p>
      <small><strong>Category:</strong> ${note.category}</small><br>
      <small><strong>Created:</strong> ${note.createdAt}</small><br>
      ${note.reminder ? `<small><strong>Reminder:</strong> ${note.reminder}</small><br>` : ''}
      <button onclick="editNote(${note.id})">✏️ Edit</button>
      <button onclick="deleteNote(${note.id})">🗑 Delete</button>
    `;

    notesContainer.appendChild(noteDiv);
  });
}

// Edit Note
function editNote(id) {
  const note = notes.find(n => n.id === id);
  if (note) {
    noteTitle.value = note.title;
    noteBody.value = note.body;
    noteCategory.value = note.category;

    // Optional: Handle reminder edit
    const reminderInput = document.getElementById('reminderDate');
    if (reminderInput && note.reminder) {
      reminderInput.value = note.reminder;
    }

    notes = notes.filter(n => n.id !== id);
    localStorage.setItem('notes', JSON.stringify(notes));
    displayNotes(notes);
  }
}

// Delete Note
function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  localStorage.setItem('notes', JSON.stringify(notes));
  displayNotes(notes);
}

// Search Notes
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(query) ||
    n.body.toLowerCase().includes(query)
  );
  displayNotes(filtered);
});

// Filter Category
categoryFilter.addEventListener('change', () => {
  const category = categoryFilter.value;
  const filtered = category === 'All' ? notes : notes.filter(n => n.category === category);
  displayNotes(filtered);
});

// Reminder Notification Check
setInterval(() => {
  const now = new Date();
  notes.forEach(note => {
    if (note.reminder) {
      const reminderTime = new Date(note.reminder);
      const diff = reminderTime - now;
      if (diff > 0 && diff < 60000) {
        if (Notification.permission === 'granted') {
          new Notification("🔔 Reminder", {
            body: `Note: ${note.title}`,
          });
        }
      }
    }
  });
}, 30000); // Every 30 seconds

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker Registered', reg))
      .catch(err => console.error('Service Worker Registration Failed', err));
  });
}

// Install App
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);
    if (outcome === 'accepted') {
      installBtn.style.display = 'none';
    }
    deferredPrompt = null;
  }
});


