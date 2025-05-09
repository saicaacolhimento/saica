import { z } from "zod";

const AcolhidoSchema = z.object({
  rg: z.instanceof(File, { message: "RG é obrigatório" }),
  cpf: z.instanceof(File, { message: "CPF é obrigatório" }),
  certidaoNascimento: z.instanceof(File, { message: "Certidão de Nascimento é obrigatória" }),
  certidaoCasamento: z.instanceof(File).optional(),
});

export default AcolhidoSchema; 

const AcolhidoSchema = z.object({
  rg: z.instanceof(File, { message: "RG é obrigatório" }),
  cpf: z.instanceof(File, { message: "CPF é obrigatório" }),
  certidaoNascimento: z.instanceof(File, { message: "Certidão de Nascimento é obrigatória" }),
  certidaoCasamento: z.instanceof(File).optional(),
});

export default AcolhidoSchema; 