import { StyleSheet, Text, View, FlatList } from 'react-native';

import { COLORS, GLOBAL } from '../styles/styles';
import MenuItem from '../components/MenuItem';
import { useAuth } from '../contexts/authContext';

export default function SettingsScreen({navigation}) {

  const { user, logout } = useAuth();

  const options = [];
  
  if(user) {
    options.push(
      {
        id: 1,
        text: 'Cerrar sesión',
        icon: 'exit-outline',
        onPress: async () => {
          const successLogout = await logout();
          if(!successLogout) return;
          navigation?.navigate('Login')
        }
      }
    )
  }



  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MenuItem item={item} />}
      >
      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
    paddingTop: 40
  },
  text: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: COLORS.primary, 
    textAlign: "center",
  },
});
