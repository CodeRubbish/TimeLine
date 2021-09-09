import { $lifeCycle$ } from "./enum";

type CallBack = () => void;
const ErrorCatch = ( prototype , name , descriptors ) => {
    const func = descriptors.value;
    descriptors.value = function ( ...args ) {
        try {
            return func.apply( this , args );
        } catch ( e ) {
            console.error( `broken on ${ name }` );
            this.status = $lifeCycle$.error;
        }
    };
    return descriptors;
};

export abstract class LifeCycle {
    private _status = $lifeCycle$.initial;
    private _onStartCallBack: CallBack;
    private _onPauseCallBack: CallBack;
    private _onResumeCallBack: CallBack;
    private _onEndCallBack: CallBack;
    private _onStopCallBack: CallBack;
    private _onUpdateCallBack: CallBack;
    private _onDestroyCallBack: CallBack;
    
    protected _start?( ...arg ): void;
    
    protected _pause?( ...arg ): void;
    
    protected _resume?( ...arg ): void;
    
    protected _end?( ...arg ): void;
    
    protected _stop?( ...arg ): void;
    
    protected _update?( ...arg ): void;
    
    protected _destroy?( ...arg ): void;
    
    @ErrorCatch
    public start( ...args ) {
        this._start && this._start.apply( this , args );
        this._onStartCallBack && this._onStartCallBack();
        this._status = $lifeCycle$.running;
        return this;
    }
    
    @ErrorCatch
    public pause( ...args ) {
        this._pause && this._pause.apply( this , args );
        this._onPauseCallBack && this._onPauseCallBack();
        this._status = $lifeCycle$.paused;
        return this;
    }
    
    @ErrorCatch
    public resume( ...args ) {
        this._resume && this._resume.apply( this , args );
        this._onResumeCallBack && this._onResumeCallBack();
        this._status = $lifeCycle$.running;
        return this;
    }
    
    @ErrorCatch
    public end( ...args ) {
        this._end && this._end.apply( this , args );
        this._onEndCallBack && this._onEndCallBack();
        this._status = $lifeCycle$.end;
        return this;
    }
    
    @ErrorCatch
    public stop( ...args ) {
        this._stop && this._stop.apply( this , args );
        this._onStopCallBack && this._onStopCallBack();
        this._status = $lifeCycle$.stop;
        return this;
    }
    
    @ErrorCatch
    public update( ...args ) {
        this._update && this._update.apply( this , args );
        this._onUpdateCallBack && this._onUpdateCallBack();
        return this;
    }
    
    @ErrorCatch
    public destroy( ...args ) {
        this._destroy && this._destroy.apply( this , args );
        this._onDestroyCallBack && this._onDestroyCallBack();
        this._status = $lifeCycle$.destroy;
        return this;
    }
    
    
    public onStart( func: CallBack ) {
        this._onStartCallBack = func;
        return this;
    }
    
    public onPause( func: CallBack ) {
        this._onPauseCallBack = func;
        return this;
    }
    
    public onResume( func: CallBack ) {
        this._onResumeCallBack = func;
        return this;
    }
    
    public onEnd( func: CallBack ) {
        this._onEndCallBack = func;
        return this;
    }
    
    public onStop( func: CallBack ) {
        this._onStopCallBack = func;
        return this;
    }
    
    public onUpdate( func: CallBack ) {
        this._onUpdateCallBack = func;
        return this;
    }
    
    public onDestroy( func: CallBack ) {
        this._onDestroyCallBack = func;
        return this;
    }
    
    public isInitial() {
        return this._status === $lifeCycle$.initial;
    }
    
    public isRunning() {
        return this._status === $lifeCycle$.running;
    }
    
    public isStop() {
        return this._status === $lifeCycle$.stop;
    }
    
    public isDestroy() {
        return this._status === $lifeCycle$.destroy;
    }
    
    public isPause() {
        return this._status === $lifeCycle$.paused;
    }
    
    public isEnd() {
        return this._status === $lifeCycle$.end;
    }
    
    public isError() {
        return this._status === $lifeCycle$.error;
    }
}

