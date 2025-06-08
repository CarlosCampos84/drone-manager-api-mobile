import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
	Alert,
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
} from "react-native";
import type { Drone, Suprimento } from "../../../types";
import axios from "axios";
import { getToken } from "../../../token";
import { SERVER_URL } from "../../../server";

export default function NovoMissaoPage() {
	const { droneId } = useLocalSearchParams();

	const [suprimentos, setSuprimentos] = useState<Suprimento[]>([]);
	const [drone, setDrone] = useState<Drone | null>(null);
	const [descricao, setDescricao] = useState("");
	const [selected, setSelected] = useState<{ [id: number]: number }>({});
	const [selectedItems, setSelectedItems] = useState<{ [id: number]: boolean }>(
		{},
	);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	// Buscar suprimentos
	useFocusEffect(() => {
		const fetchSuprimentos = async () => {
			try {
				const token = await getToken();
				const response = await axios("http://192.168.0.113:8080/suprimento", {
					headers: { Authorization: `Bearer ${token}` },
				});
				const suprimentos = response.data.content || [];
				if (suprimentos.length === 0) {
					Alert.alert(
						"Nenhum suprimento encontrado",
						"Cadastre um suprimento antes de criar uma missão.",
						[
							{
								text: "OK",
								onPress: () => router.push("/(header)/suprimento/novo"),
							},
						],
					);
					return;
				}
				setSuprimentos(suprimentos);
			} catch (error) {
				Alert.alert("Erro", "Erro ao buscar suprimentos.");
			}
		};
		const fetchDrone = async () => {
			try {
				const token = await getToken();
				const response = await axios.get(`${SERVER_URL}/drone/${droneId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setDrone(response.data);
			} catch (e) {
				Alert.alert("Erro", "Erro ao buscar drone.");
				router.back();
			}
		};
		Promise.all([fetchSuprimentos(), fetchDrone()]).finally(() =>
			setLoading(false),
		);
	});

	// Soma total dos pesos
	const pesoTotal = suprimentos.reduce((acc, s) => {
		const qtd = selected[s.id] || 0;
		return acc + s.pesoKg * qtd;
	}, 0);

	const handleSelect = (id: number) => {
		setSelectedItems((prev) => {
			const isCurrentlySelected = prev[id];
			if (isCurrentlySelected) {
				// Se está desmarcando, limpa a quantidade também
				setSelected((prevSelected) => ({
					...prevSelected,
					[id]: 0,
				}));
			} else {
				// Se está marcando, inicia com quantidade 1
				setSelected((prevSelected) => ({
					...prevSelected,
					[id]: 1,
				}));
			}
			return {
				...prev,
				[id]: !isCurrentlySelected,
			};
		});
	};

	const handleQuantidade = (id: number, qtd: string) => {
		const value = Number.parseInt(qtd) || 0;
		setSelected((prev) => ({
			...prev,
			[id]: value,
		}));
	};

	const handleSubmit = async () => {
		if (!descricao.trim()) {
			Alert.alert("Erro", "Preencha a descrição da missão.");
			return;
		}
		const suprimentosSelecionados = Object.entries(selected)
			.filter(([_, qtd]) => qtd > 0)
			.map(([id, qtd]) => ({
				suprimentoId: Number(id),
				quantidade: qtd,
			}));

		if (suprimentosSelecionados.length === 0) {
			Alert.alert("Erro", "Selecione pelo menos um suprimento e quantidade.");
			return;
		}
		if (pesoTotal > (drone?.capacidadeKg || 0)) {
			Alert.alert(
				"Erro",
				`Peso total (${pesoTotal} kg) excede a capacidade máxima do drone (${drone?.capacidadeKg} kg).`,
			);
			return;
		}
		setSubmitting(true);
		try {
			const token = await getToken();
			await axios.post(
				`${SERVER_URL}/missao`,
				{
					descricao,
					droneId: Number(droneId),
					suprimentos: suprimentosSelecionados,
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			Alert.alert("Sucesso", "Missão cadastrada!");
			setTimeout(() => {
				router.replace(`/drone/${droneId}`);
			}, 1000);
		} catch (error) {
			Alert.alert("Erro", "Não foi possível cadastrar a missão.");
		}
		setSubmitting(false);
	};

	if (loading) {
		return (
			<View className="flex-1 items-center justify-center bg-black">
				<ActivityIndicator color="#00d9ff" />
			</View>
		);
	}

	return (
		<ScrollView className="flex-1 bg-black px-6 py-8">
			<Text className="text-2xl font-bold text-cyan-400 mb-2 text-center">
				Nova Missão
			</Text>
			<Text className="text-white text-center mb-2">
				Drone: <Text className="font-bold">{drone?.nome}</Text> (Capacidade:{" "}
				{drone?.capacidadeKg} kg)
			</Text>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-4 text-base"
				placeholder="Descrição da missão"
				placeholderTextColor="#aaa"
				value={descricao}
				onChangeText={setDescricao}
			/>
			<Text className="text-white font-semibold mb-2">
				Selecione os suprimentos:
			</Text>
			{suprimentos.map((s) => (
				<View
					key={s.id}
					className={`flex-row items-center mb-3 rounded-lg px-3 py-2 ${
						selectedItems[s.id] ? "bg-cyan-900" : "bg-zinc-800"
					}`}
				>
					<TouchableOpacity
						className={`w-6 h-6 mr-3 rounded border-2 ${
							selectedItems[s.id]
								? "border-cyan-400 bg-cyan-400"
								: "border-zinc-500"
						} items-center justify-center`}
						onPress={() => handleSelect(s.id)}
					>
						{selectedItems[s.id] ? (
							<Text className="text-black font-bold">✓</Text>
						) : null}
					</TouchableOpacity>
					<View className="flex-1">
						<Text className="text-white font-semibold">{s.nome}</Text>
						<Text className="text-zinc-400 text-xs">{s.descricao}</Text>
						<Text className="text-zinc-400 text-xs">Peso: {s.pesoKg} kg</Text>
					</View>
					{selectedItems[s.id] ? (
						<TextInput
							className="w-16 h-10 bg-zinc-900 text-white rounded px-2 ml-2 text-center"
							placeholder="Qtd"
							placeholderTextColor="#aaa"
							value={selected[s.id]?.toString() || ""}
							onChangeText={(v) => handleQuantidade(s.id, v)}
							keyboardType="numeric"
						/>
					) : null}
				</View>
			))}
			<Text className="text-white mt-4 mb-2">
				Peso total:{" "}
				<Text
					className={
						pesoTotal > (drone?.capacidadeKg || 0)
							? "text-red-400"
							: "text-cyan-400"
					}
				>
					{pesoTotal} kg
				</Text>
			</Text>
			<TouchableOpacity
				className="w-full h-12 bg-cyan-400 rounded-lg items-center justify-center mt-4"
				onPress={handleSubmit}
				disabled={submitting}
			>
				{submitting ? (
					<ActivityIndicator color="#000" />
				) : (
					<Text className="text-black text-lg font-bold">Cadastrar Missão</Text>
				)}
			</TouchableOpacity>
		</ScrollView>
	);
}
