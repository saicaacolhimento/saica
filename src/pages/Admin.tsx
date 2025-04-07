
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-saica-blue">Área Administrativa SAICA</CardTitle>
          <CardDescription className="text-center">
            Acesso restrito aos administradores do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Login de Administrador" />
          <Input type="password" placeholder="Senha" />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate("/")}>
            Voltar
          </Button>
          <Button className="bg-saica-blue hover:bg-saica-light-blue" onClick={() => navigate("/adminhome")}>
            Acessar
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Admin;
