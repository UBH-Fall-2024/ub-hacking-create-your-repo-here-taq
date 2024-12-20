import { StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { Colors } from '../config/Colors'

const UserForm = () => {
  const [question, setQuestion] = useState('')
  const [open, setOpen] = useState(false)
  const [topic, setTopic] = useState("PA1")
  const [items, setItems] = useState([
    { label: 'PA1', value: 'PA1' },
    { label: 'PA2', value: 'PA2' },
    { label: 'PA3', value: 'PA3' },
    { label: 'PA4', value: 'PA4' },
    { label: 'PA5', value: 'PA5' }
  ])

  const handleSubmit = () => {
    console.log("Topic:", topic, "Question:", question)
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Text style={styles.header}>Ask a Question</Text>

        <Text style={styles.label}>Topic</Text>
        <DropDownPicker
          open={open}
          value={topic}
          items={items}
          setOpen={setOpen}
          setValue={setTopic}
          setItems={setItems}
          placeholder="Select a topic"
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainerStyle}
        />

        <Text style={styles.label}>Question</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter your question"
          value={question}
          onChangeText={setQuestion}
          multiline
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default UserForm

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.Primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.Primary,
    marginBottom: 8,
  },
  dropdownContainer: {
    height: 50,
    marginBottom: 20,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderColor: Colors.Primary,
  },
  dropdownContainerStyle: {
    backgroundColor: '#fafafa',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.Primary,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: Colors.Blue,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})
