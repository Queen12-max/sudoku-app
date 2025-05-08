import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const AccueilScreen = () => {
    const router = useRouter(); // ✅ Hook de navigation
  
    const handleStart = () => {
      router.push('/Nvl'); // ✅ Redirige vers l’écran niveau.jsx
    }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/image_accueil.png')}
        style={styles.image}
      />
      <Text style={styles.text}>
        Testez votre intelligence et résolvez en toute sérénité
      </Text>
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Commencez</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccueilScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bceaf4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: width * 0.85,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  text: {
    fontSize: 28,
    color: '#000',
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#0d40ae',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: width * 0.7,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '400',
    fontFamily: 'PoppinsRegular',
  },
});
