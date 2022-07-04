import moment from "moment-timezone";
import _ from "lodash";



class timeManagement {

    mTime = null;
    mCheckTime = null;
    mStartTime = null;
    mEndTime = null;

    TIME_FORMATTER(timeString) {
        let t = timeString.split(":");
        this.hour = parseInt(t[0]);
        this.minutes = parseInt(t[1]);
        this.seconds = parseInt(t[2]);
        this.isBiggerThan = function (other) {
            return ((this.hour > other.hour) || (this.hour === other.hour)) &&
                ((this.minutes > other.minutes) || (this.minutes = other.minutes)) &&
                (this.seconds > other.seconds);
        };


    };

    TIME_IS_BETWEEN(check, start, end) {
        return (start.hour <= end.hour) ? check.isBiggerThan(start) && !check.isBiggerThan(end)
            : (check.isBiggerThan(start) && check.isBiggerThan(end)) || (!check.isBiggerThan(start) && !check.isBiggerThan(end));
    }
    /**
     *
     * @param { Object } config
     * @param { String } config.locale
     * @param { String } config.timezone
     *
     */
    constructor(config) {
        this.config = _.merge({
            locale : "id",
            timezone : "Asia/Makassar"
        }, config);
        moment.locale(this.config.locale);
        moment().tz(this.config.timezone);
    }

