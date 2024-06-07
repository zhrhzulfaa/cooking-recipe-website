// import { createSignal, type Component, onCleanup, createEffect } from 'solid-js';
// import './rencana-masak.css'
// import { Icon } from '@iconify-icon/solid';

// interface RencanaMasakProps {
//   onClose: () => void,
// }

// const RencanaMasak: Component<RencanaMasakProps> = (props) => {

//     const [selectedMonth, setSelectedMonth] = createSignal<'Jan' | 'Feb' | 'Mar' | 'Apr' | 'May' | 'Jun' | 'Jul' | 'Aug' | 'Sep' | 'Oct' | 'Nov' | 'Dec'>('Jan');
//     const [selectedYear, setSelectedYear] = createSignal(new Date().getFullYear());
//     const [currentIndex, setCurrentIndex] = createSignal(0);
//     const [itemsPerPage, setItemsPerPage] = createSignal(7);
//     const [daysInMonth, setDaysInMonth] = createSignal(0); // Initialize with 0 initially

//     // Declare daysInMonthMap outside createEffect to make it accessible
//     const daysInMonthMap = {
//       Jan: 31,
//       Feb: (year: number): number => (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28),
//       Mar: 31,
//       Apr: 30,
//       May: 31,
//       Jun: 30,
//       Jul: 31,
//       Aug: 31,
//       Sep: 30,
//       Oct: 31,
//       Nov: 30,
//       Dec: 31,
//     };

//     // Update daysInMonth whenever selectedMonth or selectedYear changes
//     createEffect(() => {
//       setDaysInMonth(getDaysInMonth(selectedMonth(), selectedYear()));
//     });
  
//     // Handler for the previous button
//     const handlePrevClick = () => {
//       const prevDaysInMonth = getDaysInMonth(selectedMonth(), selectedYear());
//       const prevIndex = currentIndex();
//       const newPrevIndex = Math.max(0, prevIndex - itemsPerPage());
//       setCurrentIndex(newPrevIndex);
//       // updateMonthAndYear(newPrevIndex, prevDaysInMonth);
//     };
  
//     // Handler for the next button
//     const handleNextClick = () => {
//       const nextDaysInMonth = getDaysInMonth(selectedMonth(), selectedYear());
//       const prevIndex = currentIndex();
//       const newNextIndex = Math.min(prevIndex + itemsPerPage(), daysInMonth() - 7);
//       setCurrentIndex(newNextIndex);
//       // updateMonthAndYear(newNextIndex, nextDaysInMonth);
//     };
  
//     // Function to update the month and year based on the current index
//     // const updateMonthAndYear = (index: number, daysInMonth: number) => {
//     //   const newMonthIndex = index >= daysInMonth ? 0 : index;
//     //   const newMonth = Object.keys(daysInMonthMap)[newMonthIndex] as keyof typeof daysInMonthMap;
//     //   setSelectedMonth(newMonth);
//     //   setSelectedYear((prevYear) => {
//     //     const newYear =
//     //       newMonth === 'Dec' && newMonthIndex === 0
//     //         ? prevYear + 1
//     //         : newMonth === 'Jan' && newMonthIndex === daysInMonth - 1
//     //         ? prevYear - 1
//     //         : prevYear;
//     //     return newYear;
//     //   });
//     // };
  
//     // Cleanup function to reset currentIndex when the component unmounts
//     onCleanup(() => {
//       setCurrentIndex(0);
//       setItemsPerPage(7);
//     });
  
//     const handleMonthChange = (e: { target: { value: any } }) => {
//       const selectedMonthValue = e.target.value;
//       setSelectedMonth(selectedMonthValue);
//     };

//     function getDaysInMonth(month: keyof typeof daysInMonthMap, year: number): number {
//       const value = daysInMonthMap[month];
//       return typeof value === 'function' ? value(year) : value;
//     }

//     // createEffect(() => {
//     //   const handleClickOutside = (e: MouseEvent) => {
//     //     const target = e.target as HTMLElement;
//     //     if (target && !target.closest('.meal-plan-page')) {
//     //       // setShowDropdown(false);
//     //       props.onClose();
//     //     }
//     //   };
  
//     //   window.addEventListener('click', handleClickOutside);
  
//     //   onCleanup(() => {
//     //     window.removeEventListener('click', handleClickOutside);
//     //   });
//     // });
      
