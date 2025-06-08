import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
	sub: string;
	email: string;
	exp: number;
}

const TOKEN_KEY = "token";

export async function getToken() {
	const token = await AsyncStorage.getItem(TOKEN_KEY);
	if (!token) {
		return null;
	}
	const decoded = jwtDecode<JwtPayload>(token);
	if (decoded.exp && Date.now() >= decoded.exp * 1000) {
		return null;
	}
	return token;
}

export async function setToken(token: string) {
	await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function logout() {
	await AsyncStorage.removeItem(TOKEN_KEY);
}
