import {Tag} from './Tag.js';

export class Tags {
    constructor(tags) {
        var strings = tags.split(' ');
        strings = strings.push(tags.split(','));
        this.french = strings;
        strings.array.forEach(element => {
            console.log(element);
        });

        var tags = [];
        for (let i = 0; i < strings.length; i++) { 
            console.log(strings[i]);
            tags.push(new Tag(strings[i]));
        }
    }

    contains(tag) {
        return this.french.contains(tag);
    }
}