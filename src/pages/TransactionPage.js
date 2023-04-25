import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import styled from "styled-components"
import UserContext from "../UserContext";
import dotenv from "dotenv";

export default function TransactionsPage() {
    const { tipo } = useParams();
    const [form, setForm] = useState({value: "", description: ""});
    const [disableButton, setDisableButton] = useState(true);
    const [sendTransaction, setSendTransaction] = useState(false);
    const { token } = useContext(UserContext);
    const navigate = useNavigate();
    dotenv.config();

    function handleForm(e){
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    useEffect(() => { 
        if(form.value && form.description){
            setDisableButton(false)
        }else{
            setDisableButton(true);
        }
    }, [form]);

    function submitTransaction(e){
        e.preventDefault();
        const header = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
        setSendTransaction(true);
        axios.post(`http://localhost:5000/nova-transacao/${tipo}`, form, header)
            .then((res) => {
                setSendTransaction(false)
                navigate("/home");
            })
            .catch((err) => {
                alert(`${err.message}\n${err.request.statusText} ${err.request.status}`);
                setDisableButton(true);
                setSendTransaction(false);
                console.log(err);
            });
    }

    return (
        <TransactionsContainer>
            <h1>Nova {tipo}</h1>
            <form onSubmit={submitTransaction}>
                <input
                    placeholder="Valor" 
                    type="text" 
                    id="value"
                    name="value"
                    value={form.value}
                    onChange={handleForm}
                    required
                    disabled={sendTransaction}
                />
                <input 
                    placeholder="Descrição" 
                    type="text" 
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleForm}
                    required
                    disabled={sendTransaction}
                />
                <button disabled={sendTransaction||disableButton}>Salvar {tipo}</button>
            </form>
        </TransactionsContainer>
    )
}

const TransactionsContainer = styled.main`
  height: calc(100vh - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  h1 {
    align-self: flex-start;
    margin-bottom: 40px;
  }
`