//   return (
//     <div class="absolute z-10 right-0">
//     {/* <div class="fixed"> */}
//     <div class="meal-plan-page">
//       <div class="plan-mark-open">
//         <svg onClick={props.onClose} style={{cursor:"pointer"}} xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 20 20">
//             <g transform="rotate(90 12 12)">
//             <path fill="#4f48ed" d="M19 3H5v18l7-3l7 3z"/>
//             </g>
//         </svg>
//       </div>
//         <div class="mealplan-ct">
//             <div class="meal-plan-1">
//                 <div>

//                 <h1>Rencana Masak</h1>
//                 <p>Rencanakan dan temukan masakan anda sesuai dengan agenda.</p>
//                 </div>
//                 <div class="meal-dropdown">
//                 <select
//                 name="months"
//                 id="months"
//                 value={selectedMonth()}
//                 onChange={handleMonthChange}
//                 >
//                 <option value="Jan">Januari</option>
//                 <option value="Feb">Februari</option>
//                 <option value="Mar">Maret</option>
//                 <option value="Apr">April</option>
//                 <option value="May">Mei</option>
//                 <option value="Jun">Juni</option>
//                 <option value="Jul">Juli</option>
//                 <option value="Aug">Agustus</option>
//                 <option value="Sep">September</option>
//                 <option value="Oct">Oktober</option>
//                 <option value="Nov">November</option>
//                 <option value="Dec">Desember</option>
//                 </select>
//                 </div>
//             </div>
//             <div class="calendar-container1">
//                 <button onClick={handlePrevClick}>
//                     <Icon icon="ic:round-navigate-next" width="40" rotate={2} />
//                 </button>
//                 {Array.from({ length: itemsPerPage() }, (_, index) => {
//                   const dayIndex = currentIndex() + index;
//                   return dayIndex < Number(daysInMonth()) ? (
//                     <div class="plan-calendar">
//                       {dayIndex + 1}
//                       <br />
//                       {selectedMonth()}
//                     </div>
//                   ) : null;
//                 })}



//                 <button onClick={handleNextClick}>
//                     <Icon width="40" icon="ic:round-navigate-next" />
//                 </button>
//             </div>
//             {/* <div>

//             </div> */}
//             <div>
//                 <h2>Rencana Masak Hari Ini</h2>
//                 <div class="meal-reminder">
//                     <h3>Pengingat</h3>
//                     <div class="meal-card-ctn">
//                       <div class="meal-reminder-card">
//                         <div style={{width:"6px", height:"100px", "background-color":"#ED4848"}}></div>
//                         <div class="mx-6">
//                         <b>09:00</b> <p>2 Nov</p> 
//                         </div>
//                         <img src="" alt="" />
//                         <div>
//                           <h2>Cah Brokoli</h2>
//                           <h4>Huang Renjun</h4>
//                           <h5>6 Ulasan</h5>
//                         </div>
//                         <div style={{"margin-bottom":"auto",left:"40px"}}>
//                           <Icon icon="pepicons-pencil:dots-y" width="30" />                        </div>
//                         </div>

//                       {/* <div class="meal-card-expand">
//                           <div class="btn-done-cancel">
//                             <Icon icon="mi:close" width="26" />Lewati
//                           </div>
//                           <div class="btn-done-cancel">
//                           <Icon icon="ph:check-bold" width="25"/>Selesai
//                           </div>
//                       </div> */}
                
//                     </div>

//                     <h3>Akan Datang</h3>
//                     <div class="meal-card-ctn">
//                       <div class="meal-reminder-card">
//                         <div style={{width:"6px", height:"100px", "background-color":"#FFBE1A"}}></div>
//                         <div class="mx-6">
//                           <b>09:00</b> <p>2 Nov</p> 
//                         </div>
//                         <img src="" alt="" />
//                         <div>
//                           <h2>Cah Brokoli</h2>
//                           <h4>Huang Renjun</h4>
//                           <h5>6 Ulasan</h5>
//                         </div>
//                         <div>
//                       </div>
//                       <div style={{"margin-bottom":"auto",left:"40px"}}>
//                           <Icon icon="pepicons-pencil:dots-y" width="30" />                        </div>
//                         </div>

//                       {/* <div class="meal-card-expand">
//                       </div> */}
                    
//                     </div>
//                 </div>
//             </div>
//         </div>
//         <div class="btn-add-meal">
//           <button><Icon icon="octicon:plus-16" width="30" /></button>
//         </div>
//     </div>
//     </div>
//     // </div>
//   );
// };

// export default RencanaMasak;
