"use client";
import { useLocalStorage } from "./useLocalStorage";

interface EstadoDia {
  data: string;
  missoesFeitas: string[];
  xpTotal: number;
  onboardingFeito: boolean;
}

const hoje = () => new Date().toISOString().split("T")[0];

const INICIAL: EstadoDia = {
  data: hoje(),
  missoesFeitas: [],
  xpTotal: 0,
  onboardingFeito: false,
};

export function useMissoes() {
  const [estado, setEstado] = useLocalStorage<EstadoDia>("smiletudy_estado", INICIAL);

  // Reseta se for um novo dia
  const estadoAtual = estado.data === hoje() ? estado : { ...INICIAL, onboardingFeito: estado.onboardingFeito };

  function concluirMissao(id: string, xp: number) {
    setEstado((prev) => {
      const base = prev.data === hoje() ? prev : { ...INICIAL, onboardingFeito: prev.onboardingFeito };
      if (base.missoesFeitas.includes(id)) return base;
      return { ...base, missoesFeitas: [...base.missoesFeitas, id], xpTotal: base.xpTotal + xp };
    });
  }

  function concluirOnboarding() {
    setEstado((prev) => ({ ...prev, onboardingFeito: true }));
  }

  function missionFeita(id: string) {
    return estadoAtual.missoesFeitas.includes(id);
  }

  return { estado: estadoAtual, concluirMissao, concluirOnboarding, missionFeita };
}
