import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { SymbolView } from 'expo-symbols';
import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const dates = [
  { day: 'LUN', number: '21' },
  { day: 'MAR', number: '22' },
  { day: 'MIÉ', number: '23' },
  { day: 'JUE', number: '24' },
  { day: 'VIE', number: '25' },
  { day: 'SÁB', number: '26' },
];

const appointments = [
  { time: '09:00', title: 'Revisión semanal', detail: 'Sala tranquila · 45 min', color: '#809BFF' },
  { time: '11:30', title: 'Bloque de concentración', detail: 'Diseño de la experiencia', color: '#D49A66' },
  { time: '15:00', title: 'Sincronización de equipo', detail: 'Videollamada · 30 min', color: '#6FA78A' },
];

const focusBlocks = [
  { time: '13:00', title: 'Tiempo protegido', detail: 'Sin reuniones · Trabajo profundo' },
];

export default function CalendarScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(2);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}>
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">MIÉRCOLES, 23 DE SEPTIEMBRE</ThemedText>
              <ThemedText type="subtitle" style={styles.heading}>Agenda</ThemedText>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Añadir cita" style={[styles.addButton, { backgroundColor: theme.text }]}>
              <SymbolView name="plus" tintColor={theme.background} size={19} />
            </Pressable>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateStrip}>
            {dates.map((date, index) => {
              const selected = selectedDate === index;
              return (
                <Pressable key={date.number} accessibilityRole="button" accessibilityLabel={`${date.day} ${date.number}`} onPress={() => setSelectedDate(index)}>
                  <Animated.View layout={LinearTransition.springify()} style={[styles.date, selected && { backgroundColor: theme.text }]}>
                    <ThemedText type="small" style={selected && { color: theme.background }}>{date.day}</ThemedText>
                    <ThemedText style={[styles.dateNumber, selected && { color: theme.background }]}>{date.number}</ThemedText>
                    {index === 2 && <View style={[styles.todayDot, { backgroundColor: selected ? theme.background : theme.text }]} />}
                  </Animated.View>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Miércoles 23</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">3 citas</ThemedText>
          </View>
          <View style={styles.blockSection}>
            <ThemedText type="small" themeColor="textSecondary">BLOQUES DE TIEMPO</ThemedText>
            {focusBlocks.map((block) => (
              <View key={block.time} style={[styles.focusBlock, { backgroundColor: theme.backgroundElement }]}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.time}>{block.time}</ThemedText>
                <View style={styles.focusCopy}>
                  <ThemedText style={styles.appointmentTitle}>{block.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">{block.detail}</ThemedText>
                </View>
                <SymbolView name="moon.fill" tintColor={theme.textSecondary} size={14} />
              </View>
            ))}
          </View>
          <View style={styles.timeline}>
            {appointments.map((appointment, index) => (
              <Animated.View key={appointment.time} entering={FadeIn.delay(index * 80).duration(360)} style={styles.appointmentRow}>
                <ThemedText type="small" themeColor="textSecondary" style={styles.time}>{appointment.time}</ThemedText>
                <View style={[styles.timelineLine, { backgroundColor: theme.backgroundElement }]}>
                  <View style={[styles.timelineDot, { backgroundColor: appointment.color }]} />
                </View>
                <BlurView intensity={30} tint={theme.background === '#000000' ? 'dark' : 'light'} style={styles.appointmentCard}>
                  <View style={[styles.cardAccent, { backgroundColor: appointment.color }]} />
                  <View style={styles.appointmentCopy}>
                    <ThemedText style={styles.appointmentTitle}>{appointment.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{appointment.detail}</ThemedText>
                  </View>
                  <SymbolView name="chevron.right" tintColor={theme.textSecondary} size={13} />
                </BlurView>
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
  dateStrip: { gap: Spacing.two, paddingVertical: Spacing.two },
  date: { width: 54, height: 76, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 3 },
  dateNumber: { fontSize: 22, lineHeight: 27, fontWeight: '600' },
  todayDot: { width: 4, height: 4, borderRadius: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: Spacing.six, marginBottom: Spacing.three },
  sectionTitle: { fontSize: 21, lineHeight: 28, fontWeight: '600' },
  timeline: { gap: Spacing.three },
  blockSection: { gap: Spacing.two, marginBottom: Spacing.four },
  focusBlock: { minHeight: 68, borderRadius: 20, paddingHorizontal: Spacing.three, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  focusCopy: { flex: 1, gap: 3 },
  appointmentRow: { flexDirection: 'row', alignItems: 'center', minHeight: 82 },
  time: { width: 46 },
  timelineLine: { width: 2, height: 46, marginRight: Spacing.two, alignItems: 'center', justifyContent: 'center' },
  timelineDot: { width: 9, height: 9, borderRadius: 5 },
  appointmentCard: { flex: 1, minHeight: 76, overflow: 'hidden', borderRadius: 22, flexDirection: 'row', alignItems: 'center', paddingRight: Spacing.three },
  cardAccent: { width: 4, alignSelf: 'stretch', marginRight: Spacing.three },
  appointmentCopy: { flex: 1, gap: 3 },
  appointmentTitle: { fontSize: 16, fontWeight: '600' },
});