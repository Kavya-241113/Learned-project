import { useDispatch, useSelector } from 'react-redux';
import { addNote, editNote, deleteNote } from './redux/notesSlice';
import { useState } from 'react';
import styles from './App.module.css';

export default function App() {
  const dispatch = useDispatch();
  
  const notes = useSelector(state => state.notes.notes);

   const today = new Date().toISOString().split('T')[0];
  const todayNote = notes.find(n => n.date === today);
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  const handleAdd = () => {
    if (input.trim()) dispatch(addNote(input));
    setInput('');
  };

  const handleEdit = (id, content) => {
    setEditId(id);
    setEditContent(content);
  };

  const handleUpdate = () => {
    dispatch(editNote({ id: editId, content: editContent }));
    setEditId(null);
    setEditContent('');
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'til_notes.json';
    link.href = url;
    link.click();
  };

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <h1 className={styles.heading}>Today I Learned</h1>
      <button className={styles.toggleBtn} onClick={() => setDarkMode(prev => !prev)}>
        {darkMode ? ' Light Mode' : ' Dark Mode'}
      </button>
      <label className={styles.label}>What did you learn today?</label>
      <textarea
        className={styles.textarea}
        rows="3"
        disabled={!!todayNote}
        value={input}
        onChange={e => setInput(e.target.value)}
      />
      <button
        onClick={handleAdd}
        disabled={!!todayNote}
        className={`${styles.saveBtn} ${todayNote ? styles.disabled : ''}`}
      >
        Save
      </button>
      {todayNote && <p className={styles.label}>You've already submitted today's note.</p>}

  
      <div style={{ marginTop: '15px' }}>
        <button className={styles.exportBtn} onClick={handleExportJSON}>Export as JSON</button>
      </div>

      <h2 className={styles.heading}>Your Notes</h2>

      <ul className={styles.noteList}>
        {[...notes]
      
      .sort((a, b) => (a.date < b.date ? 1 : -1))
          .map(note => (
            <li key={note.id} className={styles.noteItem}>
              <div className={styles.noteDate}>
               {new Date(note.date).toLocaleDateString('en-GB')}</div>
              {editId === note.id ? (
                <>
                  <textarea
                    className={styles.textarea}
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                  />
                  <button onClick={handleUpdate} className={styles.saveBtn}>Update</button>
                  <button onClick={() => setEditId(null)} className={styles.saveBtn1}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{note.content}</p>
                  <div className={styles.noteActions}>
                    <button onClick={() => handleEdit(note.id, note.content)}>Edit</button>
                    <button onClick={() => {
                      if(window.confirm('Are you want to delete This Note?')){
                        dispatch(deleteNote(note.id))
                      }
                      
                    }}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
