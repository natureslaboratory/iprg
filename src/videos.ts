import Video from './classes/Video';

let videos = Array.from(document.getElementsByClassName("c-talk__URL") as HTMLCollectionOf<HTMLElement>);
videos.forEach(v => {
    let relativePath = window.location.pathname;
    if (relativePath.includes("index.php")) {
        relativePath = relativePath.split("index.php")[0];
    }

    new Video(v, relativePath);
})


