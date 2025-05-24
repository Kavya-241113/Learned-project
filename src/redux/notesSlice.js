import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notes: JSON.parse(localStorage.getItem("til_notes")) || [],
};

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action) => {
      const today = new Date().toISOString().split('T')[0];
      const exists = state.notes.find(n => n.date === today);
      if (!exists) {
        state.notes.unshift({ id: Date.now(), date: today, content: action.payload });
        localStorage.setItem("til_notes", JSON.stringify(state.notes));
      }
    },
    editNote: (state, action) => {
      const { id, content } = action.payload;
      const note = state.notes.find(n => n.id === id);
      if (note) note.content = content;
      localStorage.setItem("til_notes", JSON.stringify(state.notes));
    },
    deleteNote: (state, action) => {
      state.notes = state.notes.filter(n => n.id !== action.payload);
      localStorage.setItem("til_notes", JSON.stringify(state.notes));
    },
  },
});

export const { addNote, editNote, deleteNote } = notesSlice.actions;
export default notesSlice.reducer;