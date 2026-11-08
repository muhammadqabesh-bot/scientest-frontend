const BASE_URL = "http://localhost:3001";

export async function fetchStudents() {
    const res = await fetch(`${BASE_URL}/students`) ;

    if(!res.ok) throw new Error("فشل جلب البيامات") ;
    return res.json() ;
}