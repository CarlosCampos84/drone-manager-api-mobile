import { useState } from "react";
import {
	Text,
	View,
	TextInput,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { SERVER_URL } from "../../server";

export default function RegistroPage() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleRegister = async () => {
		setLoading(true);
		try {
			if (password.length < 6) {
				Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
				setLoading(false);
				return;
			}
			if (email && !/\S+@\S+\.\S+/.test(email)) {
				Alert.alert("Erro", "E-mail inválido.");
				setLoading(false);
				return;
			}
			if (username && email && password) {
				await axios.post(`${SERVER_URL}/usuario`, {
					nome: username,
					email,
					senha: password,
				});
				Alert.alert("Sucesso", "Conta criada com sucesso!");
				router.replace("/(usuario)/login");
			} else {
				Alert.alert("Erro", "Preencha todos os campos.");
			}
		} catch (error) {
			Alert.alert("Erro", "Não foi possível registrar.");
		}
		setLoading(false);
	};

	return (
		<View className="flex-1 items-center justify-center bg-black px-6">
			<Text className="text-3xl font-bold text-white mb-2">Registro</Text>
			<Text className="text-zinc-400 text-base mb-6">
				Crie sua conta para acessar o app
			</Text>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-4 text-base"
				placeholder="Nome de usuário"
				placeholderTextColor="#aaa"
				value={username}
				onChangeText={setUsername}
				autoCapitalize="none"
			/>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-4 text-base"
				placeholder="E-mail"
				placeholderTextColor="#aaa"
				value={email}
				onChangeText={setEmail}
				autoCapitalize="none"
				keyboardType="email-address"
			/>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-4 text-base"
				placeholder="Senha"
				placeholderTextColor="#aaa"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<TouchableOpacity
				className="w-full h-12 bg-cyan-400 rounded-lg items-center justify-center mt-2"
				onPress={handleRegister}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color="#000" />
				) : (
					<Text className="text-black text-lg font-bold">Registrar</Text>
				)}
			</TouchableOpacity>
			<View className="flex-row mt-6">
				<Text className="text-zinc-400">Já tem conta?</Text>
				<TouchableOpacity onPress={() => router.back()}>
					<Text className="text-cyan-400 font-bold ml-2">Entrar</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
