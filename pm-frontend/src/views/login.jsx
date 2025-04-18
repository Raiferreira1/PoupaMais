import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importa useNavigate

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();  // Inicia o navigate

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // Validações
    if (!formData.email || !formData.password) {
      setSuccess(false);
      return setMessage("Preencha todos os campos.");
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(formData.email)) {
      setSuccess(false);
      return setMessage("E-mail inválido.");
    }

    setLoading(true);
    setMessage(null);

    const body = {
      username: formData.email,  // Corrigido para usar 'username'
      password: formData.password
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/token/", { // Corrigido para a rota correta
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setSuccess(false);
        if (data.detail) {
          setMessage(data.detail);  // Detalhe retornado quando login falha
        } else {
          setMessage("Erro ao fazer login.");
        }
      } else {
        setSuccess(true);
        setMessage("Login realizado com sucesso!");
        // Armazenar o access_token no localStorage
        localStorage.setItem("access_token", data.access);
        
        // Redireciona para a página Home após o login
        navigate("/home");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      setSuccess(false);
      setMessage("Erro de rede, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

        <input
          type="email"
          name="email"
          placeholder="E-mail"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          disabled={loading || success}
          className={`w-full py-2 font-semibold rounded-md transition 
            ${loading || success
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {loading
            ? "Entrando..."
            : success
              ? "Logado!"
              : "Entrar"}
        </button>

        {message && (
          <p className={`text-center text-sm ${success ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        <p className="text-sm text-center text-gray-600">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
