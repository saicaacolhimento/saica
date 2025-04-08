// import { Router } from "express";
import { supabase } from "@/lib/supabase";

// Estrutura básica para testes
const testRoutes = {
  test: async () => {
    return { message: "Test route working" };
  }
};

export default testRoutes; 