/**
 * 一个任务具有特定的开始和结束时间
 * 任务和时间线具有几乎相同的操作
 */
import { LifeCycle } from "./LifeCycle";

export class Task extends LifeCycle {
    private readonly _runTask;
    public autoStart = true;
    
    constructor( task ) {
        super();
        this._runTask = task;
    }
    
    protected _start( ...arg ): void {
        this._runTask.start && this._runTask.start.apply( this._runTask , arg );
    }
    
    protected _resume( ...arg ): void {
        console.log( `${ this._runTask.name } resume` );
        this._runTask.resume && this._runTask.resume.apply( this._runTask , arg );
    }
    
    protected _pause( ...arg ): void {
        console.log( `${ this._runTask.name } paused` );
        this._runTask.pause && this._runTask.pause.apply( this._runTask , arg );
    }
    
    protected _end( ...arg ): void {
        console.log( `${ this._runTask.name } end` );
        this._runTask.end && this._runTask.end.apply( this._runTask , arg );
    }
    
    protected _stop( ...arg ): void {
        console.log( `${ this._runTask.name } stop` );
        this._runTask.stop && this._runTask.stop.apply( this._runTask , arg );
    }
    
    protected _update( time , deltaTime ) {
        if ( !this.isRunning() ) {
            if ( !this.isInitial() || !this.autoStart ) return;
            this.start();
        }
        this._runTask.update && this._runTask.update( time , deltaTime );
    }
    
    protected _destroy( ...arg ): void {
        this._runTask._destroy && this._runTask._destroy.apply( this._runTask , arg );
    }
}
