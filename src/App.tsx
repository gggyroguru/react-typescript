import './App.css'
import {useEffect, useState} from "react";
import unique from "./logics/randomize.tsx";
import axios, {AxiosResponse} from "axios";


type Response = { status: number, data: object }
type Client = { id: string, name: string, email: string, password: string }
type Todo = { id: string, task: string, completed: boolean }


const getTodos = (): Todo[] => {

    const todos: string | null = localStorage.getItem('todos')

    if (todos) {
        return JSON.parse(todos) as Todo[]
    } else {
        return []
    }

}

const allTabs: string[] = ['all', 'active', 'completed']

const App = () => {

    const [input, setInput] = useState<string>('')
    const [todos, setTodos] = useState<Todo[]>(getTodos())
    const [edit, setEdit] = useState<Todo>({id: '', task: '', completed: false})
    const [tabs, setTabs] = useState<string>('all')
    const [showTodos, setShowTodos] = useState<Todo[]>([])

    const activeTabs = (tab: string): void => {
        setTabs(tab)
    }

    const addTodos = (): void => {
        const newTodos: Todo = {
            id: unique(todos),
            task: input,
            completed: false,
        }
        if (edit.task) {
            setTodos((todos) => {
                return todos.map((todo) => {
                    if (todo.id === edit.id) {
                        return {...todo, task: input}
                    }
                    return todo
                })
            })
            setInput('')
            setEdit({id: '', task: '', completed: false})
            setTabs('all')
        } else {
            setTodos(todos => [newTodos, ...todos])
            setInput('')
            setTabs('all')
        }
    }

    const editTodos = (id: string): void => {
        const todo: Todo = todos.filter(todo => todo.id === id)[0]
        setInput(todo.task)
        setEdit(todo)
    }

    const deleteTodos = (id: string): void => {
        setTodos(todos => todos.filter(todo => todo.id !== id))
    }

    const completeTodo = (id: string): void => {
        setTodos((todos) => {
            return todos.map((todo) => {
                if (todo.id === id) {
                    return {...todo, completed: !todo.completed}
                }
                return todo
            })
        })
    }

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos))
    }, [todos]);


    useEffect(() => {
        if (tabs === 'all') {
            setShowTodos(getTodos())
        } else if (tabs === 'active') {
            setShowTodos(getTodos().filter(todo => !todo.completed))
        } else if (tabs === 'completed') {
            setShowTodos(getTodos().filter(todo => todo.completed))
        }
    }, [tabs, todos]);

    const fetchAllClients = async (): Promise<void> => {
        const response: AxiosResponse<Response> = await axios.get('http://localhost:8080/api/client/getAll')
        const client:Response = response.data
        setAllClients(client.data as Client[])
    }

    useEffect(() => {
        fetchAllClients()
    }, []);


    return (
        <>
            <div className={'text-indigo-600 text-center text-2xl font-medium mt-6 uppercase'}>
                Todo react + ts
            </div>

            <div className={'w-80 m-auto mt-6'}>
                <div className={'flex justify-between mt-6'}>
                    {
                        allTabs.map((tab, key) => (
                            <button
                                className={`px-3 capitalize cursor-pointer ${tab === tabs ? 'pb-1.5 border-b-[3px] border-b-emerald-600' : 'opacity-60'}`}
                                key={key} onClick={() => activeTabs(tab)}>
                                {tab}
                            </button>
                        ))
                    }
                </div>
                {/*add todo*/}
                <div className={' flex justify-center gap-3 mt-6'}>
                    <input className={'w-full outline-0 px-3 py-1.5 border-2 border-blue-600 rounded-md'} type={'text'}
                           placeholder={'add todo...'} name={'input'} value={input}
                           onChange={(e) => setInput(e.target.value)}/>
                    <button className={'w-12  text-white bg-amber-600 rounded-md'} onClick={addTodos}><img
                        className={'w-full p-1.5 invert'}
                        src={`${edit.task ? 'https://cdn-icons-png.flaticon.com/512/10503/10503327.png' : 'https://cdn-icons-png.flaticon.com/512/3018/3018447.png'}`}/>
                    </button>
                </div>
                {/*show todo*/}
                <div className={'mt-6 flex flex-col gap-3'}>
                    {
                        showTodos.map(todo =>
                            <div key={todo.id}
                                 className={'w-full text-white px-3 py-1.5 flex items-center justify-between bg-blue-600 rounded-md'}>
                                <div className={'flex items-center gap-3'}>
                                    {/*<input type="checkbox" checked={todo.completed} className="w-5 h-5 rounded-md appearance-none checked:bg-blue-500 bg-black" onClick={() => completeTodo(todo.id)}/>*/}

                                    <span
                                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 border-white cursor-pointer`}
                                        onClick={() => completeTodo(todo.id)}>
                                        {todo.completed && <span className={'w-3 h-3 rounded-full bg-white'}></span>}
                                    </span>

                                    <div className={`${todo.completed && 'line-through'}`}>  {todo.task} </div>

                                </div>

                                <div className={'flex gap-3'}>
                                    <button className={'cursor-pointer'} onClick={() => editTodos(todo.id)}><img
                                        className={'w-5 invert'}
                                        src={'https://cdn-icons-png.flaticon.com/512/10503/10503327.png'}/></button>
                                    {todo.completed &&
                                        <button className={'cursor-pointer'} onClick={() => deleteTodos(todo.id)}><img
                                            className={'w-5 invert'}
                                            src={'https://cdn-icons-png.flaticon.com/512/3405/3405244.png'}/></button>}
                                </div>
                            </div>
                        )
                    }
                </div>

                {/*remove all*/}

                {showTodos.length > 1 && <div className={'text-center mt-6'}>
                    <button className={'px-3 py-1.5 bg-black text-white rounded-md'} onClick={() => setTodos([])}>Remove
                        All
                    </button>
                </div>}
            </div>
        </>
    )
}

export default App
