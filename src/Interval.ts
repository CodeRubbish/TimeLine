const format = ( arr , endTime ) => {
    const useArr=arr.slice();
    const re = [];
    if ( useArr.length % 2 !== 0 ) useArr.push( endTime );
    let i = 0;
    while ( i < useArr.length ) {
        if ( useArr[ i ] >= useArr[ i + 1 ] ) {
            i = Infinity;
            break;
        }
        re.push( [ useArr[ i ] , useArr[ ++i ] ] );
        i++;
    }
    return re;
};
const getTime = ( time , intervals ) => {
    let d = 0;
    if ( time ) {
        intervals.some( ( [ start , end ] ) => {
            if ( time < start ) {
                return true;
            }
            if ( time > end ) {
                d += end - start;
                return false;
            }
            d += time - start;
            return true;
        } );
    }
    return d;
};

export class Interval {
    private hasEndTime;
    private intervals: [ number , number ][];
    private readonly _initIntervals;
    
    constructor( intervals , endTime ) {
        if ( intervals.length % 2 === 0 ) {
            this.hasEndTime = true;
        }
        this._initIntervals = intervals.slice();
        Object.freeze( this.intervals );
        this.intervals = format( intervals , endTime );
    }
    
    get endTime() {
        const { intervals } = this;
        return intervals[ intervals.length - 1 ][ 1 ];
    }
    
    include( time ) {
        return this.intervals.some( ( [ start , end ] ) => time >= start && time <= end );
    }
    
    getTime( durationTime ) {
        return getTime( durationTime , this.intervals );
    }
    
    // 是否超过时间
    overTime( time ) {
        const { intervals } = this;
        return intervals[ intervals.length - 1 ][ 1 ] <= time;
    }
    
    // 是否在暂停时间
    inPaused( time ) {
        let pauseTime;
        const { intervals } = this;
        const last = intervals.length - 1;
        if ( intervals.length === 1 ) {return undefined;}
        intervals.some(
            ( value , index , arr ) => {
                if ( index === last ) {
                    return false;
                } else if ( value[ 1 ] <= time && time < arr[ index + 1 ][ 0 ] ) {
                    pauseTime = value[ 1 ];
                    return true;
                }
            }
        );
        return pauseTime;
    }
    
    setEndTime( time ) {
        const { hasEndTime } = this;
        if ( !hasEndTime ) {
            this.intervals = format( this._initIntervals , time );
        }
    }
}
