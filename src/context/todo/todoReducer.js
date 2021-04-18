import {
  ADD_TODO,
  REMOVE_TODO,
  UPDATE_TODO_TITLE,
  UPDATE_TODO_TYPE,
  CHANGE_TODOS_TYPE,
  SHOW_LOADER,
  HIDE_LOADER,
  SHOW_ERROR,
  CLEAR_ERROR,
  FETCH_TODOS,
  UNDONE_TODO
} from '../types'

const handlers = {
  [ADD_TODO]: (state, { title, id }) => ({
    ...state,
    todos: [...state.todos, { id, title, type: UNDONE_TODO }]
  }),
  [REMOVE_TODO]: (state, { id }) => ({
    ...state,
    todos: state.todos.filter(todo => todo.id !== id)
  }),
  [UPDATE_TODO_TITLE]: (state, { title, id }) => ({
    ...state,
    todos: state.todos.map(todo => {
      if (todo.id === id) {
        todo.title = title
      }
      return todo
    })
  }),
  [SHOW_LOADER]: state => ({ ...state, loading: true }),
  [HIDE_LOADER]: state => ({ ...state, loading: false }),
  [CLEAR_ERROR]: state => ({ ...state, error: null }),
  [SHOW_ERROR]: (state, { error }) => ({ ...state, error }),
  [FETCH_TODOS]: (state, { todos }) => ({ ...state, todos }),
  [CHANGE_TODOS_TYPE]: (state, {todosType}) => ({ ...state, todosType }),
  [UPDATE_TODO_TYPE]: (state, {id, todoType}) => ({
    ...state,
    todos: state.todos.map(todo => {
      if (todo.id === id) {
        todo.type = todoType
      }
      return todo
    })
  }) ,
  DEFAULT: state => state
}

export const todoReducer = (state, action) => {
  const handler = handlers[action.type] || handlers.DEFAULT
  return handler(state, action)
}
