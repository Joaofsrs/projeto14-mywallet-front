import styled from "styled-components"
import { Link, useNavigate } from "react-router-dom"
import MyWalletLogo from "../components/MyWalletLogo"
import { useState, useEffect, useContext } from "react"
import axios from "axios"
import UserContext from "../UserContext"
import dotenv from "dotenv";

export default function SignInPage() {
    const [form, setForm] = useState({ email: "", password: "" })
    const [disableButton, setDisableButton] = useState(true);
    const [sendSignIn, setSendSignIn] = useState(false);
    const navigate = useNavigate();
    dotenv.config();

    const { setToken } = useContext(UserContext);

    useEffect(() => {
        if (form.email && form.password) {
            setDisableButton(false)
        } else {
            setDisableButton(true)
        }
    }, [form])

    function handleForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function submitSignIn(e) {
        e.preventDefault();
        setSendSignIn(true);
        axios.post("https://mywallet-meqd.onrender.com/", form)
            .then((res) => {
                setSendSignIn(false)
                setToken(res.data);
                setDisableButton(true);
                setSendSignIn(false);
                navigate("/home");
            })
            .catch((err) => {
                alert(`${err.message}\n${err.request.statusText} ${err.request.status}`);
                setDisableButton(true);
                setSendSignIn(false);
            });
    }
    return (
        <SingInContainer>
            <form onSubmit={submitSignIn}>
                <MyWalletLogo />
                <input
                    placeholder="E-mail"
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleForm}
                    required
                    disabled={sendSignIn}
                />
                <input
                    placeholder="Senha"
                    type="password"
                    autoComplete="new-password"
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleForm}
                    required
                    disabled={sendSignIn}
                />
                <button disabled={disableButton || sendSignIn}>Entrar</button>
            </form>

            <Link to={"/cadastro"} >
                Primeira vez? Cadastre-se!
            </Link>
        </SingInContainer>
    )
}

const SingInContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
