import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import { COLORS, GLOBAL } from '../styles/styles';
import PublicationForm from '../components/PublicationForm';
import EventForm from '../components/EventForm';

export default function AddPublicationScreen() {
  const [activeTab, setActiveTab] = useState('post');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.headerTitle, GLOBAL.text]}>
          Nueva Publicación
        </Text>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'post' && styles.tabActive]}
            onPress={() => setActiveTab('post')}>
            <Text style={[styles.tabText, GLOBAL.text]}>Post</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'evento' && styles.tabActive]}
            onPress={() => setActiveTab('evento')}>
            <Text style={[styles.tabText, GLOBAL.text]}>Evento</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'post' ? <PublicationForm /> : <EventForm />}
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
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 20,
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
