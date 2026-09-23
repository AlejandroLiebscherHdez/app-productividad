import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import * as ImagePicker from 'expo-image-picker';
import { SymbolView } from 'expo-symbols';
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type TreeNode = {
  id: string;
  title: string;
  type: 'epic' | 'task' | 'subtask';
  children?: TreeNode[];
};

const projectTree: TreeNode[] = [
  {
    id: 'producto',
    title: 'Producto y experiencia',
    type: 'epic',
    children: [
      {
        id: 'home',
        title: 'Rediseñar la pantalla Hoy',
        type: 'task',
        children: [
          { id: 'home-ring', title: 'Indicador de progreso', type: 'subtask' },
          { id: 'home-card', title: 'Acción inmediata', type: 'subtask' },
        ],
      },
      {
        id: 'gestos',
        title: 'Definir gestos principales',
        type: 'task',
        children: [{ id: 'gestos-test', title: 'Validar con prototipo', type: 'subtask' }],
      },
    ],
  },
  {
    id: 'plataforma',
    title: 'Plataforma móvil',
    type: 'epic',
    children: [
      { id: 'media', title: 'Adjuntos desde Fotos', type: 'task' },
      { id: 'offline', title: 'Modo sin conexión', type: 'task' },
    ],
  },
];

function TreeRow({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(node.type === 'epic');
  const hasChildren = Boolean(node.children?.length);

  return (
    <Animated.View layout={LinearTransition.springify().damping(18)} style={styles.nodeGroup}>
      <Pressable
        accessibilityRole={hasChildren ? 'button' : 'text'}
        accessibilityLabel={hasChildren ? `${expanded ? 'Contraer' : 'Expandir'} ${node.title}` : node.title}
        onPress={() => hasChildren && setExpanded((current) => !current)}
        style={({ pressed }) => [styles.nodeRow, { paddingLeft: Spacing.three + depth * 22 }, pressed && styles.pressed]}>
        {hasChildren ? (
          <SymbolView name={expanded ? 'chevron.down' : 'chevron.right'} tintColor={theme.textSecondary} size={13} />
        ) : (
          <View style={styles.branchLine} />
        )}
        <View style={[styles.nodeIcon, node.type === 'epic' && { backgroundColor: theme.text }]}>
          <SymbolView
            name={node.type === 'epic' ? 'square.stack.3d.up.fill' : node.type === 'task' ? 'checkmark.circle' : 'circle.fill'}
            tintColor={node.type === 'epic' ? theme.background : theme.textSecondary}
            size={node.type === 'subtask' ? 7 : 14}
          />
        </View>
        <ThemedText style={[styles.nodeTitle, node.type === 'epic' && styles.epicTitle]} numberOfLines={1}>
          {node.title}
        </ThemedText>
        {node.type === 'epic' && <ThemedText type="small" themeColor="textSecondary">Épica</ThemedText>}
      </Pressable>
      {expanded && hasChildren && (
        <Animated.View entering={FadeIn.duration(180)} exiting={FadeOut.duration(140)}>
          {node.children?.map((child) => <TreeRow key={child.id} node={child} depth={depth + 1} />)}
        </Animated.View>
      )}
    </Animated.View>
  );
}

export default function ProjectsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [photoName, setPhotoName] = useState('');

  const attachPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled) {
      setPhotoName('Imagen lista para adjuntar');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 96 }} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <ThemedText type="small" themeColor="textSecondary">ESPACIO DE TRABAJO</ThemedText>
              <ThemedText type="subtitle" style={styles.heading}>Proyectos</ThemedText>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Crear proyecto" style={[styles.addButton, { backgroundColor: theme.text }]}>
              <SymbolView name="plus" tintColor={theme.background} size={19} />
            </Pressable>
          </View>

          <BlurView intensity={theme === Colors.dark ? 20 : 36} tint={theme === Colors.dark ? 'dark' : 'light'} style={styles.projectSummary}>
            <View style={styles.summaryTopLine}>
              <View style={[styles.statusDot, { backgroundColor: '#5B9C72' }]} />
              <ThemedText type="small" themeColor="textSecondary">ACTIVO</ThemedText>
            </View>
            <ThemedText style={styles.projectName}>Sistema de productividad</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">2 épicas · 6 tareas abiertas</ThemedText>
          </BlurView>

          <Pressable accessibilityRole="button" accessibilityLabel="Adjuntar foto desde el carrete" onPress={attachPhoto} style={({ pressed }) => [styles.photoButton, { borderColor: theme.backgroundElement }, pressed && styles.pressed]}>
            <SymbolView name="photo.on.rectangle.angled" tintColor={theme.text} size={18} />
            <View style={styles.photoCopy}>
              <ThemedText style={styles.photoTitle}>Adjuntar foto desde Camera Roll</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">{photoName || 'Añade contexto visual al proyecto'}</ThemedText>
            </View>
            <SymbolView name="chevron.right" tintColor={theme.textSecondary} size={13} />
          </Pressable>

          <View style={styles.treeHeader}>
            <ThemedText type="small" themeColor="textSecondary">ÁRBOL DEL PROYECTO</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">MAIN</ThemedText>
          </View>
          <View style={[styles.tree, { backgroundColor: theme.backgroundElement }]}>
            {projectTree.map((node) => <TreeRow key={node.id} node={node} />)}
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
  projectSummary: { overflow: 'hidden', borderRadius: 26, padding: Spacing.four, minHeight: 138, justifyContent: 'space-between' },
  photoButton: { minHeight: 70, borderWidth: 1, borderRadius: 21, paddingHorizontal: Spacing.three, marginTop: Spacing.two, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  photoCopy: { flex: 1, gap: Spacing.half },
  photoTitle: { fontSize: 14, fontWeight: '600' },
  summaryTopLine: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  projectName: { fontFamily: Fonts.sans, fontSize: 21, lineHeight: 27, fontWeight: '600' },
  treeHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.six, marginBottom: Spacing.two, paddingHorizontal: Spacing.one },
  tree: { borderRadius: 24, paddingVertical: Spacing.two, overflow: 'hidden' },
  nodeGroup: { width: '100%' },
  nodeRow: { minHeight: 54, paddingRight: Spacing.three, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  nodeIcon: { width: 25, height: 25, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  nodeTitle: { flex: 1, fontSize: 15, lineHeight: 20 },
  epicTitle: { fontWeight: '600' },
  branchLine: { width: 13, height: 1, backgroundColor: '#A8ADB5', marginLeft: 1 },
  pressed: { opacity: 0.62 },
});