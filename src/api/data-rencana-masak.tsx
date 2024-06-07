import { createSignal } from "solid-js";
import { userID } from "../App";
import { dataProfile } from "../store/profile/ProfileStore";

export type resultrencanamasak = {
    "id_rencanamasak": number,
    "waktu": Date,
    "id_resep": number,
    "status": string,
}


export async function DataRencanaMasak(query: string) {
    if (query.trim() === "") return [];
    // /?q=${encodeURI(query)}

    const response = await fetch(
      `/api/rencana_masak/${dataProfile().id}`
    );
    // http://localhost:8001
    
    const results = await response.json();
    // console.log("response ", results)
    const documents = results as resultrencanamasak[];
    console.log("akunnnn", documents);

    return documents.slice(0, documents.length).map(({ id_rencanamasak, waktu, id_resep, status  }) => ({
        id_rencanamasak, waktu, id_resep, status
      }));
  }


