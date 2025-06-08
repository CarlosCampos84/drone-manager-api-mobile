import { Stack } from "expo-router";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HeaderLayout() {
	return (
		<Stack
			screenOptions={({ navigation }) => ({
				headerStyle: { backgroundColor: "#000" },
				headerTintColor: "#00d9ff",
				headerTitle: "",
				headerLeft: () => (
					<TouchableOpacity
						className="flex-row items-center ml-2"
						onPress={() => navigation.goBack()}
					>
						<Ionicons name="arrow-back" size={24} color="#00d9ff" />
						<Text className="text-cyan-400 ml-1 text-base">Voltar</Text>
					</TouchableOpacity>
				),
			})}
		/>
	);
}
