import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../config/Colors'

const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('')

  const handleSubmitFeedback = () => {
    // Add submit feedback functionality here
    console.log("Feedback:", feedback)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>TA Feedback</Text>

      <Text style={styles.label}>Your Feedback</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Optional feedback about TA's help"
        value={feedback}
        onChangeText={setFeedback}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitFeedback}>
        <Text style={styles.submitButtonText}>Submit Feedback</Text>
      </TouchableOpacity>
    </View>
  )
}

export default FeedbackForm

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
