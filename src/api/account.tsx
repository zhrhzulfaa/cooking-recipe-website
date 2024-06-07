import { createSignal } from "solid-js";
import { userID } from "../App";

export type dataaccount = {
    "id_akun": number,
    "username": string,
    "email": string,
    "password": string,
    "deskripsi_profil": string,
    "foto_profil": string
}


export async function DataAccount(query: string) {
    if (query.trim() === "") return [];
    // /?q=${encodeURI(query)}
    
    console.log("usn", userID())

    const response = await fetch(
      `/api/account/${userID()}`
    );
    // http://localhost:8001
    
    const results = await response.json();
    // console.log("response ", results)
    const documents = results as dataaccount[];
    console.log("akunnnn", documents);

    return documents.slice(0, documents.length).map(({ id_akun, username, email, password, deskripsi_profil, foto_profil  }) => ({
        id_akun, username, email, password, deskripsi_profil, foto_profil
      }));
  }


