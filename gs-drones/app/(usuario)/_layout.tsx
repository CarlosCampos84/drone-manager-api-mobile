import { Stack } from "expo-router";

export default function UsuarioLayout() {
	return (
		<Stack screenOptions={{ headerShown: false }}>
			<Stack.Screen name="login" options={{ headerShown: false }} />
			<Stack.Screen name="registro" options={{ headerShown: false }} />
		</Stack>
	);
}
