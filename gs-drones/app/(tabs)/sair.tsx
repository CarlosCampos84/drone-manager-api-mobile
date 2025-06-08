import { useCallback } from "react";
import { ActivityIndicator, View, Alert } from "react-native";
import { logout } from "../../token";
import { router, useFocusEffect } from "expo-router";

export default function SairPage() {
	useFocusEffect(
		useCallback(() => {
			Alert.alert(
				"Sair",
				"Tem certeza que deseja sair da sua conta?",
				[
					{
						text: "Cancelar",
						style: "cancel",
						onPress: () => router.back(),
					},
					{
						text: "Sair",
						style: "destructive",
						onPress: async () => {
							await logout();
							router.replace("/(usuario)/login");
						},
					},
				],
				{ cancelable: false },
			);
		}, []),
	);

	return (
		<View className="flex-1 items-center justify-center bg-black">
			<ActivityIndicator size="large" color="#00d9ff" />
		</View>
	);
}
