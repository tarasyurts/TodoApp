import React, { useState, useEffect, useContext, useCallback } from 'react'
import { StyleSheet, View, FlatList, Image, Dimensions } from 'react-native'
import { AddTodo } from '../components/AddTodo'
import { Todo } from '../components/Todo'
import { THEME } from '../theme'
import { TodoContext } from '../context/todo/todoContext'
import { ScreenContext } from '../context/screen/screenContext'
import { AppLoader } from '../components/ui/AppLoader'
import { AppText } from '../components/ui/AppText'
import { AppButton } from '../components/ui/AppButton'
import { DONE_TODO, REMOVED_TODO, UNDONE_TODO } from '../context/types'

export const MainScreen = () => {
  const { addTodo, todos, todosType, setTodosType, completelyRemoveTodo, fetchTodos, loading, error } = useContext(
    TodoContext
  )
  const { changeScreen } = useContext(ScreenContext)
  const [deviceWidth, setDeviceWidth] = useState(
    Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2
  )

  const loadTodos = useCallback(async () => await fetchTodos(), [fetchTodos])

  useEffect(() => {
    loadTodos()
  }, [])

  useEffect(() => {
    const update = () => {
      const width =
        Dimensions.get('window').width - THEME.PADDING_HORIZONTAL * 2
      setDeviceWidth(width)
    }

    Dimensions.addEventListener('change', update)

    return () => {
      Dimensions.removeEventListener('change', update)
    }
  })

  const todosFiltered = todos.filter(todo=> todo.type === todosType)

  if (loading) {
    return <AppLoader />
  }

  if (error) {
    return (
      <View style={styles.center}>
        <AppText style={styles.error}>{error}</AppText>
        <AppButton onPress={loadTodos}>Повторить</AppButton>
      </View>
    )
  }

  let content = (
    <View style={{ width: deviceWidth }}>
      <FlatList
        keyExtractor={item => item.id.toString()}
        data={todosFiltered}
        renderItem={({ item }) => (
          <Todo todo={item} onCompletelyRemove={completelyRemoveTodo} onOpen={changeScreen} />
        )}
      />
    </View>
  )

  if (todos.length === 0) {
    content = (
      <View style={styles.imgWrap}>
        <Image
          style={styles.image}
          source={require('../../assets/no-items.png')}
        />
      </View>
    )
  }

  return (
    <View>
      <AddTodo onSubmit={addTodo}/>
      <View style={styles.topNavigation}  >
        <AppButton color={ todosType===REMOVED_TODO ? THEME.MAIN_COLOR : THEME.GREY_COLOR } 
          onPress={()=> setTodosType(REMOVED_TODO)} >Removed</AppButton>
        <AppButton color={ todosType===UNDONE_TODO ? THEME.MAIN_COLOR : THEME.GREY_COLOR } 
          onPress={()=> setTodosType(UNDONE_TODO)} >Undone</AppButton>
        <AppButton color={ todosType===DONE_TODO ? THEME.MAIN_COLOR : THEME.GREY_COLOR } 
          onPress={()=> setTodosType(DONE_TODO)}>Done</AppButton>
      </View>
      {content}
    </View>
  )
}

const styles = StyleSheet.create({
  topNavigation:{
    width: '100%',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button:{
    width: '40%'
  },
  imgWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    height: 300
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  error: {
    fontSize: 20,
    color: THEME.DANGER_COLOR
  }
})
