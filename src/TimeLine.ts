import { LifeCycle } from "./LifeCycle";
import { Task }      from "./Task";
import { Interval }  from "./Interval";

/**
 * 可以添加多个任务，分别起始于不同的时间点，任务的开始，暂停等状态由时间线控制
 * 任务可以具有不同的区间，可以在100ms时候启动，200ms暂停，500ms启动，直到1000ms播放完成，
 * 那么添加任务时候可以设置区间 [100,200,500,1000]
 * 设置区间[100]代表任务从100ms开始运行到时间线结束
 * 设置区间[0,1000]代表任务从100ms开始运行到1000ms
 * 若时间线时长不够，会对所有任务产生截断效果
 * 默认任务的起始时间和结束时间与时间线时长保持一致。
 * 在未手动设置时间线时长的时候，时间线时长以最长的任务为准
 */
export class TimeLine extends LifeCycle {
    private _startTimeStamp; // 内部调用，开始时间
    private _endTimeStamp; // 内部使用，结束时间，根据_startTimeStamp和_duration计算出
    private _progress;// 播放进度
    private _duration = 0;
    private _allTaskList: Map<Task , Interval> = new Map();
    private _useTaskList: Map<Task , number> = new Map();
    private _isSetDuration; // 是否手动设置了duration
    
    public speed = 1; // 播放速度，更改此项会影响时间线内所有的任务
    public autoStart = false;
    
    private set duration( value ) {
        this._duration = value;
        this._allTaskList.forEach( interval => interval.setEndTime( value ) );
    }
    
    public get duration() {
        return this._duration;
    }
    
    public setDuration( value ) {
        this.duration = value;
        this._isSetDuration = true;
        return this;
    }
    
    protected _start( timestamp: number ): void {
        this._startTimeStamp = timestamp;
    }
    
    protected _pause( ...arg: any[] ): void {
    }
    
    protected _resume( ...arg: any[] ): void {
    }
    
    protected _end( ...arg: any[] ): void {
    }
    
    protected _stop( ...arg: any[] ): void {
    }
    
    public _update( time , deltaTime ): void {
        if ( !this.isRunning() ) {
            if ( !this.isInitial() || !this.autoStart ) return;
            this.start( time );
        }
        const { _useTaskList , _allTaskList , _startTimeStamp , duration , speed } = this;
        const durationTime = time - _startTimeStamp;
        if ( durationTime > duration ) this.end();
        // 遍历当前的任务栈，找出当前时间点应该运行的任务
        _useTaskList.clear();
        _allTaskList.forEach( ( interval , task ) => {
            if ( interval.include( durationTime ) ) {
                _useTaskList.set( task , interval.getTime( durationTime ) );
            }
        } );
        // 运行每个任务，结束执行回调函数
        _useTaskList.forEach( ( value , task ) => task.update( value / speed , deltaTime / speed ) );
    }
    
    public _destroy( ...arg: any[] ): void {
    }
    
    /**
     *
     * @param task
     * @param intervals
     */
    add( task: object , intervals: number[] ) {
        if ( !this._isSetDuration ) {
            const end = intervals[ intervals.length - 1 ];
            if ( end > this.duration ) {
                this.duration = end;
            }
        }
        this._allTaskList.set( new Task( task ) , new Interval( intervals , this.duration ) );
    }
    
}

const timeLine = new TimeLine();
const obj1 = {
    name : 'task1' ,
    update : function ( time ) {
        console.log( this.name , time );
    }
};
const obj2 = {
    name : 'task2' ,
    update : function ( time ) {
        console.log( this.name , time );
    }
};
timeLine.add( obj1 as any , [ 0 , 100 , 200 , 500 ] );
timeLine.add( <any> obj2 , [ 200 , 400 ] );

let timestamp = 0;
timeLine.autoStart = true;
setInterval( () => {
    timestamp += 100;
    timeLine.update( timestamp , 100 );
} , 100 );
