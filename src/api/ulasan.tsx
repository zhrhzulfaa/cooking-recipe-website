export type resultulasan = {
    "id_ulasan": number,
    "username": string,
    "deskripsi_ulasan": string,
    "id_resep": number
}

export async function DataUlasan (query: string) {
    if (query.trim() === "") return [];
    // /?q=${encodeURI(query)}
    
             
    const response = await fetch(
      `/api/ulasan/`
    );
    // http://localhost:8001
    
    const results = await response.json();
    console.log("response ", results)
    const documents = results as resultulasan[];

    return documents.slice(0, documents.length).map(({ id_resep,username,deskripsi_ulasan,id_ulasan    }) => ({
        id_resep,username,deskripsi_ulasan,id_ulasan  
      }));
}