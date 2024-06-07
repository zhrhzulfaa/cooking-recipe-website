import { createSignal, type Component, onMount, createEffect, createMemo, onCleanup } from 'solid-js';
import './koleksi-resep.css'
import { Icon } from '@iconify-icon/solid';
import DeleteResep from '../edit-resep/popup-delete-resep';
import { resepUser } from '../../../store/ResepUser/resep-user-data';
import { DataResepUSer, resepuser } from '../../../api/resep/dataresepuser';
import { A, useNavigate } from '@solidjs/router';
import { dataResep, setDataResep, updateDataResep } from '../../../store/Resep/ResepData';

const KoleksiResep: Component = () => {
    const [resepUser, setResepUser] = createSignal<resepuser[]>([])
    const [id, setID] = createSignal(0);
    const [resep, setResep] = createSignal('')

    onMount(async () => {
        const resepsaya = await DataResepUSer("resepsaya");
        console.log("resep saya, ", resepsaya)
        setResepUser(resepsaya)
    })

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
    //     resepUser().forEach((resep) => {
    //         fetchAndRenderUlasan(resep);
    //     });
    // });

    // const combinedData = createMemo(() => resepUser());


    const [popUpDelete, setPopUpDelete] = createSignal(false);

    // function openPopUpDelete(selectedResep: resepuser) {
    //     setResep(selectedResep.nama_resep);
    //     setID(selectedResep.id_resep);
    //     setPopUpDelete(true);
    // }

    function closePopUpDelete(){
        setPopUpDelete(false)
    } 

    const navigate = useNavigate();

    const [bahan, setBahan] = createSignal(['']);

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
            langkah: resep.cara_buat
          });
        console.log("ph", dataResep())
        navigate("/detail_resep_bahan_langkah")
    }
    
    let trashButtonRef: HTMLElement | null = null;

    const openPopUpDelete = (e: any, selectedResep: resepuser) => {
        console.log('openPopUpDelete called');

        // Pengecekan untuk melihat apakah event berasal dari tombol "trash"
        if (e.currentTarget.id === "your-trash-button-id") {
            console.log('Trash button clicked');
            setResep(selectedResep.nama_resep);
            setID(selectedResep.id_resep);
            setPopUpDelete(true);
            // Lakukan hal-hal yang diperlukan ketika tombol "trash" diklik
        }
    };

    onCleanup(() => {
        trashButtonRef = null;
    });




  return (
    <div class="koleksi-resep-pg">
        <h1>Koleksi Resep</h1>
        <div class="koleksi-resep-cp">
            <div class="koleksi-resep-cp">
                {resepUser().map((resep =>
                <div class="koleksi-resep-item" onClick={() => navigateDetail(resep)}>
                    <img src="/src/assets/img/jamur_enoki.png" alt="" />
                    <div class="recipes-desc">
                        <div>
                            <div class="header">
                                <h1>{resep.nama_resep}</h1>
                                <button id="your-trash-button-id"
                                ref={(el) => (trashButtonRef = el)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openPopUpDelete(e, resep);
                                }}>
                                    <Icon icon="tabler:trash" width="25" />
                                </button>
                            </div>
                            <div class="ctn-recipes">
                                <h2>Bahan</h2>
                                <ul>
                                {resep.bahan_masak.map((bahan, index) => (
                                        <li>{bahan}</li>
                                    ))}                                </ul>
                                <h2>Langkah</h2>
                                <ol>
                                    {resep.cara_buat.map((langkah, index: any) => (
                                        <li>{langkah}</li>
                                    ))}                                
                                </ol>
                            </div>
                        </div>

                        <div class='ulasan'>
                            {/* <p>{resep.ulasan}</p> */}
                        </div>
                    </div>
                </div>
                ))}

            </div>
        </div>
        {popUpDelete() && <DeleteResep onClose={closePopUpDelete} nama={resep()} id={id()}/>}
    </div>
  );
};

export default KoleksiResep;
