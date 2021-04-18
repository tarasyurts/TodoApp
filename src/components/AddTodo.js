import React, { useState } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Alert,
  Keyboard
} from 'react-native'

import { THEME } from '../theme'
import { AppButton } from './ui/AppButton'

export const AddTodo = ({ onSubmit }) => {
  const [value, setValue] = useState('')

  const pressHandler = () => {
    if (value.trim()) {
      onSubmit(value)
      setValue('')
      Keyboard.dismiss()
    } else {
      Alert.alert('New todo cant be empty')
    }
  }

  return (
    <View style={styles.block}>
      <TextInput
        style={styles.input}
        onChangeText={setValue}
        value={value}
        placeholder='What to do?'
        autoCorrect={false}
        autoCapitalize='none'
      />

      <AppButton onPress={pressHandler} name='pluscircleo'>Add</AppButton>
    </View>
  )
}

const styles = StyleSheet.create({
  block: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  input: {
    width: '60%',
    padding: 10,
    borderStyle: 'solid',
    borderBottomWidth: 2,
    borderBottomColor: THEME.MAIN_COLOR
  }
})
