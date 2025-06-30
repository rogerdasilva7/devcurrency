import styles from "./header.module.css";
import logoimg from "../../assets/logo.svg";
import { Link } from "react-router";

export function Header(){
    return(
        <Link to={"/"}>
            <header className={styles.header}>
                <img src={logoimg} alt="Logo Cripto App" />
            </header>
        </Link>
    )
};