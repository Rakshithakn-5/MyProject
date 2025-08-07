document.addEventListener("DOMContentLoaded", function () {
  let notes = JSON.parse(localStorage.getItem("notes")) || [];
  let editingIndex = null;

  const noteForm = document.getElementById("noteForm");
  const notesContainer = document.getElementById("notesContainer");
  const categoryFilter = document.getElementById("categoryFilter");
  const searchInput = document.getElementById("searchInput");

  function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
  }

  function renderNotes() {
    notesContainer.innerHTML = "";
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredNotes = notes.filter((note) => {
      const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
      const matchesSearch =
        note.title.toLowerCase().includes(searchTerm) ||
        note.body.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    filteredNotes.forEach((note, index) => {
      const noteCard = document.createElement("div");
      noteCard.className = "note-card";

      noteCard.innerHTML = `
        <h3>${note.title}</h3>
        <p>${note.body}</p>
        <small>📌 ${note.category}</small><br/>
        <small>🕒 Created: ${note.timestamp}</small><br/>
        <button onclick="editNote(${index})" class="edit-btn">Edit</button>
        <button onclick="deleteNote(${index})" class="delete-btn">Delete</button>
      `;

      notesContainer.appendChild(noteCard);
    });
  }

  window.deleteNote = function (index) {
    notes.splice(index, 1);
    saveNotes();
    renderNotes();
  };

  window.editNote = function (index) {
    const note = notes[index];
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteBody").value = note.body;
    document.getElementById("noteCategory").value = note.category;
    editingIndex = index;
  };

  noteForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = document.getElementById("noteTitle").value.trim();
    const body = document.getElementById("noteBody").value.trim();
    const category = document.getElementById("noteCategory").value;

    if (!title || !body) {
      alert("Please fill in both the title and note description.");
      return;
    }

    const timestamp = new Date().toLocaleString();

    if (editingIndex !== null) {
      // Editing existing note
      notes[editingIndex] = { title, body, category, timestamp };
      editingIndex = null;
    } else {
      // Creating new note
      notes.push({ title, body, category, timestamp });
    }

    saveNotes();
    renderNotes();
    noteForm.reset();
  });

  categoryFilter.addEventListener("change", renderNotes);
  searchInput.addEventListener("input", renderNotes);

  renderNotes();
});
