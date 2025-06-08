import { useCallback, useEffect, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import {
	View,
	Text,
	TouchableOpacity,
	ActivityIndicator,
	FlatList,
	Alert,
} from "react-native";
import axios from "axios";
import { getToken } from "../../../token";
import type { Drone, Missao } from "../../../types";
import { Ionicons } from "@expo/vector-icons";
import { SERVER_URL } from "../../../server";

const statusOptions = [
	{ label: "Todos", value: "" },
	{ label: "Em andamento", value: "EM_ANDAMENTO" },
	{ label: "Concluído", value: "CONCLUIDO" },
	{ label: "Cancelado", value: "CANCELADO" },
];

export default function DroneDetalhesPage() {
	const { id } = useLocalSearchParams();

	const [status, setStatus] = useState("");
	const [loading, setLoading] = useState(false);
	const [missoes, setMissoes] = useState<Missao[]>([]);
	const [drone, setDrone] = useState<Drone>({} as Drone);
	const [error, setError] = useState<string | null>(null);

	const fetchDrone = useCallback(async () => {
		try {
			const token = await getToken();
			const response = await axios.get(`${SERVER_URL}/drone/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setDrone(response.data);
		} catch (e) {
			router.back();
		}
	}, [id]);

	const fetchMissoes = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const token = await getToken();
			const params = { droneId: id, status: "", sort: "id,desc" };
			if (status) params.status = status;
			const response = await axios.get(`${SERVER_URL}/missao`, {
				headers: { Authorization: `Bearer ${token}` },
				params,
			});
			setMissoes(response.data.content || []);
		} catch (e) {
			setError("Erro ao buscar missões.");
		}
		setLoading(false);
	}, [id, status]);

	useEffect(() => {
		if (id) fetchDrone();
	}, [fetchDrone, id]);

	useFocusEffect(
		useCallback(() => {
			fetchMissoes();
		}, [fetchMissoes]),
	);

	const handleCancelarMissao = async (missaoId: number) => {
		Alert.alert(
			"Cancelar Missão",
			"Tem certeza que deseja cancelar esta missão? Esta ação não pode ser desfeita.",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Confirmar",
					style: "destructive",
					onPress: async () => {
						try {
							const token = await getToken();
							await axios.delete(`${SERVER_URL}/missao/${missaoId}`, {
								headers: { Authorization: `Bearer ${token}` },
							});
							await fetchMissoes();
							Alert.alert("Sucesso", "Missão cancelada com sucesso.");
						} catch (err) {
							Alert.alert("Erro", "Não foi possível cancelar a missão.");
						}
					},
				},
			],
		);
	};

	const handleConcluirMissao = async (missaoId: number) => {
		Alert.alert(
			"Concluir Missão",
			"Tem certeza que deseja concluir esta missão? Esta ação não pode ser desfeita.",
			[
				{ text: "Cancelar", style: "cancel" },
				{
					text: "Confirmar",
					onPress: async () => {
						try {
							const token = await getToken();
							await axios.patch(
								`${SERVER_URL}/missao/concluir/${missaoId}`,
								{},
								{
									headers: { Authorization: `Bearer ${token}` },
								},
							);
							await fetchMissoes();
							Alert.alert("Sucesso", "Missão concluida com sucesso.");
						} catch (err) {
							Alert.alert("Erro", "Não foi possível concluir a missão.");
						}
					},
				},
			],
		);
	};

	return (
		<View className="flex-1 bg-black px-4 py-8">
			<Text className="text-white text-3xl font-bold mb-4 text-center">
				{drone.nome}
			</Text>
			<Text className="text-zinc-400 text-base mb-6 text-center">
				Missões do drone
			</Text>
			<TouchableOpacity
				className={`flex-row items-center justify-center rounded-lg py-3 mb-6 ${
					missoes.some((m) => m.status === "EM_ANDAMENTO")
						? "bg-zinc-700"
						: "bg-cyan-400"
				}`}
				onPress={() => {
					if (!missoes.some((m) => m.status === "EM_ANDAMENTO")) {
						router.push(`/(header)/missao/novo?droneId=${id}`);
					}
				}}
				disabled={missoes.some((m) => m.status === "EM_ANDAMENTO")}
			>
				<Ionicons
					name="add-circle-outline"
					size={24}
					color={
						missoes.some((m) => m.status === "EM_ANDAMENTO") ? "#888" : "#000"
					}
				/>
				<Text
					className={`font-bold text-base ml-2 $
						missoes.some((m) => m.status === "EM_ANDAMENTO")
							? "text-zinc-400"
							: ""`}
				>
					Cadastrar missão
				</Text>
			</TouchableOpacity>
			<View className="gap-2 w-full mb-6">
				{statusOptions.map((opt) => (
					<TouchableOpacity
						key={opt.value}
						className={`px-3 py-2 rounded-lg border items-center ${
							status === opt.value
								? "bg-cyan-400 border-cyan-400"
								: "bg-zinc-800 border-zinc-700"
						}`}
						onPress={() => setStatus(opt.value)}
					>
						<Text
							className={
								status === opt.value ? "text-black font-bold" : "text-white"
							}
						>
							{opt.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			{loading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator color="#00d9ff" />
				</View>
			) : error ? (
				<Text className="text-red-400 text-center">{error}</Text>
			) : (
				<FlatList
					data={missoes}
					keyExtractor={(item) => item.id.toString()}
					ListEmptyComponent={
						<Text className="text-white text-center">
							Nenhuma missão encontrada.
						</Text>
					}
					renderItem={({ item }) => (
						<View className="bg-zinc-900 rounded-lg p-4 mb-4">
							<Text className="text-cyan-400 font-bold text-lg mb-1">
								{item.descricao}
							</Text>
							<Text className="text-white mb-1">
								Status: <Text className="font-bold">{item.status}</Text>
							</Text>
							<Text className="text-white mb-1">
								Início:{" "}
								{item.dataInicio
									? new Date(item.dataInicio).toLocaleString()
									: "-"}
							</Text>
							<Text className="text-white mb-1">
								Fim:{" "}
								{item.dataFim
									? new Date(item.dataFim).toLocaleString()
									: "Sem data fim"}
							</Text>
							<Text className="text-white mb-1">
								Peso Total: {item.pesoTotal} kg
							</Text>
							<Text className="text-white mb-1">
								Tipo Drone: {item.drone?.tipo} ({item.drone?.capacidadeKg} kg)
							</Text>
							<Text className="text-white font-semibold mt-2 mb-1">
								Suprimentos:
							</Text>
							{item.suprimentos && item.suprimentos.length > 0 ? (
								item.suprimentos.map((s) => (
									<View key={s.suprimento.id} className="mb-1 ml-2">
										<Text className="text-zinc-300">
											- {s.suprimento.nome} ({s.quantidade}x,{" "}
											{s.suprimento.pesoKg} kg cada)
										</Text>
										<Text className="text-zinc-500 text-xs ml-2">
											{s.suprimento.descricao}
										</Text>
									</View>
								))
							) : (
								<Text className="text-zinc-400 ml-2">Nenhum suprimento.</Text>
							)}
							{!item.dataFim && (
								<View className="flex-row justify-between mt-4 gap-2">
									<TouchableOpacity
										className="flex-row items-center justify-center bg-red-400 rounded-lg py-3 mb-6 flex-1"
										onPress={() => handleCancelarMissao(item.id)}
									>
										<Ionicons
											name="close-circle-outline"
											size={24}
											color={"#000"}
										/>
										<Text className="font-bold text-base ml-2">Cancelar</Text>
									</TouchableOpacity>
									<TouchableOpacity
										className="flex-row items-center justify-center bg-emerald-400 rounded-lg py-3 mb-6 flex-1"
										onPress={() => handleConcluirMissao(item.id)}
									>
										<Ionicons
											name="checkmark-circle"
											size={24}
											color={"#000"}
										/>
										<Text className="font-bold text-base ml-2">Concluir</Text>
									</TouchableOpacity>
								</View>
							)}
						</View>
					)}
				/>
			)}
		</View>
	);
}
