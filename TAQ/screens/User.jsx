import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../config/Colors';
import React from 'react'

const User = ({queueLength, estimatedTime}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.header}>{`There ${(queueLength - 1) == 1 ? "is" : "are"} ${queueLength - 1} ${(queueLength - 1) == 1 ? "person" : "people"} ahead of you`}</Text>
                <Text style={styles.description}>{`Estimated wait time: ${estimatedTime} minutes`}</Text>
            </View>
            <Pressable style={styles.button}>
                <MaterialIcons name="exit-to-app" size={24} color="white" />
                <Text style={{ fontWeight: '600', fontSize: 15, color: 'white' }}>Leave the Queue</Text>
            </Pressable>
        </View>
    </SafeAreaView>
  )
}

export default User

const styles = StyleSheet.create({
    safeArea: {
        flex: 1, // Make SafeAreaView take the full screen height
        backgroundColor: Colors.Background,
        paddingHorizontal: 0, // Ensure no horizontal padding
        paddingVertical: 0,
        width: '100%',
    },
    container: {
        flex: 1,
        gap: 50,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.Background,
    },
    textContainer: {
        gap: 15,
        
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: Colors.Primary,
    },
    description: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: 'white',
    },
    button: {
        flexDirection: 'row',
        backgroundColor: Colors.Red,
        gap: 10,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
