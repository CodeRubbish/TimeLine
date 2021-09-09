const format = (arr, end) => {
    if (arr.length % 2 !== 0) {
        arr.push(end);
    }
    const re = [];
    let i = 0;
    while (i < arr.length) {
        re.push([arr[i], arr[++i]]);
        i++;
    }
    return re;
};
const getTime = (time, intervals) => {
    let d = 0;
    if (time) {
        intervals.some(([start, end]) => {
            if (time < start) {
                return true;
            }
            if (time > end) {
                d += end - start;
                return false;
            }
            d += time - start;
            return true;
        });
    }
    return d;
};

export class Interval {
    private hasEndTime;
    private readonly intervals:[number,number][];
    
    constructor(intervals, endTime) {
        this.intervals = format(intervals, endTime);
    }
    
    include(time) {
        return this.intervals.some(([start, end]) => time >= start && time <= end);
    }
    
    getTime(durationTime) {
        return getTime(durationTime, this.intervals);
    }
    
    setEndTime(time) {
        const {hasEndTime,intervals} = this;
        if (!hasEndTime) {
            intervals[intervals.length - 1][1] = time;
        }
    }
}
