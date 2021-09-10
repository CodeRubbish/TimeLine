const { Interval } = require( './Interval' );
describe( 'interval test' , () => {
    test( 'interval with pause and resume' , () => {
        const interv = new Interval( [ 100 , 200 , 400 , 500 ] , 500 );
        expect( interv.include( 150 ) ).toBe( true );
        expect( interv.overTime( 499 ) ).toBe( false );
        expect( interv.overTime( 500 ) ).toBe( true );
        expect( interv.inPaused( 300 ) ).toBe( 200 );
        expect( interv.inPaused( 150 ) ).toBe( undefined );
        expect( interv.inPaused( 450 ) ).toBe( undefined );
        expect( interv.getTime( 150 ) ).toBe( 50 );
        expect( interv.getTime( 250 ) ).toBe( 100 );
        expect( interv.getTime( 450 ) ).toBe( 150 );
    } );
    test( 'interval without pause' , () => {
        const interv = new Interval( [ 100 ] , 500 );
        expect( interv.include( 50 ) ).toBe( false );
        expect( interv.overTime( 499 ) ).toBe( false );
        expect( interv.overTime( 500 ) ).toBe( true );
        expect( interv.inPaused( 300 ) ).toBe( undefined );
        expect( interv.getTime( 350 ) ).toBe( 250 );
        expect( interv.endTime ).toBe( 500 );
    } );
    test( 'interval endTime set' , () => {
        const interv = new Interval( [ 100 , 200 , 300 ] , 500 );
        interv.setEndTime( 600 );
        expect( interv.endTime ).toBe( 600 );
        interv.setEndTime( 400 );
        expect( interv.endTime ).toBe( 400 );
        interv.setEndTime( 300 );
        expect( interv.include( 300 ) ).toBe( false );
        expect( interv.include( 299 ) ).toBe( false );
        expect( interv.include( 301 ) ).toBe( false );
        interv.setEndTime( 250 );
        expect( interv.endTime ).toBe( 200 );
    } );
} );
