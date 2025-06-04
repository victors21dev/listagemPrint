import React, { createContext, useContext, useState, ReactNode } from "react";

type ImpressoraData = {
  marca: string;
  modelo: string;
};

type CadastroContextType = {
  modelos: ImpressoraData[];
  setores: string[];
  adicionarModelo: (data: ImpressoraData) => void;
  adicionarSetor: (setor: string) => void;
};

const CadastroContext = createContext<CadastroContextType | undefined>(
  undefined
);

export const CadastroProvider = ({ children }: { children: ReactNode }) => {
  const [modelos, setModelos] = useState<ImpressoraData[]>([]);
  const [setores, setSetores] = useState<string[]>([]);

  const adicionarModelo = (data: ImpressoraData) => {
    setModelos((prev) => [...prev, data]);
  };

  const adicionarSetor = (setor: string) => {
    setSetores((prev) => [...prev, setor]);
  };

  return (
    <CadastroContext.Provider
      value={{ modelos, setores, adicionarModelo, adicionarSetor }}
    >
      {children}
    </CadastroContext.Provider>
  );
};

export const useCadastro = (): CadastroContextType => {
  const context = useContext(CadastroContext);
  if (!context) {
    throw new Error("userCadastro deve ser usado dentro de CadastroProvider");
  }
  return context;
};
