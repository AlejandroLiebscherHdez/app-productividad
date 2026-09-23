import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeIn,
  FadeInDown,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, Colors, Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const RING_SIZE = 112;
const RING_RADIUS = 46;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;
const INITIAL_PROGRESS = 0.38;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const pendingTasks = [
  { id: '1', title: 'Preparar la revisión semanal', detail: 'Trabajo · Hoy, 09:00' },
  { id: '2', title: 'Responder a Laura sobre el prototipo', detail: 'Comunicación · Hoy' },
  { id: '3', title: 'Definir el flujo de adjuntos', detail: 'Sistema de productividad · Mañana' },
  { id: '4', title: 'Ordenar las notas de investigación', detail: 'Ideas · Esta semana' },
];

export default function HomeScreen() {
  const theme = useTheme();
  const [isComplete, setIsComplete] = useState(false);
  const progress = useSharedValue(INITIAL_PROGRESS);
  const cardScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(isComplete ? 1 : INITIAL_PROGRESS, { duration: 520 });
  }, [isComplete, progress]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isComplete ? 0.72 : 1, { duration: 420 }),
  }));

  const ringProgressProps = useAnimatedProps(() => ({
    strokeDashoffset: RING_LENGTH * (1 - progress.value),
  }));

  const pressTask = () => {
    // Reanimated requiere mutar explícitamente el valor compartido en el gesto.
    // eslint-disable-next-line react-hooks/immutability
    cardScale.value = withSpring(0.975, { damping: 16, stiffness: 320 }, () => {
      cardScale.value = withSpring(1, { damping: 14, stiffness: 240 });
    });
    setIsComplete((current) => !current);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">MIÉRCOLES, 23 DE SEPTIEMBRE</ThemedText>
              <ThemedText type="subtitle" style={styles.heading}>Hoy</ThemedText>
            </View>
            <View style={[styles.avatar, { backgroundColor: theme.backgroundElement }]}>
              <ThemedText type="small">A</ThemedText>
            </View>
          </View>

          <View style={styles.content}>
          <Animated.View entering={FadeIn.duration(500)} style={styles.progressArea}>
            <Animated.View style={ringStyle}>
              <Svg width={RING_SIZE} height={RING_SIZE} viewBox="0 0 112 112">
                <Circle
                  cx="56"
                  cy="56"
                  r={RING_RADIUS}
                  fill="none"
                  stroke={theme.backgroundElement}
                  strokeWidth="3"
                />
                <AnimatedCircle
                  cx="56"
                  cy="56"
                  r={RING_RADIUS}
                  fill="none"
                  stroke={Colors.light.textSecondary}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${RING_LENGTH} ${RING_LENGTH}`}
                  animatedProps={ringProgressProps}
                  transform="rotate(-90 56 56)"
                />
              </Svg>
            </Animated.View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(140).duration(520)} style={styles.actionArea}>
            <ThemedText type="small" themeColor="textSecondary" style={styles.contextLabel}>
              Continúa donde lo dejaste
            </ThemedText>

            <Animated.View style={cardStyle}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={isComplete ? 'Marcar tarea como pendiente' : 'Completar tarea'}
                onPress={pressTask}
                style={({ pressed }) => [styles.task, pressed && styles.taskPressed]}>
                <BlurView intensity={theme === Colors.dark ? 24 : 40} tint={theme === Colors.dark ? 'dark' : 'light'} style={styles.taskBlur} />
                <View style={[styles.taskMarker, { borderColor: theme.textSecondary }]}>
                  {isComplete && <View style={[styles.taskMarkerFill, { backgroundColor: theme.text }]} />}
                </View>
                <View style={styles.taskCopy}>
                  <ThemedText style={styles.taskTitle}>
                    Revisar las prioridades del día
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Proyecto personal
                  </ThemedText>
                </View>
              </Pressable>
            </Animated.View>
          </Animated.View>
          </View>

          <View style={styles.taskListHeader}>
            <ThemedText style={styles.listTitle}>Pendientes</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">4 tareas</ThemedText>
          </View>
          <View style={styles.taskList}>
            {pendingTasks.map((task, index) => (
              <Animated.View key={task.id} entering={FadeInDown.delay(220 + index * 65).duration(420)}>
                <Pressable accessibilityRole="button" accessibilityLabel={task.title} style={({ pressed }) => [styles.pendingTask, pressed && styles.taskPressed]}>
                  <View style={[styles.emptyMarker, { borderColor: theme.textSecondary }]} />
                  <View style={styles.pendingCopy}>
                    <ThemedText style={styles.pendingTitle}>{task.title}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary">{task.detail}</ThemedText>
                  </View>
                  <ThemedText type="small" themeColor="textSecondary">{index + 1}</ThemedText>
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: BottomTabInset + Spacing.four,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.two,
    paddingBottom: Spacing.four,
  },
  heading: {
    marginTop: Spacing.one,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
  },
  progressArea: {
    width: RING_SIZE,
    height: RING_SIZE,
    marginBottom: Spacing.five,
  },
  actionArea: {
    width: '100%',
  },
  taskListHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: Spacing.two,
  },
  listTitle: {
    fontSize: 21,
    lineHeight: 28,
    fontWeight: '600',
  },
  taskList: {
    gap: Spacing.one,
  },
  pendingTask: {
    minHeight: 70,
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    backgroundColor: 'rgba(128, 128, 128, 0.08)',
  },
  emptyMarker: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
  },
  pendingCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  pendingTitle: {
    fontSize: 15,
    lineHeight: 20,
  },
  contextLabel: {
    textAlign: 'center',
    letterSpacing: 0.2,
    marginBottom: Spacing.two,
  },
  task: {
    overflow: 'hidden',
    minHeight: 88,
    borderRadius: 28,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  taskBlur: {
    ...StyleSheet.absoluteFill,
  },
  taskPressed: {
    opacity: 0.82,
  },
  taskMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskMarkerFill: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  taskCopy: {
    flex: 1,
    gap: Spacing.half,
  },
  taskTitle: {
    fontFamily: Fonts.sans,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '600',
  },
});
