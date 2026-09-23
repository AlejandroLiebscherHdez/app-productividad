import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const notes = [
  { id: '1', title: 'Ideas para mañana', body: 'Dejar espacio para pensar antes de llenar la agenda.', color: '#E8E1D4' },
  { id: '2', title: 'Lecturas', body: 'Diseño calmado, sistemas que desaparecen y productos con criterio.', color: '#D8E3E0' },
  { id: '3', title: 'Lista rápida', body: 'Cámara\nFotos\nSincronización\nAtajos', color: '#E2DDE8' },
  { id: '4', title: 'Reunión de producto', body: 'Preguntar por el flujo de adjuntos y el estado offline.', color: '#E8D9D1' },
];

export default function NotesScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}>
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">CAPTURAS RÁPIDAS</ThemedText>
              <ThemedText type="subtitle" style={styles.heading}>Notas</ThemedText>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Crear nota" style={[styles.addButton, { backgroundColor: theme.text }]}>
              <SymbolView name="plus" tintColor={theme.background} size={19} />
            </Pressable>
          </View>

          <View style={styles.grid}>
            {notes.map((note, index) => (
              <Animated.View key={note.id} entering={FadeInDown.delay(index * 55).duration(420)} style={styles.noteWrapper}>
                <Pressable accessibilityRole="button" accessibilityLabel={`Abrir nota ${note.title}`} style={({ pressed }) => [styles.notePressable, pressed && styles.pressed]}>
                  <BlurView intensity={28} tint="light" style={[styles.note, { backgroundColor: note.color }]}>
                    <ThemedText style={styles.noteTitle}>{note.title}</ThemedText>
                    <ThemedText style={styles.noteBody}>{note.body}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" style={styles.noteDate}>Hoy</ThemedText>
                  </BlurView>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.three },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: Spacing.two, paddingBottom: Spacing.four },
  heading: { marginTop: Spacing.one },
  addButton: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: Spacing.three },
  noteWrapper: { width: '47.7%' },
  notePressable: { borderRadius: 24 },
  note: { minHeight: 174, borderRadius: 24, overflow: 'hidden', padding: Spacing.three, justifyContent: 'space-between' },
  noteTitle: { fontFamily: Fonts.sans, fontSize: 16, fontWeight: '600', color: '#30302E' },
  noteBody: { color: '#454542', fontSize: 14, lineHeight: 20 },
  noteDate: { color: '#72716B' },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
});