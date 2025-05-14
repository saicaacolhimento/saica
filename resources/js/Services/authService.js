getAllUsuarios: async () => {
    try {
        const response = await axios.get('/api/usuarios');
        return response.data.map(usuario => ({
            id: usuario.id,
            nome: usuario.nome || usuario.name,
            email: usuario.email
        }));
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        throw error;
    }
}, 