export default class Video {
    node : HTMLElement
    url : string
    domain : string
    slug : string
    page : string


    constructor(node : HTMLElement, page : string) {
        console.log(node);
        this.node = node;
        this.page = page;

        this.getURL();
        this.getUrlDomain();
        this.getUrlSlug();
        this.createVideoDiv();
    }

    private getURL() {
        if (this.node.dataset.url) {
            this.url = this.node.dataset.url;
        } else {
            console.error("No URL")
            return;
        }
    }

    private getUrlDomain() {
        const domains = [
            "youtube.com",
            "vimeo.com"
        ]

        this.domain = domains.find(d => {
            return this.url.includes(d);
        })
    }

    private getUrlSlug() {
        if (this.node.dataset.slug) {
            this.slug = this.node.dataset.slug
        } else {
            console.error("No Slug")
        }
    }

    private formatVideoURL() {
        switch (this.domain) {
            case "youtube.com":
                let youtubeSplit = this.url.split("?v=");
                let youtubeVideoID = youtubeSplit[youtubeSplit.length-1];
                return "https://youtube.com/embed/" + youtubeVideoID;
            case "vimeo.com":
                let urlSplit = this.url.split("/");
                let videoID = "";
                for (let i = urlSplit.length-1; i >= 0; i--) {
                    const element = urlSplit[i];
                    if (element) {
                        videoID = element;
                        break;
                    }
                }
                return "https://player.vimeo.com/video/" + videoID;
            default:
                throw new Error("What");
        }
    }

    private getIFrame() {
        let url = this.formatVideoURL()
        switch (this.domain) {
            case "youtube.com":
                return (
                    `<iframe 
                        src=${url}
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen>
                    </iframe>`
                )
            case "vimeo.com":
                return (
                    `<iframe 
                        src=${url}
                        frameBorder="0" 
                        allow="autoplay; fullscreen; picture-in-picture" 
                        allowFullScreen>
                    </iframe>`
                )
            default:
                console.error("Unknown video type");
        }
    }

    private createVideoDiv() {
        const iframe = this.getIFrame();
        let iframeWrapper = document.createElement("div");
        iframeWrapper.classList.value = "c-talk__video-wrapper";
        iframeWrapper.innerHTML = iframe;

        this.node.classList.value = "c-talk__video";
        this.node.style.display = "block";

        
        this.node.appendChild(iframeWrapper);
        let params = new URLSearchParams(window.location.search);
        if (!params.has("v")) {
            let link = document.createElement("a");
            link.classList.value = "c-talk__video-link";
    
            let linkSlug = `${this.page}?v=${this.slug}`;
            link.href = linkSlug;
            this.node.appendChild(link);
        }

    }
}