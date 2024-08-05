const fetchdata=async searchTerm=>{
    const response=await axios.get('http://www.omdbapi.com/?',{
        params:{
            apikey:'fe36c3bd',
            s: searchTerm
        }
    });
    if(response.data.Error)
    {
        return [];  
    }
    return response.data.Search;
};
const root=document.querySelector('.autocomplete');
root.innerHTML=`
<label><b>Search For a Movie</b></label>
<input class="input"/>
<div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>
    </div>
</div>
`
const input=document.querySelector('input');
const dropdown=document.querySelector('.dropdown');
const resultsWrapper=document.querySelector('.results')
const debounce= (func, delay=1000)=>{
    let timeoutid;
    return (...args)=>{
        if(timeoutid){
            clearTimeout(timeoutid);
        }
        timeoutid=setTimeout(()=>{
            func.apply(null,args);
        },delay);
    };  
};
const onInput= async event =>{
   
   const movies= await fetchdata(event.target.value);
   if(!movies.length)
   {
    dropdown.classList.remove('is-active');
    return;
   }
   resultsWrapper.innerHTML='';
   dropdown.classList.add('is-active');
   for(let movie of movies)
   {
       const option= document.createElement('a');
       option.classList.add('dropdown-item')
       const imgsrc=movie.Poster==='N/A'?'':movie.Poster;
       option.innerHTML=`
       <img src="${imgsrc}"/>
        ${movie.Title}
    `;
    option.addEventListener('click',()=>{
        dropdown.classList.remove('is-active');
        input.value=movie.Title;
        onMovieSelect(movie);
    })
    resultsWrapper.appendChild(option)
   }
};
input.addEventListener('input',debounce(onInput,500));
document.addEventListener('click',(event)=>{
    if(!root.contains(event.target))
    {
        dropdown.classList.remove('is-active');
    }
})

const onMovieSelect=async movie=>{
    const response=await axios.get('http://www.omdbapi.com/?',{
        params:{
            apikey:'fe36c3bd',
            i: movie.imdbID
        }
    });
    document.querySelector('#summary').innerHTML=movieTemplate(response.data);
}
const movieTemplate=movieDetail=>{
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}"/>
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.BoxOffice}</p>
        <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Meta score</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB Votes</p>
    </article>

    `;
}