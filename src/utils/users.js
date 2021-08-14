const users = []


const add = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if (!username || !room) {
        return {
            error: "username and room are required"
        }
    }
    //check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    if (existingUser) {
        return {
            error: "userName is in Use!"
        }
    }
    const user = { id, username, room }
    users.push(user)
    console.log(user)
    return { user }

}

add({
    id: 12,
    username: "saif",
    room: "iraq"
})


const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        console.log(users.splice(index, 1)[0])
        return users.splice(index, 1)[0]
    }

}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}


module.exports = {
    add,
    removeUser,
    getUser,
    getUsersInRoom
}