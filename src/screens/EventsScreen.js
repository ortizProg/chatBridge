import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList
} from 'react-native';
import React, { useState } from 'react';
import { COLORS, GLOBAL } from '../styles/styles';
import { Ionicons } from "@expo/vector-icons";
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';



const DUMMY_EVENTS = [
  {
    id: '1',
    title: 'Temas de estudio',
    location: 'Río otun, Pereira, Risaralda',
    date: '25/09/202ES, 3:00pm',
    attendees: 10,
    likes: 415,
    imageUrl: 'https://imgs.search.brave.com/_oIRzfMh3rnSoCeKht2wosOReyaWfeYhgD_mJh_Lw3s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy53aW5zcG9ydHMu/Y28vYXNzZXRzL3B1/YmxpYy9zdHlsZXMv/bGFyZ2UvcHVibGlj/LzIwMjQtMTAvZGF5/cm8lMjBlbiUyMHdp/bi5qcGcud2VicD9p/dG9rPTJzcl82MUdC',
  },
  {
    id: '2',
    title: 'Charla de Finanzas',
    location: 'Campus principal, Auditorio A',
    date: '25/09/202ES, 3:00pm',
    attendees: 30,
    likes: 14,
    imageUrl: 'https://imgs.search.brave.com/_oIRzfMh3rnSoCeKht2wosOReyaWfeYhgD_mJh_Lw3s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy53aW5zcG9ydHMu/Y28vYXNzZXRzL3B1/YmxpYy9zdHlsZXMv/bGFyZ2UvcHVibGlj/LzIwMjQtMTAvZGF5/cm8lMjBlbiUyMHdp/bi5qcGcud2VicD9p/dG9rPTJzcl82MUdC',
  },
  {
    id: '3',
    title: 'Noche de Parranda',
    location: 'Campus principal, Edificio C',
    date: '30/09/202ES, 8:00pm',
    attendees: 55,
    likes: 98,
    imageUrl: 'https://imgs.search.brave.com/_oIRzfMh3rnSoCeKht2wosOReyaWfeYhgD_mJh_Lw3s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy53aW5zcG9ydHMu/Y28vYXNzZXRzL3B1/YmxpYy9zdHlsZXMv/bGFyZ2UvcHVibGlj/LzIwMjQtMTAvZGF5/cm8lMjBlbiUyMHdp/bi5qcGcud2VicD9p/dG9rPTJzcl82MUdC',
  },
  {
    id: '4',
    title: 'Maratón de Código',
    location: 'Salón de Sistemas, 4to piso',
    date: '10/10/202ES, 9:00am',
    attendees: 22,
    likes: 31,
    imageUrl: 'https://imgs.search.brave.com/_oIRzfMh3rnSoCeKht2wosOReyaWfeYhgD_mJh_Lw3s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy53aW5zcG9ydHMu/Y28vYXNzZXRzL3B1/YmxpYy9zdHlsZXMv/bGFyZ2UvcHVibGlj/LzIwMjQtMTAvZGF5/cm8lMjBlbiUyMHdp/bi5qcGcud2VicD9p/dG9rPTJzcl82MUdC',
  },
];


// --- Pantalla Principal de Eventos ---
export default function EventsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('populares');
  const [searchText, setSearchText] = useState('');
  const [displayedEvents, setDisplayedEvents] = useState(DUMMY_EVENTS);
  

  const { user } = useAuth(); 

  // DEFINIR la lógica de redirección
  const handleProfilePress = () => {
    if (user) { // Si hay un usuario (está logueado)
      navigation.navigate("Profile"); // Navegar al perfil
    } else { // Si NO hay un usuario
      navigation.navigate("Login"); // Navegar al login
    }
  };


  // Funcion para actualizar la lista filtrada
  const handleSearch = () => {
    const lowerCaseSearch = searchText.toLowerCase();

    // Filtramos DUMMY_EVENTS y luego aplicamos la logica de pestañas
    const allFiltered = DUMMY_EVENTS.filter(event =>
      event.title.toLowerCase().includes(lowerCaseSearch) ||
      event.location.toLowerCase().includes(lowerCaseSearch)
    );

    setDisplayedEvents(allFiltered);
    console.log('Buscando eventos por:', searchText);
    // Aqui iria la logica para filtrar la lista de eventos
  };

  // Obtiene los eventos basandose en la pestaña y la busqueda
  const getEventsForTab = () => {
    // 1. Obtener la lista base (ya filtrada por busqueda)
    const listToFilter = displayedEvents;

    // 2. Aplicar el filtro de la pestaña
    if (activeTab === 'populares') {
      // Si es populares, simplemente muestra la lista filtrada por la busqueda
      return listToFilter;
    }
    if (activeTab === 'mis eventos') {
      
      return listToFilter.filter(event => event.id === '1');
    }
    return listToFilter; 
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

      
        <View style={styles.header}>
          <Text style={[styles.headerTitle, GLOBAL.text]}>Eventos</Text>

          
          <View style={styles.headerIcons}>
            <TouchableOpacity >
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleProfilePress} 
              style={styles.profileIcon}
            >
              
              <Ionicons name="person-circle-outline" size={28} color={COLORS.accent || COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

       
        <View>
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Buscar eventos..."
              placeholderTextColor={COLORS.textSecondary || '#888'}
              style={[styles.searchInput, GLOBAL.text]}
              value={searchText}
              onChangeText={setSearchText} // Usar directamente el setter
              onSubmitEditing={handleSearch}
              // Asegurarse de que el TextInput no tenga autoFocus ni este siempre enfocado.
            />
          
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Ionicons name="search" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'populares' && styles.tabActive]}
              onPress={() => setActiveTab('populares')}>
              <Text style={[styles.tabText, GLOBAL.text]}>Populares</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'mis eventos' && styles.tabActive]}
              onPress={() => setActiveTab('mis eventos')}>
              <Text style={[styles.tabText, GLOBAL.text]}>Mis eventos</Text>
            </TouchableOpacity>
          </View>
        </View>


      
        <FlatList
          data={getEventsForTab()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate('EventDetail', { event: item })}
            />
          )}
          showsVerticalScrollIndicator={false}
          style={styles.list}
          
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, GLOBAL.text]}>No se encontraron eventos.</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileIcon: {
    marginLeft: 8,
  },


  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface || '#222',
    borderRadius: 8,
    paddingRight: 5,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  searchButton: {
    padding: 10,
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  list: {
    // Asegurar que FlatList ocupe el espacio restante
    flex: 1, 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.textSecondary,
    textAlign: 'center',
  }
});
