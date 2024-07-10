export class CachedImages {

    cached;

    constructor(api, layout) {
        this.loadAsync(api, layout);
    }

    async loadAsync(api, id) {
        this.cached = await api.getLayoutScreenshots(id);

        this.onload(this.cached);
    }
}