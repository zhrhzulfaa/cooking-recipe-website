import { createSignal } from "solid-js";

export const [pictureUrl, setPictureUrl] = createSignal("");

export function handleImageProfileError() {
    const defaultImage = "/src/assets/img/profile3.png"; // Ganti dengan jalur gambar default Anda
    setPictureUrl(defaultImage);
    }

export const [dataProfile, setDataProfile] = createSignal({
    id: 0,
    username: '',
    email: '',
    password: '',
    desc: '',
})

export function profilePic(){
    console.log("?", pictureUrl())
    return(
        <img src={pictureUrl()} alt="" onError={handleImageProfileError}/>
    )
}

