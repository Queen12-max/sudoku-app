import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const avatars = [
  require('../assets/images/photo.png'),
  require('../assets/images/avatar1.jpg'),
  require('../assets/images/avatar2.jpg'),
  require('../assets/images/avatar3.jpg'),
  require('../assets/images/avatar4.png'),
];

const NvlScreen = () => {
  const router = useRouter();
  const [avatarIndex, setAvatarIndex] = useState(0);

  useEffect(() => {
    const loadAvatar = async () => {
      const index = await AsyncStorage.getItem('selectedAvatarIndex');
      if (index !== null) {
        setAvatarIndex(parseInt(index));
      }
    };
    loadAvatar();
  }, []);

  const handleStart = () => {
    router.push('/Selection');
  };

  return (
    <View style={styles.container}>
      {/* ✅ Image profil synchronisée */}
      <TouchableOpacity
        onPress={() => router.push('/Profil')}
        style={styles.imageProfileContainer}
      >
        <Image
          source={avatars[avatarIndex]}
          style={styles.imageProfile}
        />
      </TouchableOpacity>

      {/* Icône paramètres */}
      <Image
        source={require('../assets/images/parametres-cog.png')}
        style={styles.imageParam}
      />

      {/* Titre */}
      <Text style={styles.titre}>SUDOKU</Text>

      {/* Bouton "Nouvelle Partie" */}
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Nouvelle Partie</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NvlScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bdeaf5',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  imageProfileContainer: {
    position: 'absolute',
    top: 46,
    left: 32,
  },
  imageProfile: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: 'cover',
  },
  imageParam: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 56,
    right: 32,
    resizeMode: 'cover',
  },
  titre: {
    fontSize: 80,
    fontWeight: 'bold',
    marginTop: 200,
    color: '#0E41AE',
    fontFamily: 'LobsterTwo-Bold',
  },
  button: {
    backgroundColor: '#e4f5f9',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 40,
    marginTop: 250,
    width: width * 0.75,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 36,
    color: '#000',
    fontFamily: 'LobsterTwo-Regular',
  },
});
