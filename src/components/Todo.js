import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { AppText } from '../components/ui/AppText'
import { UNDONE_TODO } from '../context/types'

export const Todo = ({ todo, onCompletelyRemove, onOpen }) => {
  return (
    <TouchableOpacity
    on
      activeOpacity={0.5}
      onPress={() => { todo.type === UNDONE_TODO && onOpen(todo.id) }}
      onLongPress={onCompletelyRemove.bind(null, todo.id)}
    >
      <View style={styles.todo}>
        <AppText>{todo.title}</AppText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  todo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 5,
    marginBottom: 10
  }
})
