import React, { createContext, useContext, useState, ReactNode } from "react";

type ImpressoraData = {
  marca: string;
  modelo: string;
};

type Setor = {
  setor: string;
};

type CadastroContextType = {
  modelos: ImpressoraData[];
  setores: Setor[];
  adicionarModelo: (data: ImpressoraData) => void;
  adicionarSetor: (setor: string) => void;
  atualizarModelo: (index: number, novo: ImpressoraData) => void;
  removerModelo: (index: number) => void;
  atualizarSetor: (index: number, novo: string) => void;
  removerSetor: (index: number) => void;
};

const CadastroContext = createContext<CadastroContextType | undefined>(undefined);

export const CadastroProvider = ({ children }: { children: ReactNode }) => {
  const [modelos, setModelos] = useState<ImpressoraData[]>([]);
  const [setores, setSetores] = useState<Setor[]>([]);

  const adicionarModelo = (data: ImpressoraData) => {
    setModelos((prev) => [...prev, data]);
  };

  const adicionarSetor = (setor: string) => {
    setSetores((prev) => [...prev, { setor }]);
  };

  const atualizarModelo = (index: number, novo: ImpressoraData) => {
    setModelos((prev) => {
      const atualizados = [...prev];
      atualizados[index] = novo;
      return atualizados;
    });
  };

  const removerModelo = (index: number) => {
    setModelos((prev) => prev.filter((_, i) => i !== index));
  };

  const atualizarSetor = (index: number, novo: string) => {
    setSetores((prev) => {
      const atualizados = [...prev];
      atualizados[index] = { setor: novo };
      return atualizados;
    });
  };

  const removerSetor = (index: number) => {
    setSetores((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CadastroContext.Provider
      value={{
        modelos,
        setores,
        adicionarModelo,
        adicionarSetor,
        atualizarModelo,
        removerModelo,
        atualizarSetor,
        removerSetor,
      }}
    >
      {children}
    </CadastroContext.Provider>
  );
};

export const useCadastro = (): CadastroContextType => {
  const context = useContext(CadastroContext);
  if (!context) {
    throw new Error("useCadastro deve ser usado dentro de CadastroProvider");
  }
  return context;
};

