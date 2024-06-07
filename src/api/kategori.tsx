export type resultkategori = {
    "id_kategori": number,
    "nama_kategori": string
}

export async function DataKategori (query: string) {
    if (query.trim() === "") return [];
    // /?q=${encodeURI(query)}
    
             
    const response = await fetch(
      `/api/kategori/`
    );
    // http://localhost:8001
    
    const results = await response.json();
    console.log("response ", results)
    const documents = results as resultkategori[];

    return documents.slice(0, documents.length).map(({ id_kategori, nama_kategori   }) => ({
        id_kategori, nama_kategori  
      }));
}