import {useState, useEffect, useCallback} from 'react';

type Task = {
  id: number,
  title: string,
  description: string
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [updateId, setUpdateId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
        const response = await fetch('http://localhost:8000/tasks');
        const data = await response.json();
        if (data.error) {
            setError(data.error);
            return;
        }
        setTasks(data);
        if (!data.length) setInfo('No tasks found, please, create one.');
        setError(null)
    } catch (error) {
        setError('Error fetching tasks, please, refresh the page.');
    } finally {
        setIsLoading(false);
    }
  };

  /* Complete the following functions to hit endpoints on your server */
  const createTask = async ({ title, description }: {title: string, description: string}) => {
    setIsLoading(true);
    try {
        const response = await fetch('http://localhost:8000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description
            })
        });
        const data = await response.json();
        if (data.error) {
            setError(data.error);
            return;
        }
        setTasks([...tasks, data]);
        setFormData({ title: '', description: '' });
        setError(null)
    } catch (error) {
        setError('Error: ' + error);
    } finally {
        setIsLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    setIsLoading(true);
    try {
        const response = await fetch(`http://localhost:8000/tasks/${id}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        if (data.error) {
            setError(data.error);
            return;
        }
        setTasks(tasks.filter(task => task.id !== id));
        setError(null)
    } catch (error) {
        setError('Error: ' + error);
    } finally {
        setIsLoading(false);
    }
  };

const updateTask = async (id: number, { title, description }: {title: string, description: string}) => {
    setIsLoading(true);
    try {
        const response = await fetch(`http://localhost:8000/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description
            })
        });
        const data = await response.json();
        if (data.error) {
            setError(data.error);
            return;
        }
        setTasks(tasks.map(task => task.id === id ? data : task));
        setFormData({ title: '', description: '' });
        setError(null)
    } catch (error) {
        setError('Error: ' + error);
    } finally {
        setIsLoading(false);
    }
  };

  const updateFormData = useCallback((field: string, value: string) => {
    setError(null)
    setFormData(prevFormData => ({ ...prevFormData, [field]: value }));
  }, []);

  return (
      <div className='page_container'>
          <h1 className='page_title'>Task Management App</h1>
          {isLoading ? (
              <p className='info_message'>Loading...</p>
          ) : (
              <>
                  {error && <p className='error_message'>{error}</p>}
                  <div className='tasks_container'>
                      {
                          <div className='form'>
                              <h2>{!updateId ? 'Create Task' : 'Update Task'}</h2>
                              <input
                                  className='text_input'
                                  type="text"
                                  placeholder="Title"
                                  value={formData.title}
                                  onChange={e => updateFormData('title', e.target.value)}
                              />
                              <input
                                  className='text_input'
                                  type="text"
                                  placeholder="Description"
                                  value={formData.description}
                                  onChange={e => updateFormData('description', e.target.value)}
                              />
                              <button onClick={() => {
                                  if (!updateId) return createTask(formData)
                                  return updateTask(updateId, formData)
                              }}>{!updateId ? 'Create' : 'Update'}</button>
                              {updateId && <button onClick={() =>setUpdateId(null)}>Back to creation</button>}
                          </div>
                      }
                      <div className='tasks_list'>
                          {info && <p className='info_message'>{info}</p>}
                          {tasks.map(task => (
                                  <div className='task_card' key={task.id}>
                                      <h3>{task.title}</h3>
                                      <p>{task.description}</p>
                                      <button onClick={() => deleteTask(task.id)}>Delete</button>
                                      <button onClick={() => setUpdateId(task.id)}>Update</button>
                                  </div>
                              )
                          )}
                      </div>
                  </div>
              </>
          )}
      </div>
  );
}

export default App;