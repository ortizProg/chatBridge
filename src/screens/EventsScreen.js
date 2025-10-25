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
// 🚨 Importamos Ionicons de @expo/vector-icons, como en tu Header.js
import { Ionicons } from "@expo/vector-icons"; 
// 🚨 REVISA ESTA RUTA si no está en components
import EventCard from '../components/EventCard'; 

// --- Datos de ejemplo ---
const DUMMY_EVENTS = [
  {
    id: '1',
    title: 'Temas de estudio',
    location: 'Río otun, Pereira, Risaralda',
    date: '25/09/2025, 3:00pm',
    attendees: 10,
    likes: 415, // Según el wireframe
    // 🚨 RUTA DE IMAGEN PARA EL FONDO DE LA TARJETA
    imageUrl: 'https://imgs.search.brave.com/_oIRzfMh3rnSoCeKht2wosOReyaWfeYhgD_mJh_Lw3s/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9maWxl/cy53aW5zcG9ydHMu/Y28vYXNzZXRzL3B1/YmxpYy9zdHlsZXMv/bGFyZ2UvcHVibGlj/LzIwMjQtMTAvZGF5/cm8lMjBlbiUyMHdp/bi5qcGcud2VicD9p/dG9rPTJzcl82MUdC', 
  },
  {
    id: '2',
    title: 'Temas de estudio',
    location: 'Río otun, Pereira, Risaralda',
    date: '25/09/2025, 3:00pm',
    attendees: 10,
    likes: 14, // Según el wireframe
    // 🚨 RUTA DE IMAGEN PARA EL FONDO DE LA TARJETA
    imageUrl: 'https://ejemplo.com/imagenes/evento2.jpg', 
  },
  {
    id: '3',
    title: 'Noche de Parranda',
    location: 'Campus principal, Edificio C',
    date: '30/09/2025, 8:00pm',
    attendees: 55,
    likes: 98,
    // 🚨 RUTA DE IMAGEN PARA EL FONDO DE LA TARJETA
    imageUrl: 'https://ejemplo.com/imagenes/evento3.jpg', 
  },
  {
    id: '4',
    title: 'Maratón de Código',
    location: 'Salón de Sistemas, 4to piso',
    date: '10/10/2025, 9:00am',
    attendees: 22,
    likes: 31,
    // 🚨 RUTA DE IMAGEN PARA EL FONDO DE LA TARJETA
    imageUrl: 'https://ejemplo.com/imagenes/evento4.jpg', 
  },
];


// --- Pantalla Principal de Eventos ---
export default function EventsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('populares');
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    // Aquí iría la lógica para filtrar la lista de eventos
    console.log('Buscando eventos por:', searchText);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* --- Encabezado (MODIFICADO) --- */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, GLOBAL.text]}>Eventos</Text>
          
          {/* Íconos de Notificaciones y Perfil, adaptados de tu Header.js */}
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.profileIcon}>
              {/* Usamos size 28 y accent color para el perfil, igual que tu componente */}
              <Ionicons name="person-circle-outline" size={28} color={COLORS.accent || COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- Barra de Búsqueda --- */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Buscar eventos..."
            placeholderTextColor={COLORS.textSecondary || '#888'}
            style={[styles.searchInput, GLOBAL.text]}
            value={searchText}
            onChangeText={setSearchText}
            onSubmitEditing={handleSearch} 
          />
          
          {/* Botón de búsqueda explícito */}
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
          >
            <Ionicons name="search" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* --- Pestañas --- */}
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

        {/* --- Lista de Eventos --- */}
        <FlatList
          data={DUMMY_EVENTS}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard
              event={item}
              onPress={() => navigation.navigate('EventDetail', { event: item })}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

// --- Estilos Específicos de la Pantalla ---
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
  // ESTILO HEADER MODIFICADO
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
  // NUEVOS ESTILOS PARA EL GRUPO DE ÍCONOS
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12, 
  },
  profileIcon: {
    marginLeft: 8,
  },
  // FIN ESTILOS HEADER

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
});