import {useState, useEffect} from "react";
import axios from "axios";

function Search () {
    const [query, setQuery] = useState('');
    const APIkey = '26595214-ee6d6c6b1001d7bda5beda667' // à modifier slon l'utilisateur
    const [pageNumber, setPageNumber] = useState(1);
    const [numberOfResults, setNumberOfResults] = useState(0) //numberOfResults donne le nombre d'images retounées par la requête
    const [results, setResults] = useState([]); //results correspond aux valeurs hits du json retourné par la requête

    function handleChange(event) {
        setQuery(event.target.value)
    };

    async function handleSubmit() {
        const url = 'https://pixabay.com/api/?key=' + APIkey + '&q=' + query + '&page=1';
        await axios.get(url)
        .then((response) => {setResults(response.data.hits); setNumberOfResults(response.data.totalHits)});
    };

    async function goToPreviousPage() {
        // cette fonction permet d'accéder, si elle existe, à la page de résultats précédente
        // on vérifie si le numéro de la page désirée existe bien
        if (pageNumber > 1) {
            setPageNumber(pageNumber - 1)
        }
        else {};
        const url = 'https://pixabay.com/api/?key=' + APIkey + '&q=' + query + '&page=' + pageNumber.toString();
        await axios.get(url)
        .then((response) => setResults(response.data.hits));
    } 

    async function goToFollowingPage() {
        // cette fonction permet d'accéder, si elle existe, à la page de résultats suivante
        // on vérifie si le numéro de la page désirée existe bien
        const totalOfPages = ~~(numberOfResults/20);
        if (pageNumber + 1 <= totalOfPages) {
            setPageNumber(pageNumber + 1)
        }
        else {};
        const url = 'https://pixabay.com/api/?key=' + APIkey + '&q=' + query + '&page=' + pageNumber.toString();
        await axios.get(url)
        .then((response) => setResults(response.data.hits));
    } 

    useEffect(() => {handleSubmit(); setPageNumber(1)}, [query]);
    // la requête est envoyée dès lors que le texte de l'input est modifié, le numéro de la page est alors remis à 1

    return (
        <div>
            <input
                type="text" 
                placeholder="Search..."
                onChange={handleChange}/>
            <div className="pt-2 pb-2 bg-slate-0">
                <button className='pr-4' 
                        onClick={goToPreviousPage}> 
                    Previous page
                </button> 
                <button onClick={goToFollowingPage}>
                    Following page
                </button>  
            </div>
            <div className="columns-3">
                {results.map((photo) => 
                    <img src={photo.webformatURL}/>)}
            </div>     
        </div>
    );
}

export default Search;