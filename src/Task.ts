/**
 * 一个任务具有特定的开始和结束时间
 * 任务和时间线具有几乎相同的操作
 */


export class Task {
    private readonly _runTask;
    private readonly intervals;
    
    constructor(task, taskConfig: TaskConfig) {
        this._runTask = task;
    }
    
    start() {
    }
    
    stop() {
    }
    
    end() {
    
    }
    
    pause() {
    
    }
    
    resume() {
    }
    
    update(time: number, deltaTime: number) {
    
    }
    
    // 判断该时间是否为任务运行时间
    match(time): boolean {
        
        return true;
    }
}
