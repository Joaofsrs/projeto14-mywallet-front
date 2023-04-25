import styled from "styled-components"
import { BiExit } from "react-icons/bi"
import { AiOutlineMinusCircle, AiOutlinePlusCircle } from "react-icons/ai"
import { useContext, useEffect, useState } from "react"
import UserContext from "../UserContext"
import axios from "axios"
import { Link } from "react-router-dom"

export default function HomePage() {
    const { token } = useContext(UserContext);
    const [transactions, setTransactions] = useState([]);
    const [name, setName] = useState("");
    useEffect(() => {
        const header = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        };
        axios.get("http://localhost:5000/home", header)
            .then((res) => {
                console.log(res.data);
                setName(res.data.userName);
                setTransactions(res.data.transactions)
            })
            .catch((err) => {
                alert(err.message);
            });
    }, [token]);
    return (
        <HomeContainer>
            <Header>
                <h1>Olá, {name}</h1>
                <BiExit />
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
                                <Value color={transaction.type}>{transaction.value}</Value>
                            </ListItemContainer>
                        );
                    })}
                </ul>

                <article>
                    <strong>Saldo</strong>
                    <Value color={"positivo"}>2880,00</Value>
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