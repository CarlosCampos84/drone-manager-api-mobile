import { View, Text, ScrollView, Image } from "react-native";

export default function DesenvolvedoresPage() {
	const desenvolvedores = [
		{
			nome: "Carlos Ferraz Campos",
			githubImg: "https://github.com/CarlosCampos84.png",
			rm: "555223",
		},
		{
			nome: "Mateus Teni Pierro",
			githubImg: "https://github.com/Mateus077777.png",
			rm: "555125",
		},
	];

	return (
		<View className="flex-1 bg-black px-6 py-16">
			<Text className="text-3xl font-bold text-white mb-6 text-center">
				Desenvolvedores
			</Text>
			<View className="flex w-full flex-col items-center gap-6">
				{desenvolvedores.map((dev) => (
					<View
						key={dev.rm}
						className="w-80 items-center gap-2 rounded-xl bg-zinc-800 p-4"
					>
						<Image
							source={{ uri: dev.githubImg }}
							className="size-24 rounded-full"
						/>
						<View className="items-center">
							<Text className="font-semibold text-lg text-white">
								{dev.nome}
							</Text>
							<Text className="text-sm text-zinc-300">RM: {dev.rm}</Text>
						</View>
					</View>
				))}
			</View>
		</View>
	);
}
