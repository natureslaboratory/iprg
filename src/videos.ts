import Video from './classes/Video';

let videos = Array.from(document.getElementsByClassName("c-talk__URL") as HTMLCollectionOf<HTMLElement>);
videos.forEach(v => {
    let page = window.location.hostname;
    console.log(page);

    new Video(v, "/videos");
})


