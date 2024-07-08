import { useState, useEffect } from 'react';

type Task = {
  id: number,
  title: string,
  description: string
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => fetch('http://localhost:8000/tasks')
        .then(response => response.json())
        .then(data => setTasks(data))
        .catch(error => console.error('Error:', error));

  /* Complete the following functions to hit endpoints on your server */
  const createTask = async ({ title, description }: {title: string, description: string}) => fetch('http://localhost:8000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        description
      })
    })
      .then(response => response.json())
      .then(data => {
            if (data.error) {
                console.error(data.error);
                alert(data.error);
                return;
            }
            setTasks([...tasks, data]);
            setFormData({ title: '', description: '' });
        })
      .catch(error =>
        console.error('Error:', error));

  const deleteTask = (id: number) => fetch(`http://localhost:8000/tasks/${id}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          console.error(data.error);
          alert(data.error);
          return;
        }
        setTasks(tasks.filter(task => task.id !== id));
      })
      .catch(error => console.error('Error:', error))

  const updateTask = (id: number, { title, description }: {title: string, description: string}) => fetch(`http://localhost:8000/tasks/${id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              title,
              description
          })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
              console.error(data.error);
              alert(data.error);
              return;
            }
            setTasks(tasks.map(task => task.id === id ? data : task));
        })
        .catch(error => console.error('Error:', error));

  return (
    <div>
      <h1>Task Management App</h1>
      <ul>
        {tasks.map(task => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
              <button onClick={() => updateTask(task.id, formData)}>Update</button>
            </li>
        ))}
      </ul>
      <div>
        <h2>Create Task</h2>
        <input
          type="text"
          placeholder="Title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
        />
        <button onClick={() => createTask(formData)}>Create</button>
      </div>
    </div>
  );
}

export default App;