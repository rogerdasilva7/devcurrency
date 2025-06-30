import {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router";
import type { CoinsProps } from "../home"
import styles from "./detail.module.css";

interface ResponseData {
    data: CoinsProps
}

interface ErrorProps{
    error: string
}

type DataProps = ResponseData | ErrorProps

export function Detail(){
    const { cripto } = useParams();
    const navigate = useNavigate();
    const [coins, setCoins] = useState<CoinsProps>();
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {

        async function getDadosIdApi(){
            try{
                fetch(`https://rest.coincap.io/v3/assets/${cripto}?apiKey=02d9e57a21018cedf6f972b1bbd5ef24db001531bad38bba54d32a7d676acc06`)
                .then((response) => response.json())
                .then((data: DataProps) => {
                    if("error" in data){
                        navigate("/")
                        return;
                    }

                    let coinsPropsFormat = {
                        ...data.data,
                        priceValueFormat: priceValueFormat(Number(data.data.priceUsd)),
                        priceValueMarketFormat: priceValueCompactFormat(Number(data.data.marketCapUsd)),
                        priceValueVolumeFormat: priceValueCompactFormat(Number(data.data.volumeUsd24Hr))
                    }

                    setCoins(coinsPropsFormat)

                    setLoading(false)
                })
            }
            catch(error){
                console.log("ocorreu um erro inesperado!!")
                navigate("/")
            }
        }
        getDadosIdApi()

    },[cripto])

    if(loading){
        return(
            <div className={styles.loadingContainer}>
                <h3 className={styles.loading}>Carregando moeda...</h3>
            </div>
        )
    }

    return(
        <div className={styles.mainContainer}>
            <section className={styles.infoTitle}>
                <h1 className={styles.coinName}>{coins?.name} | {coins?.symbol}</h1>

            </section>

            <section className={styles.infoCoin}>
                <img src={`https://assets.coincap.io/assets/icons/${coins?.symbol.toLowerCase()}@2x.png`} alt="Logo criptomoeda" className={styles.coinImg}/>
                <span className={styles.infoCoin}>Preço: {coins?.priceValueFormat}</span>
                <span className={styles.infoCoin}>Mercado: {coins?.priceValueMarketFormat}</span>
                <span className={styles.infoCoin}>Volume: {coins?.priceValueVolumeFormat}</span>
                <span className={styles.infoMudanca}>Mudança 24h:<strong className={Number(coins?.changePercent24Hr) < 0 ? styles.loss : styles.profit}>{Number(coins?.changePercent24Hr).toFixed(3)}</strong></span>

            </section>
        </div>
    )
};