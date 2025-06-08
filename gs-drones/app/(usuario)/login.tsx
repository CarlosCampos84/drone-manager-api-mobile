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
import { setToken } from "../../token";
import { SERVER_URL } from "../../server";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async () => {
		setLoading(true);
		try {
			const response = await axios.post(`${SERVER_URL}/usuario/login`, {
				email: username,
				senha: password,
			});
			if (response.data?.token) {
				await setToken(response.data.token);
				router.replace("(tabs)/home");
			} else {
				Alert.alert("Erro", "Resposta inválida do servidor.");
			}
		} catch (error) {
			Alert.alert("Erro", "Usuário ou senha inválidos.");
		}
		setLoading(false);
	};

	return (
		<View className="flex-1 bg-black items-center justify-center px-6">
			<Text className="text-white text-3xl font-bold mb-2">Login</Text>
			<Text className="text-zinc-400 text-base mb-6">
				Faça login para acessar sua conta
			</Text>
			<TextInput
				className="w-full h-12 bg-zinc-800 text-white rounded-lg px-4 mb-4 text-base"
				placeholder="Usuário"
				placeholderTextColor="#aaa"
				value={username}
				onChangeText={setUsername}
				autoCapitalize="none"
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
				onPress={handleLogin}
				disabled={loading}
			>
				{loading ? (
					<ActivityIndicator color="#000" />
				) : (
					<Text className="text-black text-lg font-bold">Entrar</Text>
				)}
			</TouchableOpacity>
			<View className="flex-row mt-6">
				<Text className="text-zinc-400">Não tem conta?</Text>
				<TouchableOpacity onPress={() => router.push("(usuario)/registro")}>
					<Text className="text-cyan-400 font-bold ml-2">Cadastre-se aqui</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
}
