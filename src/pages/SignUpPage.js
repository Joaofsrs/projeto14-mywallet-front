import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import MyWalletLogo from "../components/MyWalletLogo";
import { useState, useEffect } from "react";
import axios from "axios";

export default function SignUpPage() {
    const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [disableButton, setDisableButton] = useState(true);
    const [sendSignUp, setSendSignUp] = useState(false);
    const navigate = useNavigate();

    function handleForm(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        if (form.name && form.email && form.password) {
            setDisableButton(false)
        } else {
            setDisableButton(true)
        }
    }, [form])

    function submitSignUp(e){
        e.preventDefault();
        setSendSignUp(true);
        console.log(form);
        if(form.password !== form.confirmPassword){
            alert("Senha diferente da senha de confirmação")
            setDisableButton(true);
            setSendSignUp(false);
        }else{
            axios.post("http://localhost:5000/cadastro", form)
            .then((res) => {
                setSendSignUp(false)
                navigate("/");
            })
            .catch((err) => {
                alert(`${err.message}\n${err.request.statusText} ${err.request.status}`);
                setDisableButton(true);
                setSendSignUp(false);
                console.log(err);
            });
        }
    }

    return (
        <SingUpContainer>
            <form onSubmit={submitSignUp}>
                <MyWalletLogo />
                <input
                    placeholder="Nome"
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleForm}
                    required
                    disabled={sendSignUp}
                />
                <input
                    placeholder="E-mail"
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleForm}
                    required
                    disabled={sendSignUp}
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
                    disabled={sendSignUp}
                />
                <input
                    placeholder="Confirme a senha"
                    type="password"
                    autoComplete="new-password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleForm}
                    required
                    disabled={sendSignUp}
                />
                <button disabled={disableButton||sendSignUp}>Cadastrar</button>
            </form>

            <Link to={"/"}>
                Já tem uma conta? Entre agora!
            </Link>
        </SingUpContainer>
    )
}

const SingUpContainer = styled.section`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`
