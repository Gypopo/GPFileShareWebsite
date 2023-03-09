module.exports = class Tags {
    constructor(s) {
        this.tags = Array.from(s.split(' '))
                .map(i => i.split(',')).map(i => i.toString()
                .replace('#', '').replace(',', '').replace(' ', ''));
        this.tags.forEach(element => {
            console.log(element);
        });
    }

    contains(tag) {
        return this.tags.has(tag);
    }
}