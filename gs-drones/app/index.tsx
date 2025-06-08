import { ActivityIndicator, View } from "react-native";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getToken } from "../token";

export default function IndexPage() {
	const router = useRouter();

	useEffect(() => {
		const checkToken = async () => {
			const token = await getToken();
			if (!token) {
				router.replace("/(usuario)/login");
			} else {
				router.replace("/(tabs)/home");
			}
		};
		checkToken();
	}, [router]);

	return (
		<View className="flex-1 items-center justify-center bg-black">
			<ActivityIndicator size="large" color="#00d9ff" />
		</View>
	);
}
