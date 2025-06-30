import styles from "./notfound.module.css";
import { Link } from "react-router";
export function Notfound(){
    return(
        <div className={styles.containerNotfound}>
            <h1 className={styles.titleNotfound}>404 NotFound</h1>
            <h2 className={styles.titleNotfound}>Pagina não encontrada</h2>
            <Link to={"/"} className={styles.BackHome}>Voltar ao inicio</Link>
        </div>
    )
};