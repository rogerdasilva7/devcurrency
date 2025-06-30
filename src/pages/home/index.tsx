import styles from "./home.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router";
import { useState, type FormEvent, useEffect } from "react";

export interface CoinsProps{
    id: string,
    name: string,
    symbol: string,
    priceUsd: string,
    vwap24Hr: string,
    changePercent24Hr: string, 
    rank: string,
    suply: string
    maxSupply: string,
    marketCapUsd: string,
    volumeUsd24Hr: string,
    explorer: string,
    priceValueFormat?: string,
    priceValueMarketFormat?: string,
    priceValueVolumeFormat?: string
}

interface DataProps{
    data: CoinsProps[];
}

export function Home(){
    const [input, setInput] = useState("");
    const [coins, setCoins] = useState<CoinsProps[]>([]);
    const [offset, setOffset] = useState(0);
    const navigate = useNavigate();

    function handleRegister(e: FormEvent){
        e.preventDefault()
        if(input === "") return;
        navigate(`/detail/${input}`)
    }

    useEffect(() => {
        getDados()
    },[offset])

    function priceValueFormat(value: number){
        const resultConvert = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(value)
        return resultConvert
    }

    function priceValueCompactFormat(value: number){
        const resultConvert = Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            notation: "compact"
        }).format(value)
        return resultConvert
    }

    async function getDados(){
        const apiKey = import.meta.env.VITE_COINCAP_API_KEY;
        fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=${apiKey}`)
        .then((response) => response.json())
        .then((data: DataProps) => {
            const coinsData = data.data;
            const dadosFormatReturn = coinsData.map((item: CoinsProps) => {
                const dadosFormat = {
                    ...item,
                    priceValueFormat: priceValueFormat(Number(item.priceUsd)),
                    priceValueMarketFormat: priceValueCompactFormat(Number(item.marketCapUsd)),
                    priceValueVolumeFormat: priceValueCompactFormat(Number(item.volumeUsd24Hr))
                }
                return dadosFormat
            })
            let listCoins = [...coins, ...dadosFormatReturn]
            setCoins(listCoins)
        })
    }
    function handleLoadMoreButton(){
        if(offset === 0){
            setOffset(10)
        }
        setOffset(offset + 10)
    }

    return(
        <main className={styles.container}>
        <form className={styles.form} onSubmit={handleRegister}>
            <input type="text" placeholder="Digite o nome da moeda..." className={styles.input} value={input} onChange={(e) => setInput(e.target.value)}/>
            <button type="submit" className={styles.button}>
                <BsSearch size={30} color="#fff"/>
            </button>
        </form>
        <table>
            <thead>
                <tr>
                    <th scope="col">Moeda</th>
                    <th scope="col">Valor de Mercado</th>
                    <th scope="col">Preço</th>
                    <th scope="col">Volume</th>
                    <th scope="col">Mudança 24h</th>
                </tr>
            </thead>
                {coins.length > 0 && coins.map((item) => (
                    <tbody>
                    <tr className={styles.tr} key={item.id}>
                        <td className={styles.tdLabel} data-label="Moeda">
                            <Link to={`/detail/${item.id}`} className={styles.linkName}> 
                                <img src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`} alt="Imagem logo moeda" className={styles.imgLogo}/> <span>{item.name}</span>| {item.symbol}
                            </Link>
                        </td>
                        <td className={styles.tdLabel} data-label="Valor de Mercado">
                            {`${item.priceValueMarketFormat}`}
                        </td>
                        <td className={styles.tdLabel} data-label="Preço">
                            {`${item.priceValueFormat}`}
                        </td>
                        <td className={styles.tdLabel} data-label="Volume">
                            {`${item.priceValueVolumeFormat}`}
                        </td>
                        <td className={ (Number(item.changePercent24Hr) < 0) ? styles.tdLoss : styles.tdProfit } data-label="Mudança 24h">
                            {`${Number(item.changePercent24Hr).toFixed(3)}`}
                        </td>
                    </tr>
                </tbody>
                ))}
        </table>

        <button className={styles.loadMoreButton} onClick={handleLoadMoreButton}>Carregar mais...</button>
    </main>
    )
};