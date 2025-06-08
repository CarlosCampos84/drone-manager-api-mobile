import { useCallback, useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import { getToken } from "../../token";
import type { Suprimento } from "../../types";
import { SERVER_URL } from "../../server";

export default function SuprimentoListPage() {
	const [suprimentos, setSuprimentos] = useState<Suprimento[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const fetchSuprimentos = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = await getToken();
			const response = await axios.get(`${SERVER_URL}/suprimento`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setSuprimentos(response.data.content || []);
		} catch (err) {
			setError("Erro ao buscar suprimentos.");
		} finally {
			setLoading(false);
		}
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchSuprimentos();
		}, [fetchSuprimentos]),
	);

	const handleDelete = (id: number) => {
		Alert.alert(
			"Excluir Suprimento",
			"Tem certeza que deseja excluir este suprimento?",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Excluir",
					style: "destructive",
					onPress: async () => {
						try {
							const token = await getToken();
							await axios.delete(`${SERVER_URL}/suprimento/${id}`, {
								headers: { Authorization: `Bearer ${token}` },
							});
							await fetchSuprimentos();
							Alert.alert("Sucesso", "Suprimento excluído!");
						} catch (err) {
							Alert.alert("Erro", "Não foi possível excluir o suprimento.");
						}
					},
				},
			],
		);
	};

	const handleEdit = (id: number) => {
		router.push(`/(header)/suprimento/editar?id=${id}`);
	};

	return (
		<View className="flex-1 bg-black py-16 px-6">
			<Text className="text-2xl font-bold mb-4 text-white">Suprimentos</Text>
			<TouchableOpacity
				className="flex-row items-center justify-center bg-cyan-400 rounded-lg py-3 mb-6"
				onPress={() => router.push("/(header)/suprimento/novo")}
			>
				<Ionicons name="add" size={22} color="#000" />
				<Text className="text-black font-bold text-base ml-2">
					Cadastrar suprimento
				</Text>
			</TouchableOpacity>
			{loading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator color="#00d9ff" />
				</View>
			) : error ? (
				<Text className="text-red-400 text-center">{error}</Text>
			) : (
				<FlatList
					data={suprimentos}
					keyExtractor={(item) => item.id.toString()}
					ListEmptyComponent={
						<Text className="text-white text-center">
							Nenhum suprimento encontrado.
						</Text>
					}
					renderItem={({ item }) => (
						<View className="bg-zinc-900 rounded-lg p-4 mb-4 flex-row items-center justify-between">
							<View className="flex-1">
								<Text className="text-white font-bold text-lg">
									{item.nome}
								</Text>
								<Text className="text-zinc-300">{item.descricao}</Text>
								<Text className="text-zinc-400">Peso: {item.pesoKg} kg</Text>
							</View>
							<View className="flex-row items-center ml-2">
								<TouchableOpacity
									className="p-2 mr-2 rounded-full bg-cyan-600"
									onPress={() => handleEdit(item.id)}
								>
									<Ionicons name="create-outline" size={20} color="#fff" />
								</TouchableOpacity>
								<TouchableOpacity
									className="p-2 rounded-full bg-red-600"
									onPress={() => handleDelete(item.id)}
								>
									<Ionicons name="trash-outline" size={20} color="#fff" />
								</TouchableOpacity>
							</View>
						</View>
					)}
				/>
			)}
		</View>
	);
}
