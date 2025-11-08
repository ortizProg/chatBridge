import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator // Importado para el estado de carga
} from 'react-native';
import React, { useState, useEffect } from 'react'; // Agregamos useEffect
import { COLORS, GLOBAL } from '../styles/styles';
import { Ionicons } from "@expo/vector-icons";
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
// 🚨 1. Importar useEvents
import { useEvents } from '../context/EventContext';


// Eliminamos DUMMY_EVENTS ya que usaremos los datos del contexto


// --- Pantalla Principal de Eventos ---
export default function EventsScreen({ navigation }) {
  // 🚨 2. Obtener eventos y estado de carga del contexto
  const { events, loading } = useEvents(); 
  const { user } = useAuth(); 

  const [activeTab, setActiveTab] = useState('populares');
  const [searchText, setSearchText] = useState('');
  // 🚨 3. Inicializar displayedEvents con la lista completa del contexto
  const [displayedEvents, setDisplayedEvents] = useState(events); 
  
  // 🚨 4. useEffect para actualizar la lista mostrada cuando los eventos cambien
  useEffect(() => {
    // Si la lista de eventos del contexto cambia (ej: se crea uno nuevo), 
    // reiniciamos la lista mostrada (displayedEvents) a la lista completa (events).
    // Nota: Esto también maneja la carga inicial.
    setDisplayedEvents(events);
  }, [events]); 


  // DEFINIR la lógica de redirección
  const handleProfilePress = () => {
    if (user) { 
      navigation.navigate("Profile"); 
    } else { 
      navigation.navigate("Login"); 
    }
  };


  // Funcion para actualizar la lista filtrada por busqueda
  const handleSearch = () => {
    const lowerCaseSearch = searchText.toLowerCase();

    // 5. Filtramos los eventos REALES del contexto, no DUMMY_EVENTS
    const allFiltered = events.filter(event =>
      event.title.toLowerCase().includes(lowerCaseSearch) ||
      event.address.toLowerCase().includes(lowerCaseSearch) // Usamos 'address' ya que 'location' no está en el modelo Firestore
    );

    setDisplayedEvents(allFiltered);
    console.log('Buscando eventos por:', searchText);
  };

  // Obtiene los eventos basandose en la pestaña y la busqueda
  const getEventsForTab = () => {
    const listToFilter = displayedEvents;

    if (activeTab === 'populares') {
      // Aquí se podría añadir lógica real para ordenar por 'likes' o 'attendees'
      return listToFilter;
    }
    if (activeTab === 'mis eventos') {
      // 6. Filtra por el ID del usuario actual (si existe)
      if (!user) return [];
      return listToFilter.filter(event => event.userId === user.uid);
    }
    return listToFilter; 
  };
  
  // 🚨 7. Muestra un indicador de carga mientras se obtienen los datos
  if (loading) {
      return (
          <View style={[styles.container, styles.loadingContainer]}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={[GLOBAL.text, { marginTop: 10, color: COLORS.primary }]}>Cargando eventos...</Text>
          </View>
      );
  }


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* ... (Header y Search Container no cambian) ... */}
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
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
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
          data={getEventsForTab()} // 8. FlatList usa la función que filtra los datos reales
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              // El campo que antes era 'location' ahora es 'address' en el modelo de Firestore
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  // ... (otros estilos no cambian) ...
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