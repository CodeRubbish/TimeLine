import { LifeCycle } from "./LifeCycle";
import { Task }      from "./Task";
import { Interval }  from "./Interval";

type CallBack = ( ...arg ) => void;
/**
 * 可以添加多个任务，分别起始于不同的时间点，任务的开始，暂停等状态由时间线控制
 * 任务可以具有不同的区间，可以在100ms时候启动，200ms暂停，500ms启动，直到1000ms播放完成，
 * 那么添加任务时候可以设置区间 [100,200,500,1000]
 * 设置区间[100]代表任务从100ms开始运行到时间线结束
 * 设置区间[0,1000]代表任务从100ms开始运行到1000ms
 * 若时间线时长不够，会对所有任务产生截断效果
 * 在未手动设置时间线时长的时候，时间线时长以最长的任务为准
 */
export class TimeLine extends LifeCycle {
    private _startTimeStamp; // 内部调用，开始时间
    private _endTimeStamp; // 内部使用，结束时间，根据_startTimeStamp和_duration计算出
    private _pauseTimeStamp; // 暂停时候的时间
    private _duration = 0;
    private _allTaskList: Map<Task , Interval> = new Map();
    private _isSetDuration; // 是否手动设置了duration
    private _preUpdateTime; // 上一次更新的时间
    private _onProgressCallBack: CallBack;
    public speed = 1; // 播放速度，更改此项会影响时间线内所有的任务
    public autoStart = true;
    
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
    
    protected _pause( timestamp ): void {
        this._pauseTimeStamp = timestamp;
    }
    
    protected _resume( timestamp: number ): void {
        this._startTimeStamp += timestamp - this._pauseTimeStamp;
    }
    
    protected _end( ...arg: any[] ): void {
        this.update( Infinity );
        this.stop();
    }
    
    protected _stop( ...arg: any[] ): void {
        this._allTaskList.forEach( ( interval , task ) => task.stop() );
    }
    
    public _update( time ): void {
        if ( !this.isRunning() ) {
            if ( !this.isInitial() || !this.autoStart ) return;
            this.start( time );
        }
        const { _allTaskList , _startTimeStamp , duration , _preUpdateTime , speed } = this;
        const deltaTime = _preUpdateTime ? time - _preUpdateTime : 0;
        this._preUpdateTime = time;
        let durationTime = time - _startTimeStamp;
        if ( durationTime >= duration ) {
            durationTime = duration;
        }
        // 遍历当前的任务栈，找出当前时间点应该运行的任务
        _allTaskList.forEach( ( interval , task ) => {
            let updateTag = false;
            const d = interval.getTime( durationTime ); // 任务实际经过时间
            if ( interval.include( durationTime ) ) {
                if ( task.isPause() ) {
                    task.resume();
                }
                updateTag = true;
                task.update( d , deltaTime );
            }
            if ( interval.overTime( durationTime ) && !task.isStop() ) {
                if ( updateTag === false ) task.update( interval.endTime );
                task.stop();
            } else {
                const pauseTime = interval.inPaused( durationTime );
                if ( pauseTime && task.isRunning() ) {
                    if ( updateTag === false ) task.update( pauseTime );
                    task.pause();
                }
            }
        } );
        if ( durationTime >= duration ) {
            this.stop();
        }
        this._onProgressCallBack && this._onProgressCallBack( 100 * durationTime / this.duration );
    }
    
    public _destroy( ...arg: any[] ): void {
        this._allTaskList.forEach( ( intev , task ) => {
            task.destroy();
        } );
    }
    
    /**
     * 添加任务项
     * @param task
     * @param intervals
     */
    public add( task: Task , intervals: number[] ) {
        if ( !this._isSetDuration ) {
            const end = intervals[ intervals.length - 1 ];
            if ( end > this.duration ) {
                this.duration = end;
            }
        }
        this._allTaskList.set( task , new Interval( intervals , this.duration ) );
    }
    
    public onProgress( func: CallBack ) {
        this._onProgressCallBack = func;
    };
}
