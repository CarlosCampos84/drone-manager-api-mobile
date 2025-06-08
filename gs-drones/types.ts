export type Drone = {
	id: number;
	nome: string;
	tipo: "CARGA" | "MEDICAMENTOS" | "RESGATE";
	capacidadeKg: number;
};

export type Missao = {
	id: number;
	descricao: string;
	status: "EM_ANDAMENTO" | "FINALIZADO" | "CANCELADO";
	dataInicio: string;
	dataFim: string | null;
	drone: Drone;
	suprimentos: {
		suprimento: Suprimento;
		quantidade: number;
	}[];
	pesoTotal: number;
};

export type Suprimento = {
	id: number;
	nome: string;
	descricao: string;
	pesoKg: number;
};
