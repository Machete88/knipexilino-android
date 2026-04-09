import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: '#131920', borderTopColor: '#1f2937' },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        headerStyle: { backgroundColor: '#0b0f14' },
        headerTintColor: '#ffffff',
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarLabel: 'Home' }} />
      <Tabs.Screen name="documents" options={{ title: 'Dokumente', tabBarLabel: 'Dokumente' }} />
      <Tabs.Screen name="scan" options={{ title: 'Scan', tabBarLabel: 'Scan' }} />
      <Tabs.Screen name="settings" options={{ title: 'Einstellungen', tabBarLabel: 'Settings' }} />
    </Tabs>
  );
}
