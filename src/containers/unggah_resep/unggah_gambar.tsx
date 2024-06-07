import { onCleanup, createEffect, createSignal, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Icon } from '@iconify-icon/solid';
import './unggah_resep.css';
import { resultresep } from '../../api/resep/dataresep';

export async function getLastIdResep(): Promise<number | null> {
    const response = await fetch(`/api/resep/show`);
    const results = await response.json();
    const documents = results as resultresep[];

    if (documents.length > 0) {
        return documents[documents.length - 1].id_resep;
    } else {
        return null;
    }
}

const Unggah_gambar: Component = () => {

    // deklarasi untuk semua function
    const [selectedFile, setSelectedFile] = createSignal<File | null>(null);
    const [imageUrl, setImageUrl] = createSignal<string | null>(null);
    const navigate = useNavigate();

    // untuk mengambil id resep terakhir
    createEffect(async () => {
        // Mengambil id_resep terakhir saat komponen dipasang
        const lastIdResep = await getLastIdResep();
        // Gunakan lastIdResep sesuai kebutuhan, misalnya, simpan di state komponen
        console.log('Last Id Resep:', lastIdResep);
    });

    // function untuk mengunggah gambar
    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        const file = target.files && target.files[0];


        if (file) {
            setSelectedFile(() => file);
            console.log('test', selectedFile());

            // Create a temporary URL for the selected image file
            const url = URL.createObjectURL(file);
            setImageUrl(() => url);
        } else {
            setSelectedFile(null);
            setImageUrl(null);
        }
    };

    const handleCancelFile = () => {
        setSelectedFile(null)
        setImageUrl(null)
    };
    // function agar user memasukkan foto (wajib)
    const isInputValid = () => {
        return !!selectedFile();
    };

    // function untuk kondisi form submit
    const handleSubmit = async () => {
        const idResepValue = 0;
        const idFotoValue = 0;
        const lastIdResep = await getLastIdResep();
        const unggah = new FormData();

        unggah.append('id_resep', '0');
        unggah.append('id_foto', '0');

        if (selectedFile()) {
            unggah.append('nama_foto', selectedFile()!);
        }

        console.log("??", selectedFile())

        // event.preventDefault();

        try {
            const response = await fetch('/api/resep/inspic', {
                method: 'POST',
                // headers: {
                //     'Content-Type': 'application/json'
                // },
                body: unggah,
            });

            if (response.ok) {
                alert("Gambar berhasil diunggah");
                navigate('/home', { replace: true });
                // window.location.reload();
            } else {
                const errorMessage = await response.text();
                alert(`Gagal mengubah data. Pesan kesalahan: ${errorMessage}`);
                console.error('Gagal mengubah data:', errorMessage);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleCancel = () => {
        navigate('/unggah_resep', { replace: true }); // Navigate to the home page when cancel button is clicked
    };

    // fungsi untuk menampilkan dan menyembunyikan pop up
    const [showConfirmPopup, setShowConfirmPopup] = createSignal(false);

    const openConfirmPopup = () => {
        if (!isInputValid()) {
            alert("Anda wajib mencantumkan gambar untuk resep Anda!")
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
        handleSubmit(); // Panggil fungsi sendUnggahResep setelah konfirmasi
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
                    <h2>Unggah Gambar Resep</h2>
                </div>

                <div class="unggah-resep-input">
                    <div class="form">
                        <div class="unggah-gambar-input2">
                            {!imageUrl() ? (
                            <label for="file-upload">
                            <Icon icon="icon-park:upload-one" width="68" height="68" style={{opacity:"0.7"}} />
                            <p style={{ "font-family": "Poppins-Light" }}>Unggah gambar masakan</p>
                            {/* <input
                                type="file"
                                id="file-upload"
                                accept=".png, .jpg"
                                style="display: none"
                                onChange={handleFileChange}
                            />
                            <label for="file-upload">{imageUrl() ? (
                                <img src={imageUrl()!} alt="Selected Image" />
                            ) : (
                                <div style={{display:"flex", "flex-direction":"column"}}>
                                <Icon icon="icon-park:upload-one" width="68" height="68" />
                                <p style={{ "font-family": "Poppins-Light" }}>Unggah gambar masakan</p>
                                </div>
                            )}</label>  */}
                            </label>
                            ):(
                            <div>
                                <img src={imageUrl()!} alt="Selected Image" class="img-unggah-gambar-page"/>
                                <div class="terunggah-gambar">
                                <div class="desc-unggah-gambar">
                                    <div>    
                                    <p style={{"max-width":"300px", "text-overflow":"ellipsis"}}>{selectedFile()?.name}</p>
                                    <p>{selectedFile()?.size}</p>
                                    </div>
                                </div>
                                <button onClick={handleCancelFile} class="gajadi-unggah">
                                    <Icon icon="ph:x-light" width="40" style={{opacity:"0.7"}} />
                                </button>
                                </div>
                            </div>
                            )}

                            <input
                                    type="file"
                                    id="file-upload"
                                    accept=".png, .jpg"
                                    style="display: none"
                                    onChange={handleFileChange}
                            />
                        </div>
                   

                        

                        <div class="button-bawah">
                            <button class="button-unggah" onClick={() => openConfirmPopup()}>
                                Unggah Resep
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
        </div>
    );
};

export default Unggah_gambar;

