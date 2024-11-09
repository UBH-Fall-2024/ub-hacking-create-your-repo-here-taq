import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import React from 'react'

const User = ({queueLength,estimatedTime}) => {
  return (
    <SafeAreaView>
        <View style = {styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.header}>There are 2 people ahead of you</Text>
                <Text style={styles.description}>Estimated wait time: 10 minutes</Text>
            </View>
            <Pressable style={styles.button}>
                <MaterialIcons name="exit-to-app" size={24} color="black" />
                <Text style={{fontWeight:'600',fontSize:15}}>Leave the Queue</Text>
            </Pressable>
        </View>
    </SafeAreaView>
  )
}

export default User

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        gap:50,
        alignItems: 'center',
        justifyContent: 'center',
      },
    textContainer:{
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 15,

    },
    header:{
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    description:{
        fontSize: 18,
        fontWeight: 'semibold',
        textAlign : 'center',
    },
    button:{
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        gap: 10,
        padding: 10,
        borderRadius: 5,
        width: 170,
        alignItems: 'center',
        justifyContent: 'center',
    }
})