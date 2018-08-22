const express = require('express')
const line = require('@line/bot-sdk')
const config = require('./config/config')
const client = new line.Client(config.lineConfig)
const app = express()

app.post('/webhook', line.middleware(config.lineConfig), (req, res) => {
    console.log('req.body = ', req.body)
    Promise.all(req.body.events.map(handleEvent)).then((result) => res.json(result))
})

app.get('/', (req, res) => {
    res.send('hello Welcome Line Bot')
})

const handleEvent = (event) => {
    console.log(event)
    if (event.type === 'message' && event.message.type === 'text') {
        let replyToken = event.replyToken
        let text = event.message.text
        console.log('event = ', event)
        console.log('replyToken = ', replyToken)
        console.log('text = ', text)
        handleMessageEvent(replyToken, text)
    } else if (event.type === 'postback') {
        let text = `test send text ${event.postback.data}`
        sendTextMessage(event.replyToken, text)
    } else {
        return Promise.resolve(null)
    }
}

const handleMessageEvent = (replyToken, eventText) => {
    if (eventText === 'image' || eventText === 'รูปภาพ') {
        let originalContentUrl = 'https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100'
        let previewImageUrl = 'https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100'
        sendImageMessage(replyToken, originalContentUrl, previewImageUrl)
    } else if (eventText === 'video' || eventText === 'วิดีโอ') {
        let originalContentUrl = 'https://www.youtube.com/watch?v=Iz9vwVl816E'
        let previewImageUrl = 'https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100'
        sendVideoMessage(replyToken, originalContentUrl, previewImageUrl)
    } else if (eventText === 'location' || eventText === 'ที่อยู่') {
        let title = 'ที่อยู่'
        let address = '588/23 ซอย ประชาสงเคราะห์ 4 แขวง ดินแดง เขต ดินแดง กรุงเทพมหานคร 10400'
        let latitude = 13.7660357
        let longitude = 100.5562272
        sendLocationMessage(replyToken, title, address, latitude, longitude)
    } else if (eventText === 'button' || eventText === 'ปุ่ม') {
        let altText = 'this is a buttons template'
        let thumbnailImageUrl = 'https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100'
        let title = 'รายการ'
        let text = 'กรุณาเลือกรายการ'
        sendButtonMessage(replyToken, altText, thumbnailImageUrl, title, text)
    } else if (eventText === 'confirm' || eventText === 'ตกลง') {
        let altText = 'this is a confirm template'
        let text = 'ยืนยันการทำรายการ ?'
        sendConfirmMessage(replyToken, altText, text)
    } else if (eventText === 'carousel' || eventText === 'สไลด์') {
        let altText = 'this is a carousel template'
        sendCarouselMessage(replyToken, altText)
    } else {
        let text = `test send text ${eventText}`
        sendTextMessage(replyToken, text)
    }
}

const sendTextMessage = (replyToken, text) => {
    let msg = {
        type: 'text',
        text: text
    }
    return client.replyMessage(replyToken, msg)
}

const sendImageMessage = (replyToken, originalContentUrl, previewImageUrl) => {
    let msg = {
        type: 'image',
        originalContentUrl: originalContentUrl,
        previewImageUrl: previewImageUrl
    }
    return client.replyMessage(replyToken, msg)
}

const sendVideoMessage = (replyToken, originalContentUrl, previewImageUrl) => {
    let msg = {
        type: 'video',
        originalContentUrl: originalContentUrl,
        previewImageUrl: previewImageUrl
    }
    return client.replyMessage(replyToken, msg)
}

const sendLocationMessage = (replyToken, title, address, latitude, longitude) => {
    let msg = {
        type: 'location',
        title: title,
        address: address,
        latitude: latitude,
        longitude: longitude
    }
    return client.replyMessage(replyToken, msg)
}

const sendButtonMessage = (replyToken, altText, thumbnailImageUrl, title, text) => {
    let msg = {
        type: 'template',
        altText: 'altText',
        template: {
            type: 'buttons',
            thumbnailImageUrl: 'https://www.thesun.co.uk/wp-content/uploads/2017/03/fifa-17-2.jpg?strip=all&w=742&quality=100',
            title: 'title',
            text: 'text',
            actions: [{
                type: 'postback',
                label: 'ซื้อ',
                data: 'action=buy&itemid=123'
            }, {
                type: 'postback',
                label: 'เพิ่มเข้าสู่ตะกร้า',
                data: 'action=add&itemid=123'
            }, {
                type: 'uri',
                label: 'รายละเอียด',
                uri: 'http://www.businesssoft.com/blog/?p=2593'
            }]
        }
    }
    return client.replyMessage(replyToken, msg)
}

const sendConfirmMessage = (replyToken, altText, text) => {
    let msg = {
        type: 'template',
        altText: altText,
        template: {
            type: 'confirm',
            text: text,
            actions: [{
                type: 'message',
                label: 'ยืนยัน',
                text: 'yes'
            }, {
                type: 'message',
                label: 'ยกเลิก',
                text: 'no'
            }]
        }
    }
    return client.replyMessage(replyToken, msg)
}

const sendCarouselMessage = (replyToken, altText) => {
    let msg = {
        type: 'template',
        altText: altText,
        template: {
            type: 'carousel',
            columns: [{
                thumbnailImageUrl: 'https://dp1ole7q4wdk0.cloudfront.net/stories/794/518939_large.png',
                title: 'this is menu',
                text: 'description',
                actions: [{
                    type: 'postback',
                    label: 'ซื้อ',
                    data: 'action=buy&itemid=111'
                }, {
                    type: 'postback',
                    label: 'เพิ่มเข้าตะกร้า',
                    data: 'action=add&itemid=111'
                }, {
                    type: 'uri',
                    label: 'รายละเอียด',
                    uri: 'http://example.com/page/111'
                }]
            }, {
                thumbnailImageUrl: 'https://dp1ole7q4wdk0.cloudfront.net/stories/794/518939_large.png',
                title: 'this is menu',
                text: 'description',
                actions: [{
                    type: 'postback',
                    label: 'ซื้อ',
                    data: 'action=buy&itemid=222'
                }, {
                    type: 'postback',
                    label: 'เพิ่มเข้าตะกร้า',
                    data: 'action=add&itemid=222'
                }, {
                    type: 'uri',
                    label: 'รายละเอียด',
                    uri: 'http://example.com/page/222'
                }]
            }]
        }
    }
    return client.replyMessage(replyToken, msg)
}


app.set('port', process.env.PORT || config.PORT)

app.listen(app.get('port'), () => {
    console.log(`app running on port ${app.get('port')}`)
})