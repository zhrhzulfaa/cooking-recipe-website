import { onMount, type Component, createSignal, JSX, createEffect, createMemo, onCleanup } from 'solid-js';
import './profile.css'
import { Icon } from '@iconify-icon/solid';
import { DataAccount, dataaccount } from '../../api/account';
import { useStore } from '../../store';
import Logout from '../logout/logout';
import { A, useNavigate } from '@solidjs/router';
import { dataProfile, profilePic } from '../../store/profile/ProfileStore';
import { DataResepUSer, resepuser } from '../../api/resep/dataresepuser';
import { resepUser, setResepUser } from '../../store/ResepUser/resep-user-data';
import { DataUlasan } from '../../api/ulasan';
import { updateDataResep } from '../../store/Resep/ResepData';

export interface UserData {
    id_akun: number;
    username: string;
    email: string;
    password: string;
    deskripsi_profil: string;
}


const Profile: Component = () => {
    const navigate = useNavigate()
    const [resepUser, setResepUser] = createSignal<resepuser[]>([])
    const [jumlahUlasan, setJumlahUlasan] = createSignal(0)
    const [fotoResep, setFotoResep] = createSignal('/api/resep/makanan/');

    onMount(async () => {
        const resepsaya = await DataResepUSer("resepsaya");
        console.log("resep saya, ", resepsaya)
        setResepUser(resepsaya)
        setJumlahUlasan(resepsaya.length)
    })
    
    const ulasanStates = new Map<resepuser, string>();
    const [jmlUlasan, setJmlUlasan] = createSignal('')

    // const fetchAndRenderUlasan = async (resep: resepuser) => {
    //     try {
    //         const response = await fetch(`/api/ulasan/${resep.id_resep}`);
    //         const ulasanData = await response.json();
    //         const jumlahUlasan = ulasanData.length;
    //         const result = `${jumlahUlasan} Ulasan`;
    //         setResepUser((prev) =>
    //             prev.map((prevResep) =>
    //                 prevResep.id_resep === resep.id_resep ? { ...prevResep, ulasan: result } : prevResep
    //             )
    //         );
    //         console.log('result', result);
    //     } catch (error) {
    //         console.error("Error fetching ulasan:", error);
    //         setResepUser((prev) =>
    //             prev.map((prevResep) =>
    //                 prevResep.id_resep === resep.id_resep ? { ...prevResep, ulasan: "0 Ulasan" } : prevResep
    //             )
    //         );
    //     }
    // };
    
    // createEffect(() => {
    //     const cleanupFunctions: (() => void)[] = [];
    
    //     resepUser().forEach((resep) => {
    //         const cleanup = fetchAndRenderUlasan(resep);
    //         cleanupFunctions.push(cleanup);
    //     });
    
    //     onCleanup(() => {
    //         // Cleanup all registered cleanup functions
    //         cleanupFunctions.forEach(cleanup => cleanup());
    //     });
    // });
    
    

    // createEffect(async () => {
    //     for (const resep of resepUser()) {
    //         await fetchAndRenderUlasan(resep);
    //     }
    // });
    

    
    // const combinedData = createMemo(() =>
    //     resepUser().map((resep) => ({
    //         ...resep,
    //         ulasan: ulasanStates.get(resep),
    //     }))
    // );

    const combinedData = createMemo(() => resepUser());

    const [popUp, setPopUp] = createSignal(false);

    function showPopUp(){
        setPopUp(true);
    }
    
    function closePopUp(){
        setPopUp(false);
    }

    function navigateDetail(resep: resepuser){
        updateDataResep({
            id_resep: resep.id_resep,
            id_kategori: resep.id_kategori,
            id_akun: resep.id_akun,
            username: resep.username,
            nama_resep: resep.nama_resep,
            kategori: resep.nama_kategori,
            total_bahan: resep.total_bahan,
            waktu_masak: resep.waktu_masak,
            bahan: resep.bahan_masak,
            langkah: resep.cara_buat,
            nama_foto: resep.nama_foto
          });
        // console.log("ph", dataResep())
        navigate("/detail_resep_bahan_langkah")
    }

    let trashButtonRef: HTMLElement | null = null;

    const navigateEdit = (e: any, resep: resepuser) => {
        console.log('navigateEdit called');

        // Pengecekan untuk melihat apakah event berasal dari tombol "trash"
        if (e.currentTarget.id === "your-trash-button-id") {
            console.log('Trash button clicked');
            navigate('/edit_resep')
            updateDataResep({
                id_resep: resep.id_resep,
                id_kategori: resep.id_kategori,
                id_akun: resep.id_akun,
                username: resep.username,
                nama_resep: resep.nama_resep,
                kategori: resep.nama_kategori,
                total_bahan: resep.total_bahan,
                waktu_masak: resep.waktu_masak,
                bahan: resep.bahan_masak,
                langkah: resep.cara_buat,
                nama_foto: resep.nama_foto,
                id_foto: resep.id_foto
              });
            // Lakukan hal-hal yang diperlukan ketika tombol "trash" diklik
        }
    };

    onCleanup(() => {
        trashButtonRef = null;
    });


    const renderResepUser = () => {
        const userRecipes = resepUser();
    
        // Check if resepUser has any elements
        if (userRecipes.length > 0) {
            return (
                <div>
                    {userRecipes.map((resep) => (
                        <div class="recipe-card" onClick={() => navigateDetail(resep)}>
                            <img src={`${fotoResep()}${resep.nama_foto}`} alt="" />
                            <div class="recipe-desc">
                                <div>
                                    <div class="head">
                                        <h1>{resep.nama_resep}</h1>
                                        <button id="your-trash-button-id"
                                        ref={(el) => (trashButtonRef = el)}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigateEdit(e, resep);
                                        }}>
                                        <Icon icon="bx:edit" width="24" height="24" />
                                        </button>
                                    </div>
                                    <div class="ct-recipe">
                                        <h2>Bahan</h2>
                                        <ul class='list-disc'>
                                            {resep.bahan_masak.map((bahan, index) => (
                                                <li>{bahan}</li>
                                            ))}
                                        </ul>
                                        <h2>Langkah</h2>
                                        <ol class="list-decimal">
                                            {resep.cara_buat.map((langkah: number | boolean | Node | JSX.ArrayElement | (string & {}) | null | undefined, index: any) => (
                                                <li>{langkah}</li>
                                            ))}
                                        </ol>
                                    </div>
                                </div>
    
                                <div class="reviews">
                                    <p>{resep.total_ulasan || "0"} Ulasan</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            );
        } else {
            // Render a message or component when resepUser is empty
            return (
                <div class="no-recipes-user">
                    <img src="/src/assets/img/bg_profile.png" alt="" />
                    <p>Ayo berbagi kelezatan dan kreativitas dapur Anda!</p>
                </div>
            );
        }
    };
    
    function tambahResep(){
        navigate('/unggah_resep')
    }
    

  return (
    <div class="profile-page">
        <div>
            <div class="profile-card">
                <div class="component-1">
                    {profilePic()}
                    {/* <img src="/src/assets/img/profile.jpg" alt="" /> */}
                    <h1>{dataProfile().username}</h1>
                    <p>{dataProfile().desc}</p>
                </div>
                <div class="component-2">
                    <h2>Jumlah Resep yang Diunggah</h2>
                    <h1 style={{color:"#FFBE1A","font-size":"25px"}}>{jumlahUlasan()}</h1>
                </div>
                <div class="component-3">
                    <form>
                        <label>Email</label>
                        <input type="text" readonly
                        value={dataProfile().email}
                        />
                    </form>
                </div>
                <div class="component-4">
                    <A href="/editprofile"><button>Edit</button></A>
                </div>
                <div class="component-5">
                    <button onClick={showPopUp}><Icon icon="humbleicons:logout" color="red" width="28"/><p>KELUAR</p></button>
                </div>
            </div>
        </div>
        {/* <div style={{width:"350px", background:"whitesmoke"}}></div> */}

        <div class="profile-my-recipes">
            <div>
                
            </div>
            <h1>Resep yang Diunggah</h1>
            <div class="upload-my-recipe">
                <button onClick={tambahResep}><Icon icon="icon-park-outline:upload-logs" width='25' class="pr-1.5"/>Unggah Resep</button>
            </div>
            <div class="recipes-group">
                {renderResepUser()}
            </div>
            <div>
                
            </div>
        </div>
        {popUp() && <Logout onClose={closePopUp}/>}
    </div>
  );
};

export default Profile;

                {/* <div class="recipe-card">
                    <img src="/src/assets/img/jamur_enoki.png" alt="" />
                    <div class="recipe-desc">
                        <div>
                        <div class="head">
                            <h1>Jamur Enoki</h1>
                            <button><Icon icon="bx:edit" width="24" height="24" /></button>
                        </div>
                        <div class="ct-recipe">
                        <h2>Bahan</h2>
                        <ul class='list-disc'>
                            <li>2 bungkus jamur enoki</li>
                            <li>3/4 cangkir Tepung serbaguna</li>
                            <li>1 sdt cabai bubuk</li>
                            <li>1/3 cangkir Tepung Jagung</li>
                        </ul>
                        <h2>Langkah</h2>
                        <ol class="list-decimal">
                            <li>2 bungkus jamur enoki</li>
                            <li>3/4 cangkir Tepung serbaguna</li>
                            <li>1 sdt cabai bubuk</li>
                            <li>1/3 cangkir Tepung Jagung</li>
                        </ol>
                        </div>
                        </div>
                        <div class="reviews">
                            <p>13 Ulasan</p>
                        </div>
                    </div>
                </div> */}