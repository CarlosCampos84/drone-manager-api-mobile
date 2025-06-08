import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#00d9ff",
				tabBarInactiveTintColor: "#ddd",
				headerShown: false,
				tabBarStyle: {
					backgroundColor: "#000",
					borderTopColor: "#111",
				},
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="desenvolvedores"
				options={{
					title: "Desenvolvedores",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="people-outline" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="suprimentos"
				options={{
					title: "Suprimentos",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="medkit-outline" color={color} size={size} />
					),
				}}
			/>
			<Tabs.Screen
				name="sair"
				options={{
					title: "Sair",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="exit-outline" color={color} size={size} />
					),
				}}
			/>
		</Tabs>
	);
}
