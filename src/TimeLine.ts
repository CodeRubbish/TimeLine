import {Task} from "./Task";
import {Interval} from "./Interval";

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
export class TimeLine {
    private _startTimeStamp;
    private _endTimeStamp;
    private _progress;
    private _isRunning;
    private _onStartCallBack: CallBack;
    private _onStopCallBack: CallBack;
    private _onEndCallBack: CallBack;
    private _onPauseCallBack: CallBack;
    private _onResumeCallBack: CallBack;
    private _onUpdateCallBack: CallBack;
    private _onDestroyCallBack: CallBack;
    private _allTaskList: Map<Task, Interval> = new Map();
    private _useTaskList: Set<Task> = new Set();
    private _isSetDuration; // 是否手动设置了duration
    private autoStart;
    private _duration = 1000;
    
    speed = 1; // 播放速度，更改此项会影响时间线内所有的任务
    setDuration(value) {
        this.duration = value;
        this._isSetDuration = true;
    }
    
    set duration(value) {
        this._duration = value;
        this._allTaskList.forEach(interval => interval.setEndTime(value));
    }
    
    get duration() {
        return this._duration;
    }
    
    /**
     * 启动时间线
     */
    start(time) {
        this._startTimeStamp = time;
        this._isRunning = true;
    }
    
    /**
     * 停止时间线
     */
    stop() {
        this._isRunning = true;
    }
    
    /**
     * 直接跳到时间线结束状态
     */
    end() {
        this.update(Infinity, Infinity);
        this._isRunning = true;
    }
    
    /**
     * 暂停时间线
     */
    pause() {
        this._isRunning = false;
    }
    
    /**
     * 重启时间线
     */
    resume() {
        this._isRunning = true;
    }
    
    /**
     * 更新时间线
     */
    update(time: number, deltaTime: number) {
        // 如果不在运行状态，且不是自动开始的动画，则直接返回，否则自动开始
        if (!this._isRunning) {
            if (!this.autoStart) return;
            this.start(time);
        }
        const {_useTaskList, _allTaskList, _startTimeStamp, duration, speed} = this;
        const durationTime = time - _startTimeStamp;
        if (durationTime > duration) this.end();
        // 遍历当前的任务栈，找出当前时间点应该运行的任务
        _useTaskList.clear();
        _allTaskList.forEach((interval, task) => {
            if (interval.include(durationTime)) {
                _useTaskList.add(task);
            }
        });
        // 运行每个任务，结束执行回调函数
        _useTaskList.forEach(task => task.update(durationTime / speed, deltaTime / speed));
        if (this._onUpdateCallBack) this._onUpdateCallBack();
    }
    
    /**
     * 添加任务
     */
    add(task, taskConfig: TaskConfig) {
        if (!this._isSetDuration) {
            const {intervals} = taskConfig;
            if (intervals.length % 2 !== 1) {
                const end = intervals[intervals.length - 1];
                if (end > this.duration) {
                    this.duration = end;
                }
            }
        }
        this._allTaskList.add(new Task(task, taskConfig));
    }
    
    onStart(func: CallBack) {
        this._onStartCallBack = func;
        return this;
    }
    
    onStop(func: CallBack) {
        this._onStopCallBack = func;
        return this;
    }
    
    onEnd(func: CallBack) {
        this._onEndCallBack = func;
        return this;
    }
    
    onPause(func: CallBack) {
        this._onPauseCallBack = func;
        return this;
    }
    
    onResume(func: CallBack) {
        this._onResumeCallBack = func;
        return this;
    }
    
    onUpdate(func: CallBack) {
        this._onUpdateCallBack = func;
        return this;
    }
    
    onDestroy(func: CallBack) {
        this._onDestroyCallBack = func;
        return this;
    }
}

const timeLine = new TimeLine();
timeLine.start(100);

