import { createSignal } from "solid-js";
import { resepuser } from "../../api/resep/dataresepuser";

export const [resepUser, setResepUser] = createSignal<resepuser[]>([])
