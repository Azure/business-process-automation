import styles from "./UserChatMessage.module.css";

// interface Props {
//     message: string;
// }

export const UserChatMessage = ({ message }) => {
    return (
        <div className={styles.container}>
            <div className={styles.message}>{message}</div>
        </div>
    );
};
