import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { COLORS, GLOBAL } from '../styles/styles';
import { Ionicons } from "@expo/vector-icons";
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function EventsScreen({ navigation }) {
  const { events, loading } = useEvents();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('populares');
  const [searchText, setSearchText] = useState('');
  const [displayedEvents, setDisplayedEvents] = useState([]);

  // Sincronizar estado local con el contexto
  useEffect(() => {
    setDisplayedEvents(events);
  }, [events]);

  const handleProfilePress = () => {
    if (user) {
      navigation.navigate("Profile");
    } else {
      navigation.navigate("Login");
    }
  };

  const handleSearch = () => {
    const lowerCaseSearch = searchText.toLowerCase();
    const allFiltered = events.filter(event =>
      event.title.toLowerCase().includes(lowerCaseSearch) ||
      (event.address && event.address.toLowerCase().includes(lowerCaseSearch))
    );
    setDisplayedEvents(allFiltered);
  };

  const getEventsForTab = () => {
    // Si hay búsqueda activa, priorizar resultados de búsqueda
    if (searchText.trim() !== '') return displayedEvents;

    const listToFilter = events; // Usar siempre la fuente de verdad
    
    if (activeTab === 'populares') {
      return listToFilter;
    }
    if (activeTab === 'mis eventos') {
      if (!user) return [];
      return listToFilter.filter(event => event.userId === user.uid);
    }
    return listToFilter;
  };

  // Renderizado de carga
  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[GLOBAL.text, { marginTop: 10, color: COLORS.primary }]}>
            Cargando eventos...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, GLOBAL.text]}>Eventos</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleProfilePress} style={styles.profileIcon}>
              <Ionicons name="person-circle-outline" size={28} color={COLORS.accent || COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* BÚSQUEDA Y TABS */}
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
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
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

        {/* LISTA */}
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
        
        {/* FAB - Botón flotante para crear */}
        {user && (
            <TouchableOpacity 
                style={styles.fab}
                onPress={() => navigation.navigate('EventForm')} // Asegúrate que esta ruta existe en tu Navigator
            >
                <Ionicons name="add" size={30} color="#fff" />
            </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profileIcon: { marginLeft: 8 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface || '#222', borderRadius: 8, paddingRight: 5, marginBottom: 16 },
  searchInput: { flex: 1, color: COLORS.text, paddingVertical: 10, paddingHorizontal: 15 },
  searchButton: { padding: 10, marginLeft: 5, justifyContent: 'center', alignItems: 'center' },
  tabsContainer: { flexDirection: 'row', marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabActive: { borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.primary, fontSize: 16 },
  list: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 18, color: COLORS.textSecondary, textAlign: 'center' },
  fab: { position: 'absolute', bottom: 20, right: 20, backgroundColor: COLORS.primary, width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84 }
});