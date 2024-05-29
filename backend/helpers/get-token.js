// get token from headers
const getToken = (req) => {
    // Obtém o cabeçalho de autorização da solicitação.
    const authHeader = req.headers["authorization"];

    //Extrai o token do cabeçalho de autorização, se existir, removendo a palavra "Bearer" e retornando apenas o token.
    //Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiRWRsaXNpb24iLCJpZCI6IjY2M2JlNTA5NzllMDEyZDc1ZjUzNTk2YSIsImlhdCI6MTcxNTIwMzMxMH0.9h74jXxIazW0JkxIdQhQsrnTyV9ve2VTzJ50AnqbVPc
    const token = authHeader && authHeader.split(" ")[1];
    
        return token;
    };
    
    module.exports = getToken;

    