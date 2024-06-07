import { onCleanup, createEffect, createSignal, onMount, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
import './unggah_resep.css';
import { dataProfile } from '../../store/profile/ProfileStore';
import { resultkategori } from '../../api/kategori';
import { DataKategori } from '../../api/kategori';


interface Ingredient {
    id: number;
    name: string;
}

interface Steps {
    id: number;
    desc: string;
}

const Unggah_resep: Component = () => {

    // deklarasi untuk semua function
    const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
    const [ingredients, setIngredients] = createSignal<Ingredient[]>([
        { id: 1, name: '' }, // Initial input box
    ]);
    const [steps, setSteps] = createSignal<Steps[]>([
        { id: 1, desc: '' }, // Initial input box
    ]);
    const navigate = useNavigate();
    // deklarasi untuk kirim data ke be
    const [namaResep, setNamaResep] = createSignal("");
    const [kategoriData, setKategoriData] = createSignal<resultkategori[]>([]);
    const [selectedKategori, setSelectedKategori] = createSignal("");
    const [waktuMasak, setWaktuMasak] = createSignal("");

    // get data untuk kategori
    // onMount(async () => {
    //     try {
    //         const data_kategori = await DataKategori("data kategori");
    //         setKategoriData(data_kategori);
    //     } catch (error) {
    //         console.error('Error fetching data from backend:', error);
    //     }
    // });

    // function untuk iterasi ingredients
    const handleIngredientChange = (id: number, value: string) => {
        setIngredients((prevIngredients) =>
            prevIngredients.map((ingredient) =>
                ingredient.id === id ? { ...ingredient, name: value } : ingredient
            )
        );
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

    // function untuk steps
    const handleStepsChange = (id: number, value: string) => {
        setSteps((prevSteps) =>
            prevSteps.map((steps) =>
                steps.id === id ? { ...steps, desc: value } : steps
            )
        );
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

    // function untuk mengecek user minimal memasukkan 1 bahan atau langkah
    const isInputValid = () => {
        // Check if at least one ingredient and one step are entered
        const isIngredientsValid = ingredients().some((ingredient) => ingredient.name.trim() !== '');
        const isStepsValid = steps().some((step) => step.desc.trim() !== '');

        if (!namaResep() || ingredients().length === 0 || !waktuMasak() || steps().length === 0 || !isIngredientsValid || !isStepsValid) {
            // alert('Semua kotak input harus terisi');
            showInvalidAlert();
            return false;
        }

        return true;

    };

    const [invalidAlert, setInvalidAlert] = createSignal(false);

    function showInvalidAlert(){
        setInvalidAlert(!invalidAlert());
        setTimeout(() => {
            setInvalidAlert(false);
        }, 9000);
    }

    const submit = async () => {
        console.log('halo')
    };
    // function untuk mengirim data ke backend
    const sendUnggahResep = async () => {
        if (!isInputValid()) {
            return;
        }

        // Format array bahan menjadi array JSON
        const formattedIngredients = ingredients().map((ingredient) => ingredient.name);

        // Format array langkah menjadi array JSON
        const formattedSteps = steps().map((step) => step.desc.trim());

        // Calculate the total number of ingredients
        const totalBahanValue = ingredients().filter((ingredient) => ingredient.name.trim() !== '').length;


        const data = {
            id_resep: 0,
            nama_resep: namaResep(),
            id_akun: dataProfile().id,
            // id_kategori: selectedKategori(),
            id_kategori: parseInt(selectedKategori(), 10),
            total_bahan: totalBahanValue,
            waktu_masak: parseInt(waktuMasak(), 10),
            bahan_masak: formattedIngredients,
            cara_buat: formattedSteps,
            total_ulasan: 0
        };

        console.log('data', data)

        try {
            const response = await fetch('api/resep/ins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                console.log('Navigating to /unggah_gambar...');
                alert("bisa")
                console.log('bisa')
                // Navigate to the next page
                navigate('/unggah_gambar', { replace: true });
            } else {
                // Handle error response
                alert('Error, data belum terkirim!');
            }
        } catch (error) {
            console.log('Error saat mengirim data:', error);
        }
    };

    // function untuk kondisi form submit
    // const handleSubmit = async (event: Event) => {
    //     event.preventDefault();
    //     if (isFormValid()) {
    //         navigate('/unggah_gambar', { replace: true });
    //     } else {
    //         alert('Isi kotak yang sudah Anda tambahkan');
    //     }
    // };

    const backToHome = () => {
        navigate(-1); // Navigate to the home page when cancel button is clicked
    };

    // fungsi untuk menampilkan dan menyembunyikan pop up
    const [showConfirmPopup, setShowConfirmPopup] = createSignal(false);

    const openConfirmPopup = () => {
        if (!isInputValid()) {
            return;
          } else {
            // Jika data valid, tampilkan pop-up konfirmasi
            setShowConfirmPopup(true);
          }
    };

    const closeConfirmPopup = () => {
        setShowConfirmPopup(false);
    };

    const handleConfirm = () => {
        sendUnggahResep(); // Panggil fungsi sendUnggahResep setelah konfirmasi
        navigate('/unggah_gambar');
    };

    const handleCancelConfirm = () => {
        closeConfirmPopup();
        // Tambahkan logika lain jika diperlukan setelah membatalkan konfirmasi
    };

    return (
        <div>
            <div class="unggah-resep-container">
                <div class="unggah-resep-title">
                    <Icon icon="ion:chevron-back" color="black" width="38" height="38" onClick={backToHome} style={{"cursor":"pointer"}}/>
                    <h2>Unggah Resep</h2>
                </div>
                <div class="unggah-resep-input">
                    <div class="form">
                        <label>Nama Resep Anda</label>
                        <br />
                        <input style={{ "margin-left": "18px" }} type="text" placeholder="Masukkan nama masakan"
                            value={namaResep()}
                            onInput={(e) => setNamaResep(e.currentTarget.value)} />

                        <br />

                        <div style={{ "display": "flex", "flex-direction": "row", "justify-content": "space-between", "margin-right": "3.9rem" }}>
                            <div>
                                <label>Waktu Masak</label>
                                <br />
                                <input style={{ "margin-left": "18px", "width": "18rem" }} type="number" placeholder="Masukkan waktu masak" value={waktuMasak()}
                                    onInput={(e) => setWaktuMasak(e.currentTarget.value)} />
                                <span style={{ "font-family": "Poppins-Light" }}> menit</span>
                            </div>

                            <div>
                                <label>Pilih Kategori</label>
                                <br />
                                <select name="kategori" id="kategori" value={selectedKategori()} onInput={(e) => setSelectedKategori(e.currentTarget.value)} style={{ "width": "18rem" }}>
                                    <option value="">Pilih Kategori</option>
                                    {kategoriData().map((kategori) => (
                                        <option value={kategori.id_kategori}>
                                            {kategori.nama_kategori}
                                        </option>
                                    ))}

                                    <option value="1">Sayur - Sayuran</option>
                                    <option value="2">Daging</option>
                                    <option value="3">Bahan Kue</option>
                                    <option value="4">Kacang dan Biji - bijian</option>
                                    <option value="5">Karbohidrat</option>

                                </select>
                            </div>

                        </div>

                        <div class="unggah-resep-input2">
                            <div class="bahan-resep">
                                <label>Bahan-bahan</label>
                                {ingredients().map((ingredient, index) => (
                                    <div class="ingredient-input">
                                        <span>{index + 1}</span>
                                        <input
                                            type="text"
                                            value={ingredient.name}
                                            placeholder="Masukkan bahan"
                                            onChange={(e) => handleIngredientChange(ingredient.id, e.target.value)
                                            }
                                        />

                                        <button class="btn-remove-bhn" onClick={() => removeIngredient(ingredient.id)}>
                                            <Icon icon="ep:remove-filled" color="red" width="30" height="30" />
                                        </button>
                                    </div>
                                ))}
                                <div class="button-add">
                                    <button type="button" style={{}} onClick={addIngredient}>
                                        <Icon icon="gridicons:add" color="#ffbe1a" width="30" height="30" />
                                    </button>
                                </div>
                            </div>

                            <div class="langkah-masak">
                                <label>Langkah-langkah</label>
                                {steps().map((steps, index) => (
                                    <div class="steps-input">
                                        <span>{index + 1}</span>
                                        <textarea
                                            placeholder="Masukkan langkah masakan" value={steps.desc}
                                            onChange={(e) => handleStepsChange(steps.id, e.target.value)}>
                                        </textarea>
                                        <button class="btn-remove-bhn" onClick={() => removeSteps(steps.id)}>
                                            <Icon icon="ep:remove-filled" color="red" width="30" height="30" />
                                        </button>
                                    </div>
                                ))}
                                <div class="button-add2">
                                    <button type="button" style={{}} onClick={addSteps}>
                                        <Icon icon="gridicons:add" color="#ffbe1a" width="30" height="30" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="button-bawah">
                            <button class="button-unggah" onClick={() => openConfirmPopup()}>
                                Lanjut
                            </button>
                        </div>
                    </div>
                </div>

                <div class="overlay-popup-confirm" style={{ display: showConfirmPopup() ? 'block' : 'none' }}>
                    <div class="col-popup-confirm">
                        <p>Anda tidak akan bisa kembali ke halaman ini</p>
                        <p>Apakah Anda sudah yakin dengan resep yang Anda buat?</p>
                        <div class="button-confirm">
                            <button class="confirm" onClick={handleConfirm}>Yakin</button>
                            <button class="cancel" onClick={handleCancelConfirm}>Kembali</button>
                        </div>
                    </div>
                </div>

                                    

            </div>

            {invalidAlert() &&
                <div class={`popopup ${invalidAlert() ? 'fade-out' : ''}`}>
    <p>Mohon isi data dengan lengkap!</p>
</div>

            }
            

        </div>
    );
};

export default Unggah_resep;
