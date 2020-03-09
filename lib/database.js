const Database = require('better-sqlite3');
//const crypto = require('crypto');
const argon2 = require('argon2');
const config = require('../config.json');

module.exports = class Model {
    constructor()
    {
        this.db = new Database(config.data+'/data.db');
    }

    async auth(name, passwd)
    {
        const stmt = this.db.prepare('SELECT * FROM users WHERE name = ?');
        var usr = stmt.get(name);
        if(!usr) return false;
        let verify = await argon2.verify(usr.password, passwd);
        if(verify) return usr;
        return false;
    }

    createUser(user)
    {
        const stmt = this.db.prepare('SELECT * FROM users WHERE name = @name');
        var usr = stmt.get(user);
        if(usr) return false;
        const stmt2 = this.db.prepare('INSERT INTO users (name, password, email) VALUES (@name, @password, @email)');
        const info = stmt2.run(user);
        if(info.changes > 0)
        {
            return this.getUser(info.lastInsertRowid);
        }
        return false;
    }

    getUser(id)
    {
        const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
        var usr = stmt.get(id);
        return usr;
    }

    checkName(name)
    {
        const stmt = this.db.prepare('SELECT * FROM users WHERE name = ?');
        var usr = stmt.get(name);
        return !!usr;
    }

    checkEmail(email)
    {
        const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
        var usr = stmt.get(email);
        return !!usr;
    }
}