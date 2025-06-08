import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { getToken } from "../../../token";
import { SERVER_URL } from "../../../server";

const tipos = [
	{ label: "Medicamentos", value: "MEDICAMENTOS" },
	{ label: "Carga", value: "CARGA" },
	{ label: "Resgate", value: "RESGATE" },
];

export default function NovoDronePage() {
	const [nome, setNome] = useState("");
	const [tipo, setTipo] = useState("MEDICAMENTOS");
	const [capacidadeKg, setCapacidadeKg] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleRegister = async () => {
		if (Number(capacidadeKg) <= 0) {
			Alert.alert("Erro", "Informe uma capacidade acima de zero.");
			return;
		}
		if (!nome.trim()) {
			Alert.alert("Erro", "Informe o nome do drone.");
			return;
		}
		setLoading(true);
		try {
			const token = await getToken();
			await axios.post(
				`${SERVER_URL}/drone`,
				{
					nome,
					tipo,
					capacidadeKg: Number(capacidadeKg),
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			);
			Alert.alert("Sucesso", "Drone cadastrado com sucesso!");
			router.back();
		} catch (error) {
			Alert.alert("Erro", "Não foi possível cadastrar o drone.");
		}
		setLoading(false);
	};

	return (
		<View className="flex-1 bg-black px-6">
			<Text className="text-2xl font-bold text-cyan-400 mb-8 text-center">
				Cadastrar Drone
			</Text>
			<Text className="text-white mb-2">Nome</Text>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-6 text-base"
				placeholder="Ex: Drone para medicamentos"
				placeholderTextColor="#aaa"
				value={nome}
				onChangeText={setNome}
			/>
			<Text className="text-white mb-2">Tipo</Text>
			<View className="grid grid-cols-2 gap-2 mb-4">
				{tipos.map((item) => (
					<TouchableOpacity
						key={item.value}
						className={`py-3 px-2 rounded-lg items-center border ${
							tipo === item.value
								? "bg-cyan-300 border-cyan-300"
								: "bg-zinc-800 border-zinc-700"
						}`}
						onPress={() => setTipo(item.value)}
					>
						<Text
							className={
								tipo === item.value ? "text-black font-bold" : "text-white"
							}
						>
							{item.label}
						</Text>
					</TouchableOpacity>
				))}
			</View>

			<Text className="text-white mb-2">Capacidade (kg)</Text>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-6 text-base"
				placeholder="Ex: 10"
				placeholderTextColor="#aaa"
				value={capacidadeKg}
				onChangeText={setCapacidadeKg}
				keyboardType="numeric"
			/>
			<TouchableOpacity
				className="w-full h-12 bg-cyan-400 rounded-lg items-center justify-center"
				onPress={handleRegister}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color="#000" />
				) : (
					<Text className="text-black text-lg font-bold">Cadastrar</Text>
				)}
			</TouchableOpacity>
		</View>
	);
}
