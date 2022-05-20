import moment from "moment-timezone";
import _ from "lodash";

class timeManagement {

    mTime = null;
    mStartTime = null;
    mEndTime = null;
    /**
     *
     * @param config
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
     * @param {String | Number } startTime
     * @param {String | number } endTime
     * @returns {Promise<Object>}
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
     * @param {Number | String} time
     * @param {Number} numberAdd
     * @param {"milliseconds" |"seconds" | "minutes" | "hours" | "days" | "weeks" | "months"} unit
     * @returns {Promise<unknown>}
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