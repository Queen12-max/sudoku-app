import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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

const SelectionScreen = () => {
  const [avatarIndex, setAvatarIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadAvatar = async () => {
      const index = await AsyncStorage.getItem('selectedAvatarIndex');
      if (index !== null) setAvatarIndex(parseInt(index));
    };
    loadAvatar();
  }, []);

  const goToGrille = (niveau) => {
    router.push({
      pathname: '/Grille',
      params: { niveau },
    });
  };

  return (
    <View style={styles.container}>
      {/* Avatar à gauche */}
      <Image source={avatars[avatarIndex]} style={styles.avatar} />

      {/* Icône paramètres à droite */}
      <Image source={require('../assets/images/parametres-cog.png')} style={styles.param} />

      {/* Bloc central blanc */}
      <View style={styles.panel}>
        <Text style={styles.titre}>Sélectionnez votre niveau</Text>

        <TouchableOpacity style={styles.option} onPress={() => goToGrille('Facile')}>
          <Text style={styles.optionText}>Facile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => goToGrille('Moyen')}>
          <Text style={styles.optionText}>Moyen</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => goToGrille('Difficile')}>
          <Text style={styles.optionText}>Difficile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => goToGrille('Expert')}>
          <Text style={styles.optionText}>Expert</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bdeaf5cc',
    paddingTop: 40,
  },
  avatar: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 46,
    left: 32,
    borderRadius: 30,
  },
  param: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 56,
    right: 32,
  },
  panel: {
    backgroundColor: '#ffffff',
    marginTop: 150,
    marginHorizontal: 20,
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  titre: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'LobsterTwo-Bold',
  },
  option: {
    backgroundColor: '#bdeaf5',
    borderRadius: 30,
    width: width * 0.6,
    paddingVertical: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'LobsterTwo-Bold',
  },
});
