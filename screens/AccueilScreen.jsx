import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window'); // 📏 Dimensions dynamiques

const AccueilScreen = () => {
  const router = useRouter();

  const handleStart = () => {
    router.push('/Nvl'); // ▶️ Redirection vers la page "Nouvelle Partie"
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/image_accueil.png')}
          style={styles.image}
        />
      </View>

        <Text style={styles.text}>
          Testez votre intelligence{'\n'}et résolvez en toute sérénité
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleStart}>
          <Text style={styles.buttonText}>Commencez</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccueilScreen;

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#bceaf4',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  imageContainer: {
    width: width * 0.8,
    height: height * 0.35,
    borderRadius: 200,    // coins arrondis
    overflow: 'hidden',  // cache les débordements hors arrondi
    marginBottom: 30,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // pour que l'image remplisse bien tout le conteneur arrondi
  },  
  text: {
    fontSize: 22, // 🔤 taille réduite pour mobile
    color: '#000',
    fontFamily: 'PoppinsRegular',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 30,
  },
  button: {
    backgroundColor: '#0d40ae',
    paddingVertical: 14,
    borderRadius: 50,
    width: width * 0.7,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'PoppinsRegular',
  },
});
