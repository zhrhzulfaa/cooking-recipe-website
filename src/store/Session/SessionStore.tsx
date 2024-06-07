import { use } from ".."


export const useSession = () => {
    const [{session}, setState] = use();

    const changeSession = (userData: object) => {
        setState("session", { sessionData: userData });
    }

    return [
        session,
        {
            changeSession
        }
    ]
}