const socket = io()


//Elements 
$sendMessageForm = document.querySelector("#message-form")
$messageInput = document.querySelector("input")
$messageFormButton = document.querySelector("button")
$sendLocationButton = document.querySelector("#send-location")
$messages = document.querySelector("#messages")



// Templates
const messageTemplate = document.querySelector("#message-template").innerHTML
const locationMessageTemplate = document.querySelector("#location-message-template").innerHTML


//OPTIONS
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })



const autoScroll = () => {
    // new message element
    const $newMessage = $messages.lastElementChild
    //Height of the new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    //Height of messages container
    const containerHeight = $messages.scrollHeight

    //How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }

}

socket.on(('message'), (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoScroll()
})

socket.on(('locationMessage'), (url) => {
    console.log(url)
    const html = Mustache.render(locationMessageTemplate, {
        username: url.username,
        url: url.url,
        createdAt: moment(url.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend", html)
    autoScroll()
})



$sendMessageForm.addEventListener("submit", (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value



    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageInput.value = ''
        $messageInput.focus()

        if (error) {
            return console.log(error)
        }
        console.log("Message Delivered")
    })


})



$sendLocationButton.addEventListener("click", (e) => {
    e.preventDefault()

    if (!navigator.geolocation) {
        return alert("GeoLocation is not supported by the browser")
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {

        console.log(position)

        socket.emit("sendLocation", {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log("location shared")
        })
    })
})

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})

// document.querySelector("#increment").addEventListener('click', () => {
//     console.log("button clicked")
//     socket.emit('increment')
// })