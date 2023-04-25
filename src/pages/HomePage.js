import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useContext, useEffect, useState } from "react"
import UserContext from "../UserContext"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import dotenv from "dotenv";

export default function HomePage() {
    const { token, setToken } = useContext(UserContext);
    const [transactions, setTransactions] = useState([]);
    const [name, setName] = useState("");
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();
    dotenv.config();

    useEffect(() => {
        if (!token) {
            navigate("/");
            return;
        } else {
            const header = {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            };
            axios.get("http://localhost:5000/home", header)
                .then((res) => {
                    setName(res.data.userName);
                    setTransactions(res.data.transactions)
                    let newTotal = 0;
                    for (let i = 0; i < res.data.transactions.length; i++) {
                        if (res.data.transactions[i].type === "entrada") {
                            newTotal += Number(res.data.transactions[i].value);
                        } else {
                            newTotal -= Number(res.data.transactions[i].value);
                        }
                    }
                    setTotal(newTotal);
                })
                .catch((err) => {
                    alert(err.message);
                });
        }
    }, [token, navigate]);

    function logout() {
        axios.delete(`http://localhost:5000/delete/${token}`)
            .then((res) => {
                setToken(undefined);
                navigate("/");
            })
            .catch((err) => {
                alert(err.message);
            });
    }

    return (
        <HomeContainer>
            <Header>
                <h1>Olá, {name}</h1>
                <BiExit onClick={logout} />
            </Header>

            <TransactionsContainer>
                <ul>
                    {transactions.map((transaction) => {
                        return (
                            <ListItemContainer>
                                <div>
                                    <span>{transaction.day}</span>
                                    <strong>{transaction.description}</strong>
                                </div>
                                <Value color={transaction.type}>{Number(transaction.value).toFixed(2)}</Value>
                            </ListItemContainer>
                        );
                    })}
                </ul>

                <article>
                    <strong>Saldo</strong>
                    <Value color={(total >= 0) ? "entrada" : "saida"}>{Number(total).toFixed(2)}</Value>
                </article>
            </TransactionsContainer>


            <ButtonsContainer>
                <Link to={"/nova-transacao/entrada"} >
                    <button>
                        <AiOutlinePlusCircle />
                        <p>Nova <br /> entrada</p>
                    </button>
                </Link>
                <Link to={"/nova-transacao/saida"} >
                    <button>
                        <AiOutlineMinusCircle />
                        <p>Nova <br />saída</p>
                    </button>
                </Link>
            </ButtonsContainer>

        </HomeContainer>
    )

}

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 50px);
`
const Header = styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2px 5px 2px;
    margin-bottom: 15px;
    font-size: 26px;
    color: white;
`
const TransactionsContainer = styled.article`
    flex-grow: 1;
    background-color: #fff;
    color: #000;
    border-radius: 5px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    article {
        display: flex;
        justify-content: space-between;   
        strong {
        font-weight: 700;
        text-transform: uppercase;
        }
    }
`
const ButtonsContainer = styled.section`
    margin-top: 15px;
    margin-bottom: 0;
    display: flex;
    gap: 15px;
    a{
        width: 50%;
        height: 115px;
    }
    button {
        width: 100%;
        height: 115px;
        font-size: 22px;
        text-align: left;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        p {
        font-size: 18px;
        }
    }
`
const Value = styled.div`
    font-size: 16px;
    text-align: right;
    color: ${(props) => (props.color === "entrada" ? "green" : "red")};
`
const ListItemContainer = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    color: #000000;
    margin-right: 10px;
    div span {
        color: #c6c6c6;
        margin-right: 10px;
    }
`