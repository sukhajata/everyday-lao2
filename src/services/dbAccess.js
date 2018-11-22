import low from 'lowdb';
import LocalStorage from 'lowdb/adapters/LocalStorage';
import data from './db';

const adapter = new LocalStorage('db');

const db = low(adapter);
const dbName = 'phrases';

export function dbSetup() {
    if (db.get(dbName).isEmpty().value()) {
        db.defaults({phrases: []})
            .write();
        loadData();
        //console.log(db.get('phrases').value());
        console.log('data loaded');
    } 
}

function loadData() {
    const newArray = db.get(dbName).concat(data).value();
    db.set(dbName, newArray).write();
    /*(try {
        const response  = await fetch("db.json");
        if (response.ok) {
            const json = await response.json();
            const newArray = db.get(dbName).concat(json).value();
            db.set(dbName, newArray).write();
          
        } else {
            throw Error(response.statusText);
        }
    } catch(error) {
            console.log(error);
            
        return null;
    }*/
}

export function getSubCategory(sid) {
    //console.log("reading from local storage");
    return db.get(dbName)
            .filter({ subCategoryId: sid })
            .value();
}

export function searchDb(txt) {
    const reg = new RegExp('(\\b)' + txt.toLowerCase() + '(\\b)', 'g');
    return db.get('phrases')
            .filter(function(item) { 
                return item.firstLanguage.toLowerCase().match(reg); 
            })
            .value();
}

export function getFavourites(ids) {
    let favourites = [];
    ids.forEach(element => {
        const phrase = db.get(dbName)
                        .find({ pid: element.toString() })
                        .value();
        favourites.push(phrase);
    });

    return favourites;
}