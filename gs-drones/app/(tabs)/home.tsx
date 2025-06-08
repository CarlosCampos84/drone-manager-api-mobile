import React, { useCallback, useState } from "react";
import axios from "axios";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import type { Drone } from "../../types";
import { getToken } from "../../token";
import { Ionicons } from "@expo/vector-icons";
import { SERVER_URL } from "../../server";

export default function HomePage() {
	const [drones, setDrones] = useState<Drone[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const fetchDrones = useCallback(async () => {
		setLoading(true);
		try {
			const token = await getToken();
			const response = await axios.get(`${SERVER_URL}/drone`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			setDrones(response.data.content);
		} catch (error) {
			setError("Erro ao buscar drones");
		} finally {
			setLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchDrones();
		}, [fetchDrones]),
	);

	const handleDeleteDrone = async (droneId: number) => {
		Alert.alert(
			"Excluir Drone",
			"Tem certeza que deseja excluir este drone? Esta ação não pode ser desfeita.",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Excluir",
					style: "destructive",
					onPress: async () => {
						try {
							const token = await getToken();
							await axios.delete(`${SERVER_URL}/drone/${droneId}`, {
								headers: { Authorization: `Bearer ${token}` },
							});
							setDrones((prev) => prev.filter((d) => d.id !== droneId));
							Alert.alert("Sucesso", "Drone excluído com sucesso.");
						} catch (err) {
							Alert.alert("Erro", "Não foi possível excluir o drone.");
						}
					},
				},
			],
		);
	};

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-black">
				<ActivityIndicator size="large" color="#00d9ff" />
			</View>
		);
	}

	if (error) {
		return (
			<View className="flex-1 justify-center items-center bg-black">
				<Text className="text-red-400">{error}</Text>
			</View>
		);
	}

	return (
		<View className="flex-1 bg-black py-16 px-6">
			<Text className="text-2xl font-bold mb-4 text-white">
				Lista de Drones
			</Text>
			<TouchableOpacity
				className="mb-4 bg-cyan-400 rounded-lg p-3 items-center flex-row justify-center gap-1"
				onPress={() => router.push("/(header)/drone/novo")}
			>
				<Ionicons name="add-circle-outline" size={24} color={"#000"} />
				<Text className="font-semibold items-center">Cadastrar novo drone</Text>
			</TouchableOpacity>
			<FlatList
				data={drones}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => (
					<View className="flex-row items-center justify-between border-b border-zinc-700 p-4">
						<TouchableOpacity
							className="flex-1"
							onPress={() => router.push(`/drone/${item.id}`)}
						>
							<Text className="text-base text-white">Nome: {item.nome}</Text>
							<Text className="text-base text-white">Tipo: {item.tipo}</Text>
							<Text className="text-base text-white">
								Capacidade: {item.capacidadeKg} kg
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							className="ml-4 p-2 rounded-full bg-red-600"
							onPress={() => handleDeleteDrone(item.id)}
						>
							<Ionicons name="trash" size={22} color="#fff" />
						</TouchableOpacity>
					</View>
				)}
				ListEmptyComponent={
					<Text className="text-white text-center">
						Nenhum drone encontrado.
					</Text>
				}
			/>
		</View>
	);
}
