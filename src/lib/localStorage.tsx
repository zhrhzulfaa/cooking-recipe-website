// import { TITLE_NAVBAR } from '../config/app';

// export const stateTitleNavbar = (title: string) => {
//     try {
//         localStorage.setItem(TITLE_NAVBAR, title);
//     } catch (error) {
//         return false;
//     }
// }

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem("state");

        return serializedState === null
            ? undefined
            : JSON.parse(serializedState);
    } catch (error) {
        return undefined;
    }
};
