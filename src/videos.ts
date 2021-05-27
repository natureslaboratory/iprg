import Video from './classes/Video';

let videos = Array.from(document.getElementsByClassName("c-talk__URL") as HTMLCollectionOf<HTMLElement>);
videos.forEach(v => {
    new Video(v, "/videos-test");
})