    /**
     *
     * @param {String | Number} startTime - start time to diff
     * require format DD-MM-YYYY HH:mm:ss
     * @param {String | number } endTime - end time to diff
     * require format DD-MM-YYYY HH:mm:ss
     * @example
     * let time = new Functions.TimeManagement();
     * time.getDifferentTime("01-04-2022","02-4-2022");
     * @returns {Promise<{
     * status : Boolean,
     * code : Number,
     * msg : String,
     * data : {
     *     duration_instance : Moment.Duration,
     *     unix : {
     *         start_time : Moment.unix,
     *         end_time : Moment.unix,
     *         duration_time : Moment.unix
     *     },
     *     diff : {
     *         time_years : number,
     *         time_month : number,
     *         time_week : number,
     *         time_days : number,
     *         time_hours : number,
     *         time_minutes : number,
     *         time_seconds : number,
     *         time_milliseconds : number
     *     },
     *     humanize : {
     *         start_time : String,
     *         end_time : String,
     *     },
     *     duration_humanize : String
     * }
     * }>}
     */
    getDifferentTime = async (startTime, endTime) =>  await new Promise(async (resolve, rejected) => {
        switch (typeof startTime && typeof endTime){
            case "string" :
                this.mStartTime = await moment(startTime,"DD-MM-YYYY HH:mm:ss");
                this.mEndTime = await moment(endTime, "DD-MM-YYYY HH:mm:ss");
                if (this.mStartTime.isValid()){
                    if (this.mEndTime.isValid()){
                        if ((this.mEndTime.unix() - this.mStartTime.unix()) > 0){
                            let timeAgo = await moment.duration(this.mEndTime.diff(this.mStartTime));
                            let reformatTime = await (timeAgo.months() !== 0) ? `${Math.floor(timeAgo.months())} Bulan, ${Math.floor(timeAgo.weeks())} Minggu, ${Math.floor(timeAgo.days())} hari, - ${Math.floor(timeAgo.hours())} Jam, ${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                (timeAgo.weeks() !== 0) ? `${Math.floor(timeAgo.weeks())} Minggu, ${Math.floor(timeAgo.days())} hari, ${Math.floor(timeAgo.hours())} Jam, ${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                    (timeAgo.days() !== 0) ? `${Math.floor(timeAgo.days())} hari, ${Math.floor(timeAgo.hours())} Jam, ${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                        (timeAgo.hours() !== 0) ? `${Math.floor(timeAgo.hours())} Jam, ${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                            (timeAgo.minutes() !== 0) ? `${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                                (timeAgo.seconds() !== 0) ? `${Math.floor(timeAgo.seconds())} Detik` :
                                                    (timeAgo.milliseconds() !== 0) ? `${Math.floor(timeAgo.milliseconds())} Milidetik` : `Tidak Ada Selisih`;
                            await resolve({
                                status : true,
                                code : 200,
                                msg : `Successfully get Different Time`,
                                data : {
                                    duration_instance : timeAgo,
                                    unix : {
                                        start_time : this.mStartTime.unix(),
                                        end_time : this.mEndTime.unix(),
                                        duration_time : (this.mEndTime.unix() - this.mStartTime.unix())
                                    },
                                    diff : {
                                        time_years : timeAgo.asYears(),
                                        time_month : timeAgo.asMonths(),
                                        time_week : timeAgo.asWeeks(),
                                        time_days : timeAgo.asDays(),
                                        time_hours : timeAgo.asHours(),
                                        time_minutes : timeAgo.asMinutes(),
                                        time_seconds : timeAgo.asSeconds(),
                                        time_milliseconds : timeAgo.asMilliseconds()
                                    },
                                    humanize : {
                                        start_time: this.mStartTime.format("DD-MM-YYYY HH:mm:ss"),
                                        end_time : this.mEndTime.format("DD-MM-YYYY HH:mm:ss")
                                    },
                                    duration_humanize : reformatTime
                                }
                            });
                        }else{
                            await rejected({ status : false, code : 500, msg : `The final value must be greater than the initial value`});
                        }
                    }else{
                        await rejected({ status : false, code : 500, msg : `Time End Not Valid`});
                    }
                }else{
                    await rejected({ status : false, code : 500, msg : `Time Start Not Valid`});
                }
                break;
            case "number" :
                this.mStartTime = await moment.unix(startTime);
                this.mEndTime = await moment.unix(endTime);
                if (this.mStartTime.isValid()){
                    if (this.mEndTime.isValid()){
                        if ((this.mEndTime.unix() - this.mStartTime.unix()) > 0){
                            let timeAgo = await moment.duration(this.mEndTime.diff(this.mStartTime));
                            let reformatTime = await (timeAgo.months() !== 0) ? `${Math.floor(timeAgo.months())} Bulan, ${Math.floor(timeAgo.weeks())} Minggu, ${Math.floor(timeAgo.days())} hari, - ${Math.floor(timeAgo.hours())} Jam, ${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                (timeAgo.weeks() !== 0) ? `${Math.floor(timeAgo.weeks())} Minggu, ${Math.floor(timeAgo.days())} hari, ${Math.floor(timeAgo.hours())} Jam, ${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                    (timeAgo.days() !== 0) ? `${Math.floor(timeAgo.days())} hari, ${Math.floor(timeAgo.hours())} Jam, ${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                        (timeAgo.hours() !== 0) ? `${Math.floor(timeAgo.hours())} Jam, ${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                            (timeAgo.minutes() !== 0) ? `${Math.floor(timeAgo.minutes())} Menit, ${Math.floor(timeAgo.seconds())} Detik` :
                                                (timeAgo.seconds() !== 0) ? `${Math.floor(timeAgo.seconds())} Detik, ${Math.floor(timeAgo.milliseconds())}` :
                                                    (timeAgo.milliseconds() !== 0) ? `${Math.floor(timeAgo.milliseconds())} Milidetik` : `Tidak Ada Selisih`;
                            await resolve({
                                status : true,
                                code : 200,
                                msg : `Successfully get Different Time`,
                                data : {
                                    duration_instance : timeAgo,
                                    unix : {
                                        start_time : this.mStartTime.unix(),
                                        end_time :  this.mEndTime.unix(),
                                        duration_time : (this.mEndTime.unix() - this.mStartTime.unix())
                                    },
                                    diff : {
                                        time_years : timeAgo.asYears(),
                                        time_month : timeAgo.asMonths(),
                                        time_week : timeAgo.asWeeks(),
                                        time_days : timeAgo.asDays(),
                                        time_hours : timeAgo.asHours(),
                                        time_minutes : timeAgo.asMinutes(),
                                        time_seconds : timeAgo.asSeconds(),
                                        time_milliseconds : timeAgo.asMilliseconds()
                                    },
                                    humanize : {
                                        start_time: this.mStartTime.format("DD-MM-YYYY HH:mm:ss"),
                                        end_time : this.mEndTime.format("DD-MM-YYYY HH:mm:ss")
                                    },
                                    duration_humanize : reformatTime
                                }
                            });
                        }else{
                            await rejected({ status : false, code : 500, msg : `The final value must be greater than the initial value`});
                        }

                    }else{
                        await rejected({ status : false, code : 500, msg : `Time End Not Valid`});
                    }
                }else{
                    await rejected({ status : false, code : 500, msg : `Time Start Not Valid`});
                }
                break;
            default :
                await rejected({ status : false, code : 500, msg : `Illegal Format startTime or EndTime`});
                break;
        }
    });
    /**
     *
     * @param { Number } checkTime
     * @param { Number} startTime
     * @param { Number} endTime
     * @return {Promise<any>}
     */
    getTimeBetween = async (checkTime, startTime, endTime) => new Promise(async (resolve, rejected) => {
        this.mCheckTime = await moment.unix(checkTime);
        this.mStartTime = await moment.unix(startTime);
        this.mEndTime = await moment.unix(endTime);
        if (this.mCheckTime.isValid()) {
            if (this.mStartTime.isValid()) {
                if (this.mEndTime.isValid()) {
                    if ((this.mEndTime.unix() - this.mStartTime.unix()) > 0) {
                        if (this.mCheckTime >= this.mStartTime && this.mCheckTime <= this.mEndTime){
                            resolve({
                                status : true,
                                code : 200,
                                msg : `success, check time is Between start and end time`,
                                data : {
                                    checkTime : moment(this.mCheckTime).format("DD-MM-YYYY HH:mm:ss"),
                                    startTime : moment(this.mStartTime).format("DD-MM-YYYY HH:mm:ss"),
                                    endTime : moment(this.mEndTime).format("DD-MM-YYYY HH:mm:ss"),
                                }
                            })
                        }else{
                            rejected({
                                status : false,
                                code : 404,
                                msg : `failed, check time is Between start and end time`,
                                data : {
                                    checkTime : moment(this.mCheckTime).format("DD-MM-YYYY HH:mm:ss"),
                                    startTime : moment(this.mStartTime).format("DD-MM-YYYY HH:mm:ss"),
                                    endTime : moment(this.mEndTime).format("DD-MM-YYYY HH:mm:ss"),
                                }
                            })
                        }
                    }else{
                        await rejected({ status : false, code : 500, msg : `The final value must be greater than the initial value`});
                    }

                }else{
                    await rejected({ status : false, code : 500, msg : `Time End Not Valid`});
                }
            }else{
                await rejected({ status : false, code : 500, msg : `Time Start Not Valid`});
            }
        }else{
            await rejected({ status : false, code : 500, msg : `Time Check Not Valid`});
        }

        /*let Time = function(timeString) {
            let t = timeString.split(":");
            this.hour = parseInt(t[0]);
            this.minutes = parseInt(t[1]);
            this.isBiggerThan = function(other) {
                return (this.hour > other.hour) || (this.hour === other.hour) && (this.minutes > other.minutes);
            };

            let isBetween  = await timeIsBetween(new Time(timeStart), new Time(timeEnd), new Time(timeNow));
        }
        let timeIsBetween = function(start, end, check) {
            return (start.hour <= end.hour) ? check.isBiggerThan(start) && !check.isBiggerThan(end)
                : (check.isBiggerThan(start) && check.isBiggerThan(end)) || (!check.isBiggerThan(start) && !check.isBiggerThan(end));
        }*/
    });

    /**
     *
     * @param { String }checkTime
     * @param { String } startTime
     * @param {String } endTime
     * @return {boolean}
     */
    getTimeRangeBetween = (checkTime, startTime, endTime) => {
        this.mCheckTime = checkTime.replace(":","");
        this.mStartTime = startTime.replace(":","");
        this.mEndTime = endTime.replace(":","");
        return ((this.mCheckTime >= this.mStartTime && this.mCheckTime <= this.mEndTime));

    };
    /**
     *
     * @param {Number | String} time
     * @param {Number} numberAdd
     * @param {"milliseconds" |"seconds" | "minutes" | "hours" | "days" | "weeks" | "months"} unit
     * @returns Promise<Object>
     */
    addTime = async (time, numberAdd, unit) => await new Promise(async (resolve, rejected) => {
        switch (typeof time) {
            case "string" :
                this.mTime = await moment(time,"DD-MM-YYYY HH:mm:ss");
                if (typeof numberAdd !== "number"){
                    let timeMoment = this.mTime.add(numberAdd, unit);
                    await resolve({
                        humanize : timeMoment.format("DD-MM-YYYY HH:mm:ss"),
                        unix : timeMoment.unix()
                    })
                }else{
                    await rejected({ status : false, code : 500, msg : `Illegal Format Type NumberAdd`});
                }
                break;
            case "number" :

                break;
            default :
                break;
        }
    })
}


export default timeManagement;