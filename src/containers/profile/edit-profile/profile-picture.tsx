import { Icon } from '@iconify-icon/solid';
import { createEffect, type Component, onCleanup, createSignal } from 'solid-js';
import './profile-picture.css'

interface ProfilePictureProps{
    onSaveFile: (file: File | null) => void;
    onDeleteFile: () => void;
}
const ProfilePicture: Component<ProfilePictureProps> = (props) => {
    const { onSaveFile, onDeleteFile  } = props;
    
    const closeModal = () => {
        const modal = document.getElementById('form_modal_3') as HTMLDialogElement;
        modal.close();
    };

    // Menutup modal ketika area di luar modal diklik
    const handleOutsideClick = (event: MouseEvent) => {
        const modal = document.getElementById('form_modal_3') as HTMLDialogElement;
        if (modal && !modal.contains(event.target as Node)) {
            closeModal();
        }
    };

    // Menambahkan event listener ketika komponen di-mount
    // createEffect(() => {
    //     document.addEventListener('click', handleOutsideClick);

    //     // Membersihkan event listener ketika komponen di-unmount
    //     onCleanup(() => {
    //         document.removeEventListener('click', handleOutsideClick);
    //     });
    // });

    const [fileProfile, setFileProfile] = createSignal<File | null>(null);

    // const handleFileChange = (e: Event) => {
    //     const target = e.target as HTMLInputElement;
    //     const file = target.files && target.files[0];

    //     if (file) {
    //         setFileProfile(() => file);
    //     } else {
    //         setFileProfile(null);
    //     }
    // };

    const handleFileChange = (event: Event) => {
        // Handling file change logic
        const input = event.target as HTMLInputElement;
        const files = input.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    };

    const handleFiles = (files: FileList) => {
        // Handle file drop logic
        const allowedTypes = ['image/png', 'image/jpeg'];
        if (files && files.length > 0) {
            const file = files[0];

            if (allowedTypes.includes(file.type)) {
                console.log('Dropped file:', file);
                // You can perform further processing with the dropped file here
                setFileProfile(() => file);
                onSaveFile(file)
            } else {
                console.log('Invalid file type. Please drop a PNG or JPEG image.');
            }
        }
    };

    const handleDragOver = (event: DragEvent) => {
        event.preventDefault();
        // Menambahkan gaya visual saat item di atas label
        const label = event.currentTarget as HTMLLabelElement;
        label.classList.add('drag-over');
    };

    const handleDragLeave = (event: DragEvent) => {
        // Menghapus gaya visual saat item meninggalkan label
        const label = event.currentTarget as HTMLLabelElement;
        label.classList.remove('drag-over');
    };

    const handleDrop = (event: DragEvent) => {
        event.preventDefault();

        // Menghapus gaya visual saat item di-drop
        const label = event.currentTarget as HTMLLabelElement;
        label.classList.remove('drag-over');

        // Mengakses file yang di-drop
        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
            handleFiles(files);
        }
    };

    const handleCancelFile = () => {
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.value = '';
        fileInput.removeEventListener('drop', handleDrop);
        
        onDeleteFile();
        setFileProfile(null)
    };




  return (
    <div>
        <div class="edit-prof-pic">
            <button onClick={() => (document.getElementById('form_modal_3') as HTMLDialogElement).showModal()}>
                <Icon icon="bi:camera-fill" color="white" width="15" />
            </button>
        </div>
        <dialog id="form_modal_3" class="modal">
            <div class="upload-profpic">
                {/* <form method='dialog'> */}
                    <div>
                        <svg onClick={closeModal} style={{"margin-left":"auto", cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M50 25C50 28.283 49.3534 31.5339 48.097 34.5671C46.8406 37.6002 44.9991 40.3562 42.6777 42.6777C40.3562 44.9991 37.6002 46.8406 34.5671 48.097C31.5339 49.3534 28.283 50 25 50C21.717 50 18.4661 49.3534 15.4329 48.097C12.3998 46.8406 9.64379 44.9991 7.32233 42.6777C5.00086 40.3562 3.15938 37.6002 1.90301 34.5671C0.646644 31.5339 -4.89212e-08 28.283 0 25C9.88008e-08 18.3696 2.63392 12.0107 7.32233 7.32233C12.0107 2.63392 18.3696 0 25 0C31.6304 0 37.9893 2.63392 42.6777 7.32233C47.3661 12.0107 50 18.3696 50 25ZM11.925 38.075C11.4042 37.5541 11.1117 36.8477 11.1117 36.1111C11.1117 35.3745 11.4042 34.6681 11.925 34.1472L21.0722 25L11.925 15.8528C11.419 15.3289 11.139 14.6272 11.1453 13.8989C11.1517 13.1706 11.4438 12.4739 11.9588 11.9588C12.4739 11.4438 13.1706 11.1517 13.8989 11.1453C14.6272 11.139 15.3289 11.419 15.8528 11.925L25 21.0722L34.1472 11.925C34.4035 11.6597 34.71 11.4481 35.0489 11.3025C35.3878 11.1569 35.7523 11.0803 36.1211 11.0771C36.4899 11.0739 36.8557 11.1442 37.1971 11.2838C37.5385 11.4235 37.8486 11.6298 38.1094 11.8906C38.3702 12.1514 38.5765 12.4615 38.7162 12.8029C38.8558 13.1443 38.9261 13.5101 38.9229 13.8789C38.9197 14.2477 38.8431 14.6122 38.6975 14.9511C38.5519 15.29 38.3403 15.5965 38.075 15.8528L28.9278 25L38.075 34.1472C38.581 34.6711 38.861 35.3728 38.8547 36.1011C38.8483 36.8294 38.5562 37.5261 38.0412 38.0412C37.5261 38.5562 36.8294 38.8483 36.1011 38.8547C35.3728 38.861 34.6711 38.581 34.1472 38.075L25 28.9278L15.8528 38.075C15.3319 38.5958 14.6255 38.8883 13.8889 38.8883C13.1523 38.8883 12.4459 38.5958 11.925 38.075Z" fill="#ED4848"/>
                        </svg>
                    </div>
                    <div class="edit-pp">
                        <label for="fileInput" class="pp-area"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        >
                            {!fileProfile() && 
                            <div class="edit-pp" style={{gap:"0"}}>
                            <Icon icon="simple-line-icons:cloud-upload" width="50"/>
                            Unggah
                            </div>}
                            {fileProfile() && 
                            <div>
                                {fileProfile()?.name}
                            </div>
                            }
                        </label>
                        <input type="file" id="fileInput" accept=".png, .jpg" style="display: none;" 
                        onChange={handleFileChange}
                        />

                        <div class={`set-pp ${fileProfile() ? 'active' : ''}`}>
                            <div style={{display:"flex","flex-direction":"row"}}>
                                <div>
                                {fileProfile() && fileProfile() instanceof File && 
                                    <div>
                                        {fileProfile() && <img src={URL.createObjectURL(fileProfile() as Blob)} alt="Selected Profile" />}
                                    </div>
                                }
                                </div>
                                <div>    
                                <p>{fileProfile()?.name}</p>
                                <p>{fileProfile()?.size}</p>
                                </div>
                            </div>
                            <div style={{cursor:"pointer"}} onClick={handleCancelFile}>
                                <Icon icon="ph:x-light" width="30" rotate={2} />
                            </div>
                        </div>
                        
                        <div class="upload-pp-btn">
                            <button onClick={closeModal}>Unggah</button>
                        </div>

                    </div>
                                                                    


                {/* </form> */}
            </div>
        </dialog>
    </div>
  );
};

export default ProfilePicture;
