import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MODES } from '../theme';

export default function HomeScreen({ onSelectMode }) {
  return (
    <View>
      <Text style={styles.title}>🧮 Math Practice</Text>
      <Text style={styles.subtitle}>Pick something to practice. Each set has 20 questions.</Text>
      <View style={styles.menu}>
        {MODES.map((mode) => (
          <TouchableOpacity
            key={mode.key}
            activeOpacity={0.8}
            style={mode.wide ? styles.wideSlot : styles.slot}
            onPress={() => onSelectMode(mode.key)}
          >
            <LinearGradient colors={mode.colors} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Text style={styles.icon}>{mode.icon}</Text>
              <Text style={styles.label}>{mode.label}</Text>
              {mode.sub ? <Text style={styles.sub}>{mode.sub}</Text> : null}
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#35317a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
    fontSize: 15,
  },
  menu: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  slot: {
    width: '48%',
    marginBottom: 14,
  },
  wideSlot: {
    width: '100%',
    marginBottom: 14,
  },
  card: {
    borderRadius: 18,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  icon: {
    fontSize: 32,
    marginBottom: 6,
  },
  label: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
  },
  sub: {
    color: '#ffffffcc',
    fontSize: 12,
    marginTop: 2,
  },
});
