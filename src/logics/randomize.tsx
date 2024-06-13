const key = ():string => {
    const keys:string = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key:string;
    let randomize:string[] = [];
    while (randomize.length < keys.length) {
        const random:string = keys.charAt(Math.abs(Math.round(Math.random() * (keys.length - 1))));
        randomize.push(random);
        randomize = [...new Set(randomize)];
    }
    key = randomize.join('');
    return key;
}

const randomize = ():string => {
    const keys:string = key();
    let randomize:string = '';
    while (randomize.length < 10) {
        const random:string = keys.charAt(Math.abs(Math.round(Math.random() * (keys.length - 1))));
        randomize += random;
    }
    return randomize;
}

const unique = (database:any[]):string => {
    let unique:string;
    while (true) {
        let random:string = randomize();
        if (database.filter(account => account.id === random).length === 0) {
            unique = random;
            break;
        }
    }
    return unique;
}

export default unique