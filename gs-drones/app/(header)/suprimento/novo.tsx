import { useState } from "react";
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import axios from "axios";
import { getToken } from "../../../token";
import { useRouter } from "expo-router";
import { SERVER_URL } from "../../../server";

export default function NovoSuprimentoPage() {
	const [nome, setNome] = useState("");
	const [descricao, setDescricao] = useState("");
	const [pesoKg, setPesoKg] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleSubmit = async () => {
		if (Number(pesoKg) <= 0) {
			Alert.alert("Erro", "O peso deve ser maior que zero.");
			return;
		}
		if (!nome || !descricao || Number(pesoKg) <= 0) {
			Alert.alert("Erro", "Preencha todos os campos corretamente.");
			return;
		}
		setLoading(true);
		try {
			const token = await getToken();
			await axios.post(
				`${SERVER_URL}/suprimento`,
				{
					nome,
					descricao,
					pesoKg: Number(pesoKg),
				},
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			Alert.alert("Sucesso", "Suprimento cadastrado!");
			router.back();
		} catch (error) {
			Alert.alert("Erro", "Não foi possível cadastrar o suprimento.");
		}
		setLoading(false);
	};

	return (
		<View className="flex-1 bg-black px-6 justify-center">
			<Text className="text-2xl font-bold text-cyan-400 mb-8 text-center">
				Cadastrar Suprimento
			</Text>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-4 text-base"
				placeholder="Nome"
				placeholderTextColor="#aaa"
				value={nome}
				onChangeText={setNome}
			/>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-4 text-base"
				placeholder="Descrição"
				placeholderTextColor="#aaa"
				value={descricao}
				onChangeText={setDescricao}
			/>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-6 text-base"
				placeholder="Peso (kg)"
				placeholderTextColor="#aaa"
				value={pesoKg}
				onChangeText={setPesoKg}
				keyboardType="numeric"
				returnKeyType="done"
			/>
			<TouchableOpacity
				className="w-full h-12 bg-cyan-400 rounded-lg items-center justify-center"
				onPress={handleSubmit}
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
