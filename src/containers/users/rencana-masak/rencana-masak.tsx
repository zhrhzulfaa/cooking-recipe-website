import { createSignal, type Component, onCleanup, createEffect, onMount } from 'solid-js';
import './rencana-masak.css'
import '../detail-resep/popup/tambah-rencana-masak.css'
import { Icon } from '@iconify-icon/solid';
import { A, useNavigate } from '@solidjs/router';
import { DataRencanaMasak, resultrencanamasak } from '../../../api/data-rencana-masak';
import { DataResep, resultresep } from '../../../api/resep/dataresep';
import { updateDataResep } from '../../../store/Resep/ResepData';

const RencanaMasak: Component = () => {
    const navigate = useNavigate()
    const [rencanaMasak, setRencanaMasak] = createSignal<resultrencanamasak[]>([]);
    const [resepDetails, setResepDetails] = createSignal({});
    const [mergedData, setMergedData] = createSignal<Array<resultrencanamasak & { resepDetails?: resultresep }>>([]);
    const [filteredPlans, setFilteredPlans] = createSignal<Array<resultrencanamasak & { resepDetails?: resultresep }>>([]);

    const [isTodayActive, setIsTodayActive] = createSignal(false);

    const [fotoResep, setFotoResep] = createSignal('')

    onMount(async () => {
        const rencana = await DataRencanaMasak("rencana");
        console.log("rencana", rencana)
        setRencanaMasak(rencana)

        try {
            const rencana = await DataRencanaMasak("rencana");
            setRencanaMasak(rencana);
        
            const promises = rencana.map(async (plan) => {
              try {
                const allResepDetails = await DataResep("resep");
                allResepDetails

                
                
                const mergedData = rencana
                .filter((plan) => plan.status === null)
                .map((plan) => {
                    const resepDetailsResponse = allResepDetails.find((resep) => resep.id_resep === plan.id_resep && resep)
                    // setFotoResep(`/api/resep/makanan/${resepDetailsResponse?.nama_foto}`)
                    console.log('fotoResepUrl:', fotoResep());

                    return {
                      ...plan,
                      resepDetails: resepDetailsResponse,
                      foto: fotoResep()
                    };
                  });
                  
                  const today = new Date();
                  const todayPlans = mergedData.filter((plan) => {
                    const planDate = new Date(plan.waktu);
                    plan.waktu = planDate; // Menyimpan objek Date ke dalam properti waktu
                    return isSameDate(today, planDate);
                });
                
          
                  if (todayPlans.length > 0) {
                      const todayIndex = todayPlans[0].waktu.getDate(); // Menggunakan waktu sebagai objek Date
                      setClickedDate(todayIndex);
                      handleDateClick(todayIndex);
                      console.log(todayIndex)
                      setCurrentIndex(0);
                      if (todayIndex > 14 && todayIndex <= 28) {
                        handleNextClick();
                      } else if (todayIndex > 28) {
                          handleNextClick();
                          handleNextClick();
                          console.log("diatas 28");
                      }
                    
                  }
            
                  setMergedData(mergedData);

              } catch (error) {
                console.error('Error fetching recipe details', error);
              }
            });
          } catch (error) {
            console.error('Error fetching meal plan data', error);
          }
    });

    const currentDate = new Date();
    const currentMonthShort = currentDate.toLocaleString('default', { month: 'short' });
    
    const [selectedMonth, setSelectedMonth] = createSignal<'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec'>
                                                (currentMonthShort as 'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec');    
    const [selectedYear, setSelectedYear] = createSignal(new Date().getFullYear());
    const [currentIndex, setCurrentIndex] = createSignal(0);
    const [itemsPerPage, setItemsPerPage] = createSignal(14);
    const [daysInMonth, setDaysInMonth] = createSignal(0); // Initialize with 0 initially
    const [clickedDate, setClickedDate] = createSignal<number | null>(null);

    // Declare daysInMonthMap outside createEffect to make it accessible
    const daysInMonthMap = {
      Jan: 31,
      Feb: (year: number): number => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28),
      Mar: 31,
      Apr: 30,
      May: 31,
      Jun: 30,
      Jul: 31,
      Aug: 31,
      Sep: 30,
      Oct: 31,
      Nov: 30,
      Dec: 31,
    };

    // Update daysInMonth whenever selectedMonth or selectedYear changes
    createEffect(() => {
      setDaysInMonth(getDaysInMonth(selectedMonth(), selectedYear()));
    });
  
    // Handler for the previous button
    const handlePrevClick = () => {
      const prevDaysInMonth = getDaysInMonth(selectedMonth(), selectedYear());
      const prevIndex = currentIndex();
      const newPrevIndex = Math.max(0, prevIndex - itemsPerPage());
      setCurrentIndex(newPrevIndex);
      // updateMonthAndYear(newPrevIndex, prevDaysInMonth);
    };
  
    // Handler for the next button
    const handleNextClick = () => {
      console.log("next")
      // const nextDaysInMonth = getDaysInMonth(selectedMonth(), selectedYear());
      const prevIndex = currentIndex();
      const newNextIndex = Math.min(prevIndex + itemsPerPage(), daysInMonth() - 14);
      setCurrentIndex(newNextIndex);
      // updateMonthAndYear(newNextIndex, nextDaysInMonth);
    };
  
    // Function to update the month and year based on the current index
    // const updateMonthAndYear = (index: number, daysInMonth: number) => {
    //   const newMonthIndex = index >= daysInMonth ? 0 : index;
    //   const newMonth = Object.keys(daysInMonthMap)[newMonthIndex] as keyof typeof daysInMonthMap;
    //   setSelectedMonth(newMonth);
    //   setSelectedYear((prevYear) => {
    //     const newYear =
    //       newMonth === 'Dec' && newMonthIndex === 0
    //         ? prevYear + 1
    //         : newMonth === 'Jan' && newMonthIndex === daysInMonth - 1
    //         ? prevYear - 1
    //         : prevYear;
    //     return newYear;
    //   });
    // };
  
    // Cleanup function to reset currentIndex when the component unmounts
    onCleanup(() => {
      setCurrentIndex(0);
      setItemsPerPage(14);
    });
  
    const handleMonthChange = (e: { target: { value: any } }) => {
      const selectedMonthValue = e.target.value;
      setSelectedMonth(selectedMonthValue);
    };

    function getDaysInMonth(month: keyof typeof daysInMonthMap, year: number): number {
      const value = daysInMonthMap[month];
      return typeof value === 'function' ? value(year) : value;
    }

    function navigateDetail(resepDetails?: resultresep){
        updateDataResep({
            id_resep: resepDetails?.id_resep,
            id_kategori: resepDetails?.id_kategori,
            id_akun: resepDetails?.id_akun,
            username: resepDetails?.username,
            nama_resep: resepDetails?.nama_resep,
            kategori: resepDetails?.nama_kategori,
            total_bahan: resepDetails?.total_bahan,
            waktu_masak: resepDetails?.waktu_masak,
            bahan: resepDetails?.bahan_masak,
            langkah: resepDetails?.cara_buat,
            nama_foto: resepDetails?.nama_foto
          });
        // console.log("ph", dataResep())
        navigate("/detail_resep_bahan_langkah")
    }
    
    const isSameDate = (date1: Date, date2: Date) => {
        return (
          date1.getDate() === date2.getDate() &&
          date1.getMonth() === date2.getMonth() &&
          date1.getFullYear() === date2.getFullYear()
        );
      };

    const handleDateClick = (dayIndex: number) => {
        console.log('Clicked date:', dayIndex);
        setClickedDate(dayIndex);

        // Perform filtering here based on the clicked date
        const newFilteredPlans = mergedData().filter((plan) => {
            const planDate = new Date(plan.waktu);
            const selectedMonth = new Date().toLocaleString('default', { month: 'short' });
            const selectedYear = new Date().getFullYear();
            
            return (
                planDate.getDate() === clickedDate() &&
                planDate.getMonth() === Object.keys(daysInMonthMap).indexOf(selectedMonth) &&
                planDate.getFullYear() === selectedYear &&
                planDate >= new Date() // Only include plans from today and onward
            );
        });

        setFilteredPlans(newFilteredPlans);
    };

    const EditRencanaMasak = async () => {
      const dataSend = {
        id_rencanamasak: editID(),
        waktu: `${timestamp()}:00`,
        status: null,
      }

      console.log("update", dataSend)

      try {
        const response = await fetch (`/api/rencana_masak/update`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(dataSend)
        })

        if(response.ok){
          alert('Rencana masak berhasil diubah');
          location.reload();
        } else {
          const errorMessage = await response.text();
          alert(`Gagal menambah data. Pesan kesalahan: ${errorMessage}`);
        }
      } catch(error) {
        console.log("Gagal", error)
      }
    }

    const handleSubmit = async (data: resultrencanamasak & { resepDetails?: resultresep | undefined; }, status: boolean) => {
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 11);

      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}:${seconds}`;

      const timestamp = `${formattedDate}${formattedTime}`;

      const dataSend = {
        id_rencanamasak: data.id_rencanamasak,
        waktu: timestamp,
        status: status ? true : false,
      }

      console.log("update", dataSend)

      try {
        const response = await fetch (`/api/rencana_masak/update`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(dataSend)
        })

        if(response.ok){
          status ? alert("Rencana masak selesai") : alert("Rencana masak dilewati");
          location.reload();
        } else {
          const errorMessage = await response.text();
          alert(`Gagal menambah data. Pesan kesalahan: ${errorMessage}`);
        }
      } catch(error) {
        console.log("Gagal", error)
      }
    }

  const [editID, setEditID] = createSignal(0)
  const [popupPosition, setPopupPosition] = createSignal({ top: 0, left: 0 });
  const [editPopUp, setEditPopUp] = createSignal(false);
    
  let editButtonRef: HTMLElement | null = null;

  const openPopUpEdit = (e: any, data: resultrencanamasak ) => {
      console.log('openPopUpDelete called');

      // Pengecekan untuk melihat apakah event berasal dari tombol "trash"
      if (e.currentTarget.id === "btn-edit-mealplan") {
          console.log('Trash button clicked');
          setEditPopUp(!editPopUp());
          setEditID(data.id_rencanamasak)
          const buttonDiv = e.currentTarget.parentElement; // Assuming the button is directly inside the div

          if (!buttonDiv) {
            // Handle the case where the button's parent div is not found
            return;
          }
          const buttonRect = buttonDiv.getBoundingClientRect();

          // Calculate the desired position relative to the clicked button
          const desiredTop = buttonRect.bottom - 370;
          const desiredLeft = buttonRect.left - 350;
  
          setPopupPosition({
              top: desiredTop,
              left: desiredLeft,
          });
          
          // Set the fixed position of the popup
          setPopupPosition({
            top: desiredTop,
            left: desiredLeft,
          });

          // Lakukan hal-hal yang diperlukan ketika tombol "trash" diklik
      }
  };

  onCleanup(() => {
      editButtonRef = null;
  });

  const [timestamp, setTimestamp] = createSignal('')

  
  let editCloseRef: HTMLElement | null = null;

  const handleClickOutside = (e: MouseEvent) => {
    // Check if the click is outside the verif-pass-popup element
    if (editCloseRef && !editCloseRef.contains(e.target as Node)) {
      setEditPopUp(false)
    }
  };

  // Add a click event listener to the document body
  onCleanup(() => {
    document.body.removeEventListener('click', handleClickOutside);
  });

  // Add a click event listener to the document body
  document.body.addEventListener('click', handleClickOutside);

  return (
    <div class="meal-plan-page">
        <div class="mealplan-ct">
            <div class="meal-plan-1">
                <div>

                <h1>Rencana Masak</h1>
                <p>Rencanakan dan temukan masakan anda sesuai dengan agenda.</p>
                </div>
                <div class="meal-dropdown">
                <select
                name="months"
                id="months"
                value={selectedMonth()}
                onChange={handleMonthChange}
                >
                <option value="Jan">Januari</option>
                <option value="Feb">Februari</option>
                <option value="Mar">Maret</option>
                <option value="Apr">April</option>
                <option value="May">Mei</option>
                <option value="Jun">Juni</option>
                <option value="Jul">Juli</option>
                <option value="Aug">Agustus</option>
                <option value="Sep">September</option>
                <option value="Oct">Oktober</option>
                <option value="Nov">November</option>
                <option value="Dec">Desember</option>
                </select>
                </div>
            </div>
            <div class="calendar-container1">
                <button onClick={handlePrevClick}>
                    <Icon icon="ic:round-navigate-next" width="40" rotate={2} />
                </button>
                {Array.from({ length: itemsPerPage() }, (_, index) => {
                const dayIndex = currentIndex() + index;
                const currentDate = new Date(selectedYear(), Object.keys(daysInMonthMap).indexOf(selectedMonth()), dayIndex + 1);

                return dayIndex < Number(daysInMonth()) ? (
                    <div class={`plan-calendar ${clickedDate() === dayIndex + 1 ? 'selected' : ''} `} onClick={() => {
                        setClickedDate(dayIndex + 1);
                        handleDateClick(dayIndex + 1);
                    }}>
                    {currentDate.getDate()}
                    <br />
                    {selectedMonth()}
                    </div>
                ) : null;
                })}
                <button onClick={handleNextClick}>
                    <Icon width="40" icon="ic:round-navigate-next" />
                </button>
            </div>

            <div>
                <h2>Rencana Masak Hari Ini</h2>
                <div class="meal-reminder">
                    {filteredPlans().length > 0 ? (
                    filteredPlans().map((plan, index) => {
                      const waktu = new Date(plan.waktu);

                      // Mendapatkan bulan dalam format MMM
                      const day = waktu.getDate();

                      const bulan = new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(waktu);

                      // Mendapatkan tahun
                      const tahun = waktu.getFullYear();
                      
                      // Menggabungkan bulan dan tahun
                      const bulanTahun = `${bulan} ${tahun}`;
                      // Mendapatkan jam dalam format HH:mm
                      const jam = waktu.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

                    return (
                      <div>
                        {index != 0 ? (
                        <div class="meal-card-ctn">
                          <div class="meal-card-jam">
                            <h1>{jam}</h1>
                          </div>
                        <div class="meal-reminder-card" onClick={() => navigateDetail(plan.resepDetails)}>
                            <div style={{width:"6px", height:"100px", "background-color":"#FFBE1A"}}></div>
                            <div style={{"text-align":"center"}}>
                                <b>{day}</b> <p>{bulanTahun}</p>
                            </div>
                            <img src={`/api/resep/makanan/${plan.resepDetails?.nama_foto}`} alt="" />
                            <div style={{width:"60vh"}}>
                                <h2>{plan.resepDetails?.nama_resep}</h2>
                                <h4>{plan.resepDetails?.username}</h4>
                                <h5>{plan.resepDetails?.total_ulasan} Ulasan</h5>
                            </div>
                            <div style={{"margin-bottom":"auto",left:"40px", cursor:"pointer"}}
                            id="btn-edit-mealplan"
                            ref={(el) => (editButtonRef = el)}
                            onClick={(e) => {
                                e.stopPropagation();
                                openPopUpEdit(e, plan);
                            }}
                            >
                                <Icon icon="pepicons-pencil:dots-y" width="30" />
                            </div>
                        </div>
                      </div>
                        ):(
                          <div class="meal-card-ctn">
                            <div class="meal-card-jam">
                              <h1>{jam}</h1>
                            </div>

                            <div class="meal-reminder-card z-2" onClick={() => navigateDetail(plan.resepDetails)}>
                              <div style={{width:"6px", height:"100px", "background-color":"#ED4848"}}></div>
                                <div style={{"text-align":"center"}}>
                                  <b>{day}</b> <p>{bulanTahun}</p> 
                                </div>
                                <img src={`/api/resep/makanan/${plan.resepDetails?.nama_foto}`} alt="" />
                                <div style={{width:"60vh"}}>
                                  <h2>{plan.resepDetails?.nama_resep}</h2>
                                  <h4>{plan.resepDetails?.username}</h4>
                                  <h5>{plan.resepDetails?.total_ulasan} Ulasan</h5>
                                </div>
                                <div style={{"margin-bottom":"auto",left:"40px"}}
                                id="btn-edit-mealplan"
                                ref={(el) => (editButtonRef = el)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    openPopUpEdit(e, plan);
                                }}
                                >
                                  <Icon icon="pepicons-pencil:dots-y" width="30" />
                                </div>
                            </div>
      
                            <div class="meal-card-expand">
                              <div class="btn-done-cancel">
                                <Icon icon="mi:close" width="26" onClick={() => handleSubmit(plan, false)}/>Lewati
                              </div>
                              <div class="btn-done-cancel">
                              <Icon icon="ph:check-bold" width="25" onClick={() => handleSubmit(plan, true)}/>Selesai
                              </div>
                            </div>
                    
                          </div> 
                        )}

                        </div>
                    );
                    })
                    ) : (
                      <div class="no-mealprep">
                        <img src="/src/assets/img/mealprep.png" alt="" />
                        <p>Tambahkan rencana masak anda</p>
                      </div>
                    )}

                </div>
            </div>
        </div>
        <div class="btn-add-meal">
        <A href='/home'>
        <button><Icon icon="octicon:plus-16" width="30" /></button>
        </A>
        </div>
        {editPopUp() &&
          <div style={{position:"relative",  top: `${popupPosition().top}px`, left: `${popupPosition().left}px`,"z-index":"6"}}
          ref={(el) => (editCloseRef = el)}
          onClick={(e) => {
            e.stopPropagation();
          }}
          >
            <div class="add-meal-plan1" style={{right: "-33.8vh", top:"-8vh"}} >
                <div>
                    <label>Pilih Tanggal</label>
                    <input type="datetime-local" 
                    value={timestamp()}
                    onInput={(e) => setTimestamp(e.currentTarget.value)}
                    />
                </div>
    
                <button onClick={EditRencanaMasak}>Simpan</button>
            </div>
          </div>
    }
    </div>
  );
};

export default RencanaMasak;
