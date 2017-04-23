[{
    id: "ashdgasdlasd",
    name: "Matt",
    room: "Node"
}]


class Users {
    constructor() {
        this.users = []
    }
    addUser(id, name, room) {
        let user = { id, name, room };
        this.users.push(user);
        return user
    }
    removeUser(id) {
        let user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }
    getUser(id) {
        return this.users.filter((user) => user.id === id)[0]
    }
    getUserList(room) {
        let users = this.users.filter((user) => {
            return user.room === room
        });
        let namesArray = users.map((user) => {
            return user.name
        });
        return namesArray;
    }
}

module.exports = { Users }

// class Person {
//     constructor(name, age) {
//         this.name = name;
//         this.age = age
//     }
//     getUserDescription() {
//         return `${this.name} is ${this.age} years old!`
//     }
// }

// var me = new Person("Matt", 25)
// var description = me.getUserDescription();
// console.log(description);