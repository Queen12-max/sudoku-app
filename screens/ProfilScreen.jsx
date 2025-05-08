import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const AVATAR_KEY = 'selectedAvatarIndex';
const NAME_KEY = 'userName';

const generateUserId = () => {
  return 'User' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
};

const avatars = [
  require('../assets/images/photo.png'),
  require('../assets/images/avatar1.jpg'),
  require('../assets/images/avatar2.jpg'),
  require('../assets/images/avatar3.jpg'),
  require('../assets/images/avatar4.png'),
];

const niveaux = [
  { nom: 'Facile', best: '01:20', moyenne: '02:10', parties: 12, victoires: 12 },
  { nom: 'Moyen', best: '02:30', moyenne: '03:50', parties: 8, victoires: 8 },
  { nom: 'Difficile', best: '03:40', moyenne: '04:30', parties: 5, victoires: 3 },
  { nom: 'Expert', best: '05:10', moyenne: '06:20', parties: 2, victoires: 1 },
];

const UserDetailScreen = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [niveauIndex, setNiveauIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [userName, setUserName] = useState(generateUserId());

  useEffect(() => {
    const loadData = async () => {
      const storedIndex = await AsyncStorage.getItem(AVATAR_KEY);
      const storedName = await AsyncStorage.getItem(NAME_KEY);
      if (storedIndex !== null) setSelectedIndex(parseInt(storedIndex));
      if (storedName) setUserName(storedName);
    };
    loadData();
  }, []);

  const handleEdit = async () => {
    if (editMode) {
      await AsyncStorage.setItem(AVATAR_KEY, selectedIndex.toString());
      await AsyncStorage.setItem(NAME_KEY, userName);
    }
    setEditMode(!editMode);
  };

  const handlePrev = () => {
    if (niveauIndex > 0) setNiveauIndex(niveauIndex - 1);
  };

  const handleNext = () => {
    if (niveauIndex < niveaux.length - 1) setNiveauIndex(niveauIndex + 1);
  };

  const niveau = niveaux[niveauIndex];

  return (
    <View style={styles.container}>
      {/* 🔙 Header haut avec retour et paramètres */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Image source={require('../assets/images/retour.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => console.log('Accès aux paramètres')}>
          <Image source={require('../assets/images/parametres-cog.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>

      {/* 👤 Avatar + nom */}
      <View style={styles.topRow}>
        <Image source={avatars[selectedIndex]} style={styles.avatar} />
        {editMode ? (
          <TextInput
            style={styles.titleInput}
            value={userName}
            onChangeText={setUserName}
            placeholder="Nom d'utilisateur"
          />
        ) : (
          <Text style={styles.title}>{userName}</Text>
        )}
      </View>

      {/* ✏️ Bouton édition */}
      <TouchableOpacity style={styles.editBtn} onPress={handleEdit}>
        <Text style={styles.editText}>{editMode ? "Terminer" : "Éditer"}</Text>
      </TouchableOpacity>

      {/* Avatars à choisir si en édition */}
      {editMode && (
        <View style={styles.avatarList}>
          {avatars.map((avatar, index) => (
            <TouchableOpacity key={index} onPress={() => setSelectedIndex(index)}>
              <Image source={avatar} style={[styles.avatarOption, selectedIndex === index && styles.selected]} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Niveau entre barres et flèches */}
      <View style={styles.decoratedBlock}>
        <View style={styles.bar} />
        <View style={styles.niveauRow}>
          <TouchableOpacity onPress={handlePrev} disabled={niveauIndex === 0}>
            <Text style={[styles.arrow, niveauIndex === 0 && styles.disabled]}>◀️</Text>
          </TouchableOpacity>
          <Text style={styles.niveauTitle}>{niveau.nom}</Text>
          <TouchableOpacity onPress={handleNext} disabled={niveauIndex === niveaux.length - 1}>
            <Text style={[styles.arrow, niveauIndex === niveaux.length - 1 && styles.disabled]}>▶️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bar} />
      </View>

      {/* 📊 Statistiques encadrées */}
      {['best', 'moyenne', 'parties', 'victoires'].map((key, i) => (
        <View key={i} style={styles.decoratedBlock}>
          <View style={styles.bar} />
          <Text style={styles.cardText}>
            {key === 'best' && `🏆 Meilleur score : ${niveau.best}`}
            {key === 'moyenne' && `⏱️ Temps moyen : ${niveau.moyenne}`}
            {key === 'parties' && `🎮 Parties jouées : ${niveau.parties}`}
            {key === 'victoires' && `🥇 Victoires : ${niveau.victoires}`}
          </Text>
          <View style={styles.bar} />
        </View>
      ))}
    </View>
  );
};

export default UserDetailScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EAF7FF',
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#48C9B0',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0E41AE',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0E41AE',
    borderBottomWidth: 1,
    borderColor: '#0E41AE',
    paddingHorizontal: 10,
    width: 180,
  },
  editBtn: {
    backgroundColor: '#0E41AE',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
  },
  editText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  avatarList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  avatarOption: {
    width: 60,
    height: 60,
    margin: 6,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: '#48C9B0',
  },
  decoratedBlock: {
    alignItems: 'center',
    marginVertical: 10,
    width: '100%',
  },
  bar: {
    height: 1,
    width: '80%',
    backgroundColor: '#0E41AE',
    marginVertical: 6,
  },
  niveauRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  niveauTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#0E41AE',
    textAlign: 'center',
  },
  arrow: {
    fontSize: 32,
    color: '#0E41AE',
  },
  disabled: {
    opacity: 0.3,
  },
  cardText: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginVertical: 2,
  },
});
