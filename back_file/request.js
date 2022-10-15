function getrequest(url, data) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: data,

            header: {
                'content-Type': 'application/json'
            },
            success: (res) => {
                resolve(res)
            },
            faill: (res) => {
                reject(res)
            }
        })
    })
}

function postrequest(url, data) {
    return new Promise(function(resolve, reject) {
        wx.request({
            url: url,
            data: data,
            method: "POST",

            success: function(res) {
                resolve(res)
            },
            faill(res) {
                reject(res)
            }
        })
    })
}


function timeDifference(tmpTime) {
    var mm = 1000;
    var minute = mm * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var month = day * 30;
    var ansTimeDifference = 0;
    var tmpTimeStamp = tmpTime ? Date.parse(tmpTime.replace(/-/gi, "/")) : new Date().getTime();
    var nowTime = new Date().getTime();
    var tmpTimeDifference = nowTime - tmpTimeStamp;
    var DifferebceMonth = tmpTimeDifference / month;
    var DifferebceWeek = tmpTimeDifference / (7 * day);
    var DifferebceDay = tmpTimeDifference / day;
    var DifferebceHour = tmpTimeDifference / hour;
    var DifferebceMinute = tmpTimeDifference / minute;
    if (DifferebceMonth >= 1) {
        return tmpTime;
    } else if (DifferebceWeek >= 1) {
        ansTimeDifference = parseInt(DifferebceWeek) + "个星期前";
    } else if (DifferebceDay >= 1) {
        ansTimeDifference = parseInt(DifferebceDay) + "天前";
    } else if (DifferebceHour >= 1) {
        ansTimeDifference = parseInt(DifferebceHour) + "个小时前";
    } else if (DifferebceMinute >= 1) {
        ansTimeDifference = parseInt(DifferebceMinute) + "分钟前";
    } else {
        ansTimeDifference = "刚刚";
    }
    return ansTimeDifference;
}
module.exports = {
    getrequest: getrequest,
    postrequest: postrequest,
    time: timeDifference
}