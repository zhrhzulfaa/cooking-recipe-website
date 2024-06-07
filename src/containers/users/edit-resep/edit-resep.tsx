import { useNavigate } from '@solidjs/router';
import { createSignal, type Component, onMount, onCleanup } from 'solid-js';
import './edit-resep.css'
import { Icon } from '@iconify-icon/solid';
import { isiResep, setIsiResep } from '../detail-resep/detail-resep';
import { DataResep } from '../../../api/resep/dataresep';
import { resepuser } from '../../../api/resep/dataresepuser';
import { dataResep } from '../../../store/Resep/ResepData';
import DeleteResep from './popup-delete-resep';
import { DataKategori, resultkategori } from '../../../api/kategori';

interface Ingredient {
    id: number;
    name: string;
}

interface Steps {
    id: number;
    desc: string;
}

const EditResep: Component = () => {
    const navigate = useNavigate();

    //declare variabel buat nyimpen value yang dikirim
    const [namaResep, setNamaResep] = createSignal('');
    const [kategori, setKategori] = createSignal(0);
    const [waktuMasak, setWaktuMasak] = createSignal(0);
    const [fotoResep, setFotoResep] = createSignal('');
    const [bahan, setBahan] = createSignal(['']);
    const [langkah, setLangkah] = createSignal(['']);

    const [ingredients, setIngredients] = createSignal<Ingredient[]>(isiResep().bahan.map((b, index) => 
    ({ id: index + 1, name: b})
    ));
    const [steps, setSteps] = createSignal<Steps[]>(isiResep().langkah.map((b, index) => 
        ({ id: index + 1, desc: b})
    ));

    const [kategoriData, setKategoriData] = createSignal<resultkategori[]>([]);


    onMount(async () => {
        const storedData = localStorage.getItem('dataResep');
        const data_kategori = await DataKategori("data kategori");
            setKategoriData(data_kategori);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          await setIsiResep(parsedData);
          setFotoResep(`/api/resep/makanan/${parsedData.nama_foto}`);
          setNamaResep(isiResep().nama_resep);
          setKategori(isiResep().id_kategori);
        //   setKategori(isiResep().kategori);
        //   console.log("kat", kategori()
        //   )
          setWaktuMasak(isiResep().waktu_masak);
          setDeleteID(isiResep().id_resep);
          setDeleteNama(isiResep().nama_resep)
          // Pastikan bahan dan langkah ada sebelum digunakan
          if (parsedData.bahan && parsedData.langkah) {
            setIngredients(
              parsedData.bahan.map((b: any, index: number) => ({ id: index + 1, name: b }))
            );
            setSteps(
              parsedData.langkah.map((l: any, index: number) => ({ id: index + 1, desc: l }))
            );
          } else {
            // Jika bahan atau langkah tidak ada, setiap langkah atau bahan dapat dimulai dengan data kosong
            setIngredients([{ id: 1, name: '' }]);
            setSteps([{ id: 1, desc: '' }]);
          }
        } else {
          // Jika data tidak ada, setiap langkah atau bahan dapat dimulai dengan data kosong
          setIngredients([{ id: 1, name: '' }]);
          setSteps([{ id: 1, desc: '' }]);
        }
        console.log("p", ingredients().map(ingredient => ingredient.name));
        setBahan(ingredients().map(ingredient => ingredient.name));
        setLangkah(steps().map(step => step.desc))
        console.log("hlo", isiResep().id_foto)
    });
      

    const navigateBack = () => {
        navigate(-1)
    }


    console.log("bhn", ingredients().map(ingredient => ingredient.name));


    // function untuk iterasi ingredients
    const handleIngredientChange = (id: number, value: string) => {
        setIngredients((prevIngredients) =>
            prevIngredients.map((ingredient) =>
                ingredient.id === id ? { ...ingredient, name: value } : ingredient
            )
        );
        setBahan(ingredients().map(ingredient => ingredient.name))
        console.log("add",ingredients().map(ingredient => ingredient.name))
    };


    const addIngredient = () => {
        setIngredients((prevIngredients) => [
            ...prevIngredients,
            { id: prevIngredients.length + 1, name: '' },
        ]);
    };

    const removeIngredient = (id: number) => {
        setIngredients((prevIngredients) =>
            prevIngredients.filter((ingredient) => ingredient.id !== id)
        );
    };

    //function untuk steps
    const handleStepsChange = (id: number, value: string) => {
        setSteps((prevSteps) =>
            prevSteps.map((steps) =>
                steps.id === id ? { ...steps, desc: value } : steps
            )
        );
        setLangkah(steps().map(steps => steps.desc))

    };

    const addSteps = () => {
        setSteps((prevSteps) => [
            ...prevSteps,
            { id: prevSteps.length + 1, desc: '' },
        ]);
    };

    const removeSteps = (id: number) => {
        setSteps((prevSteps) =>
            prevSteps.filter((steps) => steps.id !== id)
        );
    };

    const [fileProfile, setFileProfile] = createSignal<File | null>(null);

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files && target.files[0];

        if (file) {
            setFileProfile(() => file);
        } else {
            setFileProfile(null);
        }
    };

    const handleDeleteFile = () => {
        // Tangani penghapusan file di EditProfile
        setFileProfile(null);
    };

    const handleSubmitFoto = async () => {
        try {
            const response = await fetch (`/api/resep/update_foto`, {
                method: 'PUT',
                // headers: {
                //     'Content-Type':'application/json',
                // },
                body: JSON.stringify({})
            })
        } catch (error) {

        }
    }

    console.log("ppp", isiResep())
    const handleSubmit = async () => {
        const data = {
            id_resep: isiResep().id_resep,
            nama_resep: namaResep(),
            id_kategori: kategori(),
            total_bahan: bahan().length,
            waktu_masak: waktuMasak(),
            bahan_masak: bahan(),
            cara_buat: langkah(),
        }

        const dataFoto = new FormData;
        dataFoto.append('id_resep', `${isiResep().id_resep}`)
        dataFoto.append('id_foto', `${isiResep().id_foto}`)
        if (fileProfile()) {
            dataFoto.append('nama_foto', fileProfile()!);
        } else {
            dataFoto.append('nama_foto', fotoResep());
        }

        console.log("data", data)
        try {
            const response = await fetch (`/api/resep/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(data)
            })
            const response2 = await fetch (`/api/resep/update_foto`, {
                method: 'PUT',
                // headers: {
                //     'Content-Type':'application/json',
                // },
                body: dataFoto
            })
            if (response.ok && response2.ok) {
                alert("Data berhasil diubah")
                navigate(-1);
                // navigate('/detail_resep_bahan_langkah');
            } else {
                const errorMessage = await response.text();
                alert(`Gagal menambah data. Pesan kesalahan: ${errorMessage}`);
                console.error('Gagal menambah data:', errorMessage);
                const errorMessage2 = await response2.text();
                alert(`Gagal menambah data. Pesan kesalahan: ${errorMessage2}`);
                console.error('Gagal menambah data:', errorMessage2);
            }
        } catch (error) {
            console.log("Gagal", error)
        }
    }

    const [popUpDelete, setPopUpDelete] = createSignal(false);

    // function openPopUpDelete(selectedResep: resepuser) {
    //     setResep(selectedResep.nama_resep);
    //     setID(selectedResep.id_resep);
    //     setPopUpDelete(true);
    // }

    function closePopUpDelete(){
        setPopUpDelete(false)
    } 
    
    let trashButtonRef: HTMLElement | null = null;

    const[deleteID, setDeleteID] = createSignal(0)
    const[deleteNama, setDeleteNama] = createSignal('')

    const openPopUpDelete = (e: any) => {
        console.log('openPopUpDelete called');

        // Pengecekan untuk melihat apakah event berasal dari tombol "trash"
        if (e.currentTarget.id === "your-trash-button-id") {
            console.log('Trash button clicked');
            setPopUpDelete(true);
            // Lakukan hal-hal yang diperlukan ketika tombol "trash" diklik
        }
    };

    onCleanup(() => {
        trashButtonRef = null;
    });
    
  return (
    <div style={{padding: "30px"}}>
        <div class="navigate-back-edit"onClick={navigateBack}>
            <svg style={{"margin-right":"15px"}} class="" xmlns="http://www.w3.org/2000/svg" width="15" height="29" viewBox="0 0 17 29" fill="none">
                <path d="M14.8281 1.84375L2.17188 14.5L14.8281 27.1562" stroke="black" stroke-width="3.28125" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <h1>Edit Resep</h1>
        </div>
        <div class="edit-resep-box">
            <div class="edit-resep-head">
                <div class="edit-resep-foto">
                    <div style={{display:"flex"}}>
                        {fileProfile() && fileProfile() instanceof File && (
                            <div>
                            {fileProfile() && <img src={URL.createObjectURL(fileProfile() as Blob)} alt="Selected Profile" />}
                            </div>
                        )}
                        {!fileProfile() && (
                            <img src={fotoResep()} alt="" />
                        )}
                    </div>
                    <div class="btn-resep-foto">
                        <label for="fileInput"><Icon icon="ep:upload-filled" color="white" width="25" /></label>
                        <input type="file" id="fileInput" accept=".png, .jpg" style="display: none;" 
                        onChange={handleFileChange}
                        />
                        {fileProfile() && fileProfile() instanceof File && (
                            <div>
                            {/* <label style={{"margin-top":"12px", "background-color":"#FFBE1A"}}><Icon icon="ep:upload-filled" width="20" /></label> */}
                            <label style={{"margin-top":"12px", "background-color":"gray"}} onClick={handleDeleteFile}><Icon icon="ion:trash-sharp" width="20" /></label>
                            </div>
                        )}
                    </div>
                </div>

                <div class="resep-head-ctn" style={{gap:"2vh", "justify-content":"center","align-items":"left"}}>

                    <div class="resep-head-ctn">
                        <label>Nama Resep</label>
                        <input type="text" 
                        value={namaResep()}
                        onInput={(e) => setNamaResep(e.currentTarget.value)}
                        />
                    </div>

                    <div class="resep-head-ctn">
                        <label>Kategori</label>
                        <select 
                        value={kategori()}
                        onInput={(e) => setKategori(parseFloat(e.currentTarget.value))}
                        >
                        {kategoriData().map((kategori) => (
                            <option value={kategori.id_kategori}>
                                {kategori.nama_kategori}
                            </option>
                        ))}

                                    {/* <option value="1">Sayur - Sayuran</option>
                                    <option value="2">Daging</option>
                                    <option value="3">Bahan Kue</option>
                                    <option value="4">Kacang dan Biji - bijian</option>
                                    <option value="5">Karbohidrat</option> */}

                                </select>
                    </div >

                    <div class="resep-head-ctn">
                        <label>Waktu Masak</label>
                        <div style={{display:"flex", "align-items":"center"}}>
                        <input type="number" style={{width:"70vh"}}
                        value={waktuMasak()}
                        onInput={(e) => setWaktuMasak(parseFloat(e.currentTarget.value))}
                        />
                        <p>Menit</p>
                        </div>
                    </div>

                </div>

            </div>
            <div class="edit-resep-container">
                <label>Bahan-bahan</label>
                {ingredients().map((ingredient, index) => (
                <div class="edit-ingredient-input">
                    <span>{index + 1}</span>
                    <input
                        type="text"
                        value={ingredient.name}
                        placeholder="Masukkan bahan"
                        onChange={(e) => handleIngredientChange(ingredient.id, e.target.value)}
                    />
                    <button class="btn-remove-edit" onClick={() => removeIngredient(ingredient.id)}>
                        <Icon icon="ep:remove-filled" color="red" width="30" height="30" />
                    </button>
                </div>
                ))}
                <div class="btn-add-bahan" >
                <button type="button" style={{}} onClick={addIngredient}>
                    <Icon icon="gridicons:add" color="#ffbe1a" width="30" height="30" />
                </button>
                </div>
            </div>
            <div class="edit-resep-container">
                <label>Langkah-langkah</label>
                {steps().map((steps, index) => (
                    <div class="edit-ingredient-input">
                        <span>{index + 1}</span>
                        <textarea
                            placeholder="Masukkan langkah masakan"
                            value={steps.desc}
                            onChange={(e) => handleStepsChange(steps.id, e.target.value)}>
                        </textarea>
                        <button class="btn-remove-edit" onClick={() => removeSteps(steps.id)}>
                            <Icon icon="ep:remove-filled" color="red" width="30" height="30" />
                        </button>
                    </div>
                ))}
                <div class="btn-add-bahan">
                    <button type="button" style={{}} onClick={addSteps}>
                        <Icon icon="gridicons:add" color="#ffbe1a" width="30" height="30" />
                    </button>
                </div>
            </div>
            <div style={{display:"flex"}}>
                <button class="edit-resep-button hapus-resep" id="your-trash-button-id"
                ref={(el) => (trashButtonRef = el)}
                onClick={(e) => {
                    e.stopPropagation();
                    openPopUpDelete(e);
                }}>Hapus</button>
                <button onClick={handleSubmit} class="edit-resep-button simpan-resep">Simpan</button>
            </div>
        </div>
        {popUpDelete() && <DeleteResep onClose={closePopUpDelete} id={deleteID()} nama={deleteNama()}/>}
    </div>
  );
};

export default EditResep;
