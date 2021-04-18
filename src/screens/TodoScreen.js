import React, { useState, useContext } from 'react'
import { StyleSheet, View, Button, Dimensions } from 'react-native'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import { THEME } from '../theme'
import { AppCard } from '../components/ui/AppCard'
import { EditModal } from '../components/EditModal'
import { AppTextBold } from '../components/ui/AppTextBold'
import { AppButton } from '../components/ui/AppButton'
import { TodoContext } from '../context/todo/todoContext'
import { ScreenContext } from '../context/screen/screenContext'
import { DONE_TODO, REMOVED_TODO } from '../context/types'

export const TodoScreen = () => {
  const { todos, updateTodoType, updateTodo } = useContext(TodoContext)
  const { todoId, changeScreen } = useContext(ScreenContext)
  const [modal, setModal] = useState(false)

  const todo = todos.find(t => t.id === todoId)

  const saveHandler = async title => {
    await updateTodo(todo.id, title)
    setModal(false)
  }

  return (
    <View>
      <EditModal
        value={todo.title}
        visible={modal}
        onCancel={() => setModal(false)}
        onSave={saveHandler}
      />

      <AppCard style={styles.card}>
        <AppTextBold style={styles.title}>{todo.title}</AppTextBold>
        <View style={styles.buttons}>
          <AppButton
            color={THEME.DANGER_COLOR}
            onPress={() => {
              updateTodoType(todo.id, REMOVED_TODO)
              changeScreen(null)
            }}>
            Remove
          </AppButton>
          <AppButton onPress={() => setModal(true)}>
            Edit
          </AppButton>
          <AppButton color={THEME.GREEN_COLOR} onPress={() => {
              updateTodoType(todo.id, DONE_TODO)
              changeScreen(null)
            }}>
            Done
          </AppButton>
        </View>
        
      </AppCard>

      <AppButton
        onPress={() => changeScreen(null)}
        color={THEME.GREY_COLOR}>
        Back
      </AppButton>

    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    padding: 15
  },
  buttons:{
  },
  title: {
    fontSize: 20
  }
})
