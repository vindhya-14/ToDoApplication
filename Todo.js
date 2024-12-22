import React, { useEffect } from 'react';
import './App.css'; // Add this CSS file for custom styles
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Todo() {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [todos, setTodos] = React.useState([]);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [editTitle, setEditTitle] = React.useState('');
  const [editDescription, setEditDescription] = React.useState('');
  const [editId, setEditId] = React.useState(-1);
  const apiUrl = 'http://localhost:1800';

  const handleSubmit = () => {
    setError('');
    if (title.trim() !== '' && description.trim() !== '') {
      fetch(apiUrl + '/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodos((prevTodos) => [...prevTodos, { title, description }]);
            setMessage('Item added successfully');
            setTimeout(() => setMessage(''), 3000);
            setTitle('');
            setDescription('');
          } else {
            setError('Something went wrong');
          }
        })
        .catch((err) => setError('Network error: ' + err.message));
    }
  };

  useEffect(() => {
    fetch(apiUrl + '/todos')
      .then((res) => res.json())
      .then((data) => setTodos(data))
      .catch((err) => setError('Network error: ' + err.message));
  }, []);

  const handleUpdate = () => {
    fetch(apiUrl + `/todos/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: editTitle, description: editDescription }),
    })
      .then((res) => {
        if (res.ok) {
          setTodos((prevTodos) =>
            prevTodos.map((todo) =>
              todo._id === editId
                ? { ...todo, title: editTitle, description: editDescription }
                : todo
            )
          );
          setMessage('Item updated successfully');
          setTimeout(() => setMessage(''), 3000);
          setEditId(-1);
          setEditTitle('');
          setEditDescription('');
        } else {
          setError('Something went wrong');
        }
      })
      .catch((err) => setError('Network error: ' + err.message));
  };

  const handleEdit = (item) => {
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditId(item._id);
  };

  const handleEditCancel = () => {
    setEditTitle('');
    setEditDescription('');
    setEditId(-1);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      fetch(apiUrl + `/todos/${id}`, { method: 'DELETE' })
        .then((res) => {
          if (res.ok) {
            setTodos((prevTodos) => prevTodos.filter((item) => item._id !== id));
            setMessage('Item deleted successfully');
            setTimeout(() => setMessage(''), 3000);
          } else {
            setError('Something went wrong');
          }
        })
        .catch((err) => setError('Network error: ' + err.message));
    }
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="display-4">TODO Application</h1>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
      </div>

      <div className="card p-4 shadow-sm mb-4">
        <h3 className="text-primary mb-3">Add Task</h3>
        <div className="row g-3">
          <div className="col-md-5">
            <input
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Title"
            />
          </div>
          <div className="col-md-5">
            <input
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              type="text"
              placeholder="Description"
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
              Add
            </button>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-primary">Tasks</h3>
        {todos.length > 0 ? (
          <div className="row g-4">
            {todos.map((item) => (
              <div className="col-md-4" key={item._id}>
                <div className="card shadow-sm p-3 h-100">
                  {editId === item._id ? (
                    <>
                      <input
                        className="form-control mb-2"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                      <input
                        className="form-control mb-2"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      />
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-success"
                          onClick={handleUpdate}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <h5 className="mb-2">{item.title}</h5>
                      <p className="text-muted">{item.description}</p>
                      <div className="d-flex justify-content-between">
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No tasks available</p>
        )}
      </div>
    </div>
  );
}
