import React, { useReducer, useContext } from 'react'
import { Alert } from 'react-native'
import { TodoContext } from './todoContext'
import { todoReducer } from './todoReducer'
import {
  ADD_TODO,
  REMOVE_TODO,
  UPDATE_TODO_TITLE,
  UPDATE_TODO_TYPE,
  SHOW_LOADER,
  HIDE_LOADER,
  SHOW_ERROR,
  CLEAR_ERROR,
  FETCH_TODOS,
  UNDONE_TODO,
  CHANGE_TODOS_TYPE
} from '../types'
import { ScreenContext } from '../screen/screenContext'

export const TodoState = ({ children }) => {
  const initialState = {
    todos: [],
    todosType: UNDONE_TODO,
    loading: false,
    error: null
  }
  const { changeScreen } = useContext(ScreenContext)
  const [state, dispatch] = useReducer(todoReducer, initialState)


  const setTodosType = (todosType) => {
    dispatch({ type: CHANGE_TODOS_TYPE, todosType })
  }

  const addTodo = async title => {
    const response = await fetch(
      'https://rn-todo-app-fc956-default-rtdb.europe-west1.firebasedatabase.app/todos.json',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, type: UNDONE_TODO })
      }
    )
    const data = await response.json()
    dispatch({ type: ADD_TODO, title, id: data.name })
    setTodosType(UNDONE_TODO)
  }

  const completelyRemoveTodo = id => {
    const todo = state.todos.find(t => t.id === id)
    Alert.alert(
      'Удаление элемента',
      `Вы уверены, что хотите удалить "${todo.title}"?`,
      [
        {
          text: 'Отмена',
          style: 'cancel'
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            changeScreen(null)
            await fetch(
              `https://rn-todo-app-fc956-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`,
              {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
              }
            )
            dispatch({ type: REMOVE_TODO, id })
          }
        }
      ],
      { cancelable: false }
    )
  }

  const fetchTodos = async () => {
    showLoader()
    clearError()
    try {
      const response = await fetch(
        'https://rn-todo-app-fc956-default-rtdb.europe-west1.firebasedatabase.app/todos.json',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        }
      )
      const data = await response.json()
      console.log('Fetch data', data)
      const todos = Object.keys(data).map(key => ({ ...data[key], id: key }))
      dispatch({ type: FETCH_TODOS, todos })
    } catch (e) {
      showError('Something went wrong...')
      console.log(e)
    } finally {
      hideLoader()
    }
  }

  const updateTodoTitle = async (id, title) => {
    const todo = state.todos.find(t => t.id === id)
    clearError()
    try {
      await fetch(`https://rn-todo-app-fc956-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { title, type: todo.type } )
      })
      dispatch({ type: UPDATE_TODO_TITLE, id, title })
    } catch (e) {
      showError('Something went wrong...')
      console.log(e)
    }
  }

  const updateTodoType = async (id, todoType) => {
    const todo = state.todos.find(t => t.id === id)
    clearError()
    try {
      await fetch(`https://rn-todo-app-fc956-default-rtdb.europe-west1.firebasedatabase.app/todos/${id}.json`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( { title: todo.title, type: todoType } )
      })
      dispatch({ type: UPDATE_TODO_TYPE, id, todoType })
    } catch (e) {
      showError('Something went wrong...')
      console.log(e)
    }
  }

  const showLoader = () => dispatch({ type: SHOW_LOADER })

  const hideLoader = () => dispatch({ type: HIDE_LOADER })

  const showError = error => dispatch({ type: SHOW_ERROR, error })

  const clearError = () => dispatch({ type: CLEAR_ERROR })

  return (
    <TodoContext.Provider
      value={{
        todos: state.todos,
        todosType: state.todosType,
        setTodosType,
        loading: state.loading,
        error: state.error,
        addTodo,
        completelyRemoveTodo,
        updateTodo: updateTodoTitle,
        updateTodoType,
        fetchTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}
